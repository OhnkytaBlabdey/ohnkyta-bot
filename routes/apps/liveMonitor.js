'use-strict';
const log = require('./logger');
const fetch = require('node-fetch');
const axios = require('axios');
const config = require('../../config.json');
let subscribes = [];
const isOnLive = async (id) => {
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
							Status(data.live_status == 1);
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
monitor.addSub = (id, name, group_id) => {
	const url = 'http://localhost:5700/send_group_msg';
	if (
		subscribes.filter((e) => {
			return e.lid == id && e.gid == group_id;
		}).length > 0
	) {
		log.info('已经添加过了');
		axios.default
			.get(url, {
				params: {
					access_token: config['auth'],
					group_id: group_id,
					message: '【' + id + '】 的直播已经订阅过了'
				}
			})
			.catch((err) => {
				if (err) log.warn(err);
			});
		return false;
	}
	subscribes.push({
		//TODO 访问
		lid: id,
		gid: group_id,
		mentioned: false
	});

	setInterval(async () => {
		let subs = subscribes.filter((e) => {
			return e.lid == id && e.gid == group_id;
		});
		if (subs.length != 1) {
			log.warn('内存里没有这个直播间的记录');
			return;
		}
		const flag = subs[0].mentioned;
		const isOn = await isOnLive(id);

		if (isOn && !flag) {
			// 提醒开播
			log.info('检测到订阅的直播开始，要通知');
			axios.default
				.get(url, {
					params: {
						access_token: config['auth'],
						group_id: group_id,
						message:
							'【' + name +'】 的直播开始了\n' +
							'直播间：' +
							'https://live.bilibili.com/' + id
					}
				})
				.catch((err) => {
					if (err) log.warn(err);
				});
			subs[0].mentioned = true;
		} else if (!isOn && flag) {
			// 提醒下播
			log.info('检测到订阅的直播结束，要通知');
			axios.default
				.get(url, {
					params: {
						access_token: config['auth'],
						group_id: group_id,
						message: '【' + name + '】 的直播结束了'
					}
				})
				.catch((err) => {
					if (err) log.warn(err);
				});
			subs[0].mentioned = false;
		}
	}, 60000);
	log.info('反馈订阅执行情况');
	axios.default
		.get(url, {
			params: {
				access_token: config['auth'],
				group_id: group_id,
				message: '【' + name + '】 的直播订阅成功'
			}
		})
		.catch((err) => {
			if (err) log.warn(err);
		});
	return true;
};
monitor.isOnLiveAsync = async (id) => {
	return await isOnLive(id);
};
module.exports = monitor;
