'use-strict';
const log = require('./logger');
const axios = require('axios');
const sha256 = require('crypto-js/sha256');
const handle = (title, card, msg) => {
	const url = 'http:/cn-zz-/bgp.sakurafrp.com:10240';
	const dat = ((title && '【' + title + '】') || '') + card + '：' + msg;
	const timestamp = new Date().valueOf();
	const hash = sha256(dat + timestamp + 'wabiwabi');
	log.info(dat, timestamp, hash);
	axios.default.post(url, {
		msg: dat,
		time: timestamp,
		token: hash
	});
};
module.exports = handle;
