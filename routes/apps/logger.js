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
	// stream:new MyStream(),
	streams: [
		{
			level: 'debug',
			stream: process.stdout
			// time:new Date().toLocaleString()
		},
		{
			level: 'debug',
			type: 'rotating-file',
			path: path.normalize(__dirname + '/../..') + '/log/debug/debugs.log',
			period: '4h',
			count: 128
			// stream:new MyStream(),
			// time:new Date().toLocaleString()
		},
		{
			level: 'info',
			type: 'rotating-file',
			path: path.normalize(__dirname + '/../..') + '/log/info/infos.log',
			period: '12h',
			count: 32
			// stream:new MyStream(),
			// time:new Date().toLocaleString()
		},
		{
			level: 'warn',
			type: 'rotating-file',
			path: path.normalize(__dirname + '/../..') + '/log/warn/warns.log',
			period: '24h',
			count: 64
			// stream:new MyStream(),
			// time:new Date().toLocaleString()
		}
	]
});

module.exports = logger;
