'use-strict';

const bunyan = require('bunyan');
const path = require('path');
function MyStream() {}
MyStream.prototype.write = function (rec) {
	rec.level = bunyan.nameFromLevel[rec.level];
	rec.time = new Date().toLocaleString();
};

const logger = bunyan.createLogger({
	name: 'bot',
	streams: [
		{
			level: 'debug',
			stream: process.stdout
		},
		{
			level: 'debug',
			type: 'rotating-file',
			path: path.normalize(__dirname + '/../..') + '/log/debug/debugs.log',
			period: '4h',
			count: 128
		},
		{
			level: 'info',
			type: 'rotating-file',
			path: path.normalize(__dirname + '/../..') + '/log/info/infos.log',
			period: '12h',
			count: 32
		},
		{
			level: 'warn',
			type: 'rotating-file',
			path: path.normalize(__dirname + '/../..') + '/log/warn/warns.log',
			period: '24h',
			count: 64
		}
	]
});
let warpLogger = {};
warpLogger.logger = logger;
warpLogger.debug = (obj, ...para) => {
	logger.debug(obj, para.join(' '), new Date().toLocaleString('zh-CN'));
};
warpLogger.info = (obj, ...para) => {
	logger.info(obj, para.join(' '), new Date().toLocaleString('zh-CN'));
};
warpLogger.warn = (obj, ...para) => {
	logger.warn(obj, para.join(' '), new Date().toLocaleString('zh-CN'));
};


module.exports = warpLogger;
