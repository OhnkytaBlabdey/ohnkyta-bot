'use-strict';
const log = require('./logger');
const fetch = require('node-fetch');
const axios = require('axios');
const config = require('../../config.json');
const path = require('path');
let dataStore = require('nedb');

let db = new dataStore({
	filename: path.resolve(__dirname, '../../liveSubscribe.ndb')
});
db.loadDatabase((err) => {
	if (err) {
		log.warn(err);
	}
});

const sendReply = async (gid, msg) => {
	const url = 'http://localhost:5700/send_group_msg';
	axios.default
		.get(url, {
			params: {
				access_token: config['auth'],
				group_id: gid,
				message: msg
			}
		})
		.catch((err) => {
			if (err) log.warn(err);
		});
};
const getRoomInfo = async (uid) => {
	return new Promise((info) => {
		fetch(
			'https://api.live.bilibili.com/room/v1/Room/getRoomInfoOld?mid=' + uid
		)
			.then((res) => {
				try {
					(async () => {
						const json = await res.json();
						const data = json.data;
						log.info(json);
						log.info(data);
						if (data && data.title && data.cover) {
							info(data);
						} else {
							log.warn(
								'参数',
								'https://api.live.bilibili.com/room/v1/Room/getRoomInfoOld?mid=' +
									uid
							);
						}
					})();
				} catch (err) {
					log.warn(err);
				}
			})
			.catch((err) => {
				if (err) log.warn(err);
			});
	});
};
const roomInit = async (id) => {
	return new Promise((Status) => {
		fetch('https://api.live.bilibili.com/room/v1/Room/room_init?id=' + id)
			.then((res) => {
				try {
					(async () => {
						const json = await res.json();
						const data = json.data;
						log.debug(data);
						if (data && data.live_status != undefined) {
							log.debug(id + '直播状态获取结果' + data.live_status);
							Status(data);
						}
					})();
				} catch (error) {
					log.warn(error);
				}
			})
			.catch((err) => {
				if (err) {
					log.warn(err);
				}
			});
	});
};

let monitor = {};
monitor.chk = async (id, name, group_id) => {
	//TODO 访问
	db.find(
		{
			gid: group_id,
			lid: id
		},
		async (err, subs) => {
			if (err) {
				log.warn(err);
			}
			if (subs.length == 0) {
				log.warn('没有这个直播间的记录');
				log.warn('查询参数：', id, name, group_id);
				return;
			}
			const flag = subs[0].mentioned;
			const room = await roomInit(id);
			const isOn = room.live_status == 1;

			if (isOn && !flag) {
				// 提醒开播
				log.info('检测到订阅的直播' + id + '开始，要通知');
				const info = await getRoomInfo(room.uid);
				const title = info.title;
				const coverUrl = info.cover;
				sendReply(
					group_id,
					'【' +
						name +
						'】 的直播开始了\n' +
						'直播间：' +
						'https://live.bilibili.com/' +
						id +
						'\n' +
						'【' +
						title +
						'】\n' +
						'[CQ:image,file=' +
						coverUrl +
						']'
				);
				subs[0].mentioned = true;
				db.update(
					{
						gid: group_id,
						lid: id
					},
					{
						gid: group_id,
						lid: id,
						name: name,
						mentioned: true
					},
					{},
					(err, ct) => {
						if (err) {
							log.warn(err);
						}
						if (ct != 1) {
							log.warn('替换了多个记录', ct);
						}
					}
				);
			} else if (!isOn && flag) {
				// 提醒下播
				log.info('检测到订阅的直播结束，要通知');
				sendReply(group_id, '【' + name + '】 的直播结束了');
				subs[0].mentioned = false;
				db.update(
					{
						gid: group_id,
						lid: id
					},
					{
						gid: group_id,
						lid: id,
						name: name,
						mentioned: false
					},
					{},
					(err, ct) => {
						if (err) {
							log.warn(err);
						}
						if (ct != 1) {
							log.warn('替换了多个记录', ct);
						}
					}
				);
			}
		}
	);
};
monitor.addSub = async (id, name, group_id) => {
	db.find(
		{
			gid: group_id,
			lid: id
		},
		(err, docs) => {
			if (err) {
				log.warn(err);
			}
			if (docs.length > 0) {
				log.info('订阅重复添加', id);
				sendReply(group_id, '房间号为 “' + id + '” 的直播已经订阅过了');
				//return false;
				return;
			}
			log.info('订阅未重复添加', id);
			//TODO 写入订阅记录
			db.insert(
				{
					lid: id,
					gid: group_id,
					name: name,
					mentioned: false
				},
				(err, doc) => {
					if (err) {
						log.warn(err);
						return;
					}
					log.info('订阅添加', id);
					log.info(doc);
					monitor.chk(id, name, group_id);
					//return true;
				}
			);

			setInterval(() => {
				monitor.chk(id, name, group_id);
			}, 60000);
			log.info('反馈订阅执行情况');
			sendReply(group_id, '【' + name + '】 的直播订阅成功');
		}
	);
};
monitor.isOnLiveAsync = async (id) => {
	return await roomInit(id);
};
//TODO 启动时读取所有的订阅消息，并对它们添加轮询任务
db.find({}, (err, docs) => {
	if (err) {
		log.warn(err);
	}
	docs.forEach((sub) => {
		monitor.chk(sub.lid, sub.name, sub.gid);
		setInterval(() => {
			monitor.chk(sub.lid, sub.name, sub.gid);
		}, 60000);
	});
});
module.exports = monitor;
