'use-strict';
const log = require('./logger');
const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const config = require('../../config.json');
const tcpHandler = require('./tcpYunWanJia');
const handle = (title, card, msg) => {
	const dat = ((title && '【' + title + '】') || '') + card + '：' + msg;
	const timestamp = new Date().valueOf();
	const sha256 = crypto.createHash('sha256');
	sha256.update(dat + timestamp + config['salt']);
	const hash = sha256.digest('hex');
	log.info('同步群聊', dat, timestamp, hash);
	if (tcpHandler.checkConn()) {
		let key = config['chat_key'];
		// 初始向量 initial vector 16 位
		let iv = 'fdkmfogfhhldldjf';
		// key 和 iv 可以一致
		key = CryptoJS.enc.Utf8.parse(key);
		iv = CryptoJS.enc.Utf8.parse(iv);
		let encrypted = CryptoJS.AES.encrypt(dat, key, {
			iv: iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
		// 转换为字符串
		encrypted = encrypted.toString();
		tcpHandler.send(
			JSON.stringify({
				msg: encrypted,
				time: timestamp,
				token: hash,
				type: 'msg'
			})
		);
	} else {
		tcpHandler.getConnAndSend(
			JSON.stringify({
				msg: dat,
				time: timestamp,
				token: hash,
				type: 'msg'
			})
		);
	}
};
module.exports = handle;
