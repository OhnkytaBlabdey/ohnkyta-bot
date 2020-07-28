'use-strict';
const log = require('./logger');
const sha256 = require('crypto-js/sha256');
const config = require('../../config.json');
const tcpHandler = require('./tcpYunWanJia');
const handle = (title, card, msg) => {
	const dat = ((title && '【' + title + '】') || '') + card + '：' + msg;
	const timestamp = new Date().valueOf();
	const hash = sha256(dat + timestamp + config['salt']).toString();
	log.info('同步群聊', dat, timestamp, hash);
	if (tcpHandler.checkConn()) {
		tcpHandler.send(
			JSON.stringify({
				msg: dat,
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
