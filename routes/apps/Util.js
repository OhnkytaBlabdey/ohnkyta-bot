'use-strict';
const axios = require('axios');
const config = require('../../config.json');
const log = require('./logger');

let Util={};
Util.sendReply = async (gid, msg) => {
	const url = 'http://localhost:5700/send_group_msg';
	axios.default
		.get(url, {
			params: {
				access_token: config['auth'],
				group_id: gid,
				message: msg
			}
		})
		.then(()=>{
			log.debug('发送了消息', msg);
		})
		.catch((err) => {
			if (err) log.warn(err);
		});
};
module.exports = Util;