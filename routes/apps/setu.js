'use-strict';
const log = require('./logger');
const fetch = require('node-fetch');
const sendReply = require('./Util').sendReply;

const getSetu = (keyword) => {
	return new Promise((setu) => {
		fetch('https://api.lolicon.app/setu/?keyword=' + encodeURI(keyword))
			.then((res) => {
				try {
					(async () => {
						const json = await res.json();
						const data = json.data;
						log.debug(json);
						if (data.length == 0) {
							setu(json);
							return;
						}
						else if (data && data[0] != undefined) {
							log.debug('色图获取结果' + data[0]);
							setu(data[0]);
							return;
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

const handleSetu = async (gid, keyword) => {
	log.info('收到色图请求from', gid, keyword);
	if (!keyword) keyword = '';
	const setu = await getSetu(keyword);
	if (setu.url) {
		log.info('获取色图成功');
		sendReply(
			gid,
			'[CQ:image,file=' + setu.url + ']' + setu.title + '\n' + setu.author
		);
	} else {
		log.warn('获取色图失败');
		sendReply(gid, '没有符合条件的色图');
	}
};

module.exports = handleSetu;
