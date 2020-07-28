'use-strict';
const log = require('./logger');
const crypto = require('crypto');
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
