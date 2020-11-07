'use-strict';
const config = require('../../config.json');
const crypto = require('crypto');
const http = require('http');
const log = require('./logger');
const sendReply = require('./Util').sendReply;
const url = require('url');

const init = () => {
	http.createServer((req, resp) => {
		const params = url.parse(req.url, true).query;
		const dat = params.val;
		// const timestamp = new Date().valueOf();
		const timestamp = params.date;
		const sha256 = crypto.createHash('sha256');
		sha256.update(dat + timestamp + config['salt']);
		const hash = sha256.digest('hex');
		if (hash == params.code) {
			log.info({
				weather: dat,
				date: timestamp,
				hash: hash
			});
			sendReply(905253381, '打雷啦');
		}else{
			log.warn({
				weather: dat,
				date: timestamp,
				hash: hash,
				req_hash:params.code
			});
		}
		resp.write('ok');
		resp.end();
	}).listen(9999);
};
let out = {};
out.init = init;
init();
module.exports = out;