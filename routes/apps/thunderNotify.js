'use-strict';
const config = require('../../config.json');
const crypto = require('crypto');
const http = require('http');
const log = require('./logger');
const sendReply = require('./Util').sendReply;
// const { time } = require('console');

const init = () => {
	http
		.createServer((req, resp) => {
			log.debug('thunder notification from', req.headers.from);
			let body = '';
			req.on('data', function (chunk) {
				log.debug('thunder notification chunk', chunk);
				body += chunk;
			});
			req.on('end', function () {
				// 解析参数
				const params = JSON.parse(body);
				body = '';
				if (!params) {
					log.warn('不合法的json', body);
					return;
				}
				const dat = params.val;
				// const timestamp = new Date().valueOf();
				const timestamp = params.date;
				const sha256 = crypto.createHash('sha256');
				//防止注入长数据
				if ((dat + timestamp).length > 64) {
					log.info('post body 输入过长', dat + timestamp);
					return;
				}
				sha256.update(dat + timestamp + config['salt']);
				const hash = sha256.digest('hex');
				if (hash == params.code) {
					log.info({
						weather: dat,
						date: timestamp,
						hash: hash
					});
					if (hash && timestamp && dat) {
						if (dat == 'thunder') {
							sendReply(905253381, '【MC生存服】打雷啦');
						} else {
							sendReply(905253381, '【MC生存服】雷停啦');
						}
					}
				} else {
					log.warn({
						weather: dat,
						date: timestamp,
						hash: hash,
						req_hash: params.code
					});
				}
				resp.write('ok');
				resp.end();
			});
		})
		.listen(9999);
};
let out = {};
out.init = init;
init();
module.exports = out;
