'use-strict';
const log = require('./logger');
const fetch = require('node-fetch');
let subscribes = [];
const isOnLive = async (id) => {
	return new Promise((Status) => {
		fetch('https://api.live.bilibili.com/room/v1/Room/room_init?id=' + id)
			.then((res) => {
				try {
					(async ()=>{
						const json = await res.json();
						const data = json.data;
						log.info(data);
						if (data && data.live_status!=undefined) {
							log.info('直播状态获取结果'+data.live_status);
							Status(data.live_status==1);
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
monitor.addSub = (id)=>{
	subscribes.push(id);
};
monitor.isOnLiveAsync = async (id)=>{
	return await isOnLive(id);
};
module.exports=monitor;