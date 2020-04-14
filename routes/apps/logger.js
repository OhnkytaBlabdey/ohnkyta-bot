'use-strict';

const bunyan = require('bunyan');
const logger = bunyan.createLogger({
	name: 'bot',
	time: new Date().toString(),
	streams: [
		{
			level: 'info',
			stream: process.stdout
		},
		{
			level: 'info',
			type: 'rotating-file',
			path: './log/info/infos.log',
			period: '6h',
			count: 64
		}
	]
});

module.exports = logger;
