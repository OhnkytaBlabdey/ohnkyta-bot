'use-strict';
const log = require('./logger');
const fetch = require('node-fetch');
const config = require('../../config.json');
const sendReply = require('./Util').sendReply;

const getSetu = (keyword) => {
	return new Promise((setu) => {
		fetch(
			'https://api.lolicon.app/setu/?keyword=' +
				encodeURI(keyword) +
				'&apikey=' +
				config.setu_key
		)
			.then((res) => {
				try {
					(async () => {
						const json = await res.json();
						const data = json.data;
						log.debug(json);
						if (data.length == 0) {
							setu(json);
							return;
						} else if (data && data[0] != undefined) {
							data[0]['quota']=json['quota'];
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
const errorMsgMap = new Map([
	[-1, '内部错误，请向 i@loli.best 反馈'],
	[401, 'APIKEY 不存在或被封禁'],
	[403, '由于不规范的操作而被拒绝调用'],
	[404, '找不到符合关键字的色图'],
	[429, '达到调用额度限制']
]);
const handleSetu = async (gid, keyword) => {
	log.info('收到色图请求from', gid, keyword);
	if (!keyword) keyword = '';
	const setu = await getSetu(keyword);
	if (setu.url) {
		log.info('获取色图成功');
		sendReply(
			gid,
			'[CQ:image,file=' +
				setu.url +
				']\n' +
				setu.url +
				'\n' +
				setu.title +
				'\n' +
				setu.author+
				'\n剩余调用次数 ' + setu.quota
		);
	} else {
		log.warn('获取色图失败', setu.code);
		const errorMsg = errorMsgMap.get(setu.code);
		sendReply(gid, errorMsg);
	}
};

module.exports = handleSetu;
