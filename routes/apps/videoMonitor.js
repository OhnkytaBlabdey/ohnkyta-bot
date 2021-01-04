'use-strict';
const log = require('./logger');
const sendReply = require('./Util').sendReply;
const fetch = require('node-fetch');
const config = require('../../config.json');
const path = require('path');
let dataStore = require('nedb');

let db = new dataStore({
	filename: path.resolve(__dirname, '../../videoSubscribe.ndb')
});
db.loadDatabase((err) => {
	if (err) {
		log.warn(err);
	}
});

const getVideoList = async (mid) => {
	return new Promise((vlist) => {
		fetch(
			'https://api.bilibili.com/x/space/arc/search?mid=' +
				mid +
				'&ps=30&tid=0&pn=1&keyword=&order=pubdate&jsonp=jsonp',
			{
				credentials: 'include',
				headers: {
					cookie: config['cookie']
				}
			}
		)
			.then((res) => {
				try {
					(async () => {
						const json = await res.json();
						const data = json.data;
						log.debug(json);
						if (data && data.list && data.list.vlist) {
							log.debug(data.list.vlist);
							vlist(data.list.vlist);
						} else {
							log.warn(
								'参数',
								'https://api.bilibili.com/x/space/arc/search?mid=' +
									mid +
									'&ps=30&tid=0&pn=1&keyword=&order=pubdate&jsonp=jsonp'
							);
							vlist(null);
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

let monitor = {};
monitor.chk = async (id, group_id) => {
	//TODO 没有记录时直接返回
	db.find(
		{
			gid: group_id,
			mid: id
		},
		async (err, vlist_c) => {
			if (err) {
				log.warn(err);
				return;
			}
			if (vlist_c.length == 0) {
				log.warn('没有这个用户的投稿缓存');
				log.warn('查询参数：', id, group_id);
				return;
			}
			const lav_cache = vlist_c[0].latestAid;
			const vlist = await getVideoList(id);
			const lav = vlist[0]['aid'];
			if (lav && lav != lav_cache) {
				//更新了视频
				sendReply(
					group_id,
					vlist[0]['author'] +
						'更新了视频\n' +
						+'https://www.bilibili.com/video/av' + lav + '\n' +
						+'b23.tv/' + vlist[0]['bvid'] + '\n' +
						vlist[0]['title'] + '\n' +
						'[CQ:image,file=https:' +
						vlist[0]['pic'] +
						']\n' +
						vlist[0]['description']
				);
				db.update(
					{
						gid: group_id,
						mid: id
					},
					{
						gid: group_id,
						mid: id,
						latestAid: lav
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
monitor.addSub = async (id, group_id) => {
	db.find(
		{
			gid: group_id,
			mid: id
		},
		(err, docs) => {
			if (err) {
				log.warn(err);
			}
			if (docs.length > 0) {
				log.info('订阅重复添加', id);
				sendReply(group_id, '用户ID为 “' + id + '” 的投稿视频已经订阅过了');
				//return false;
				return;
			}
			log.info('订阅未重复添加', id);
			//TODO 写入订阅记录
			db.insert(
				{
					mid: id,
					gid: group_id,
					latestAid: 0
				},
				(err, doc) => {
					if (err) {
						log.warn(err);
						return;
					}
					log.info('视频订阅添加', id);
					log.info(doc);
					monitor.chk(id, group_id);
				}
			);

			log.info('反馈订阅执行情况');
			sendReply(group_id, id + '视频订阅成功');
		}
	);
};
monitor.removeSub = async (id, group_id) => {
	//TODO 删记录，停止轮询
	log.info('取消视频订阅', id, group_id);
	db.remove(
		{
			mid: id,
			gid: group_id
		},
		(err, num) => {
			if (err) {
				log.warn(err);
				return;
			}
			log.info('订阅取消', id, num);
			if (num > 0) sendReply(group_id, '【' + id + '】 的视频订阅取消了');
		}
	);
};
//轮询查库
setInterval(async () => {
	db.find({}, (err, docs) => {
		if (err) {
			log.warn(err);
		}
		docs.forEach((sub) => {
			monitor.chk(sub.mid, sub.gid);
		});
	});
}, 120000);

module.exports = monitor;
