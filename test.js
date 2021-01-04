// const monitor = require('./routes/apps/liveMonitor');
const log = require('./routes/apps/logger');
// const axios = require('axios');
// const setu = require('./routes/apps/setu');
// log.debug(process.cwd());
// log.info(process.cwd());
// log.info({
// 	a: 'a',
// 	b: [1, 2]
// });
// log.info(new Error('custom'), 'bla');
// log.info({ a: 'b' }, 'bla', 'bla');
// log.logger.info({ a: 'b' }, 'bla', 'bla');
// log.warn(process.cwd());

const aaa = 123;
const vurl = 'https://www.bilibili.com/video/av'+aaa+' \n';
log.info(vurl);
log.info(
	'abcde'+
	`更新了视频\n${vurl}` +
		'title' +
		'\n' +
		'[CQ:image,file=https:' +
		'//abaaba/234.jpg' +
		']\n'
);
