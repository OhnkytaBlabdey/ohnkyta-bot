'use-strict';
const log = require('./logger');
const fetch = require('node-fetch');
const sendReply = require('./Util').sendReply;

const getSetu = (keyword) => {
	return new Promise((setu) => {
		fetch('https://api.lolicon.app/setu/?keyword=' + keyword)
			.then((res) => {
				try {
					(async () => {
						const json = await res.json();
						const data = json.data;
						log.debug(data);
						if (data && data[0] != undefined) {
							log.debug('色图获取结果' + data[0]);
							setu(data[0]);
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
	if (!keyword) {
		keyword = '';
	}
	const setu = await getSetu(keyword);
	if (setu.url) {
		sendReply(
			gid,
			'[CQ:image,file=' + setu.url + ']' + setu.title + '\n' + setu.author
		);
	} else {
		sendReply(gid, setu.msg);
	}
};

module.exports = handleSetu;
