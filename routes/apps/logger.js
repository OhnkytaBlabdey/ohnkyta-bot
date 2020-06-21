'use-strict';

const bunyan = require('bunyan');
const path = require('path');
const logger = bunyan.createLogger({
	name: 'bot',
	streams: [
		{
			level: 'info',
			stream: process.stdout
		},
		{
			level: 'info',
			type: 'rotating-file',
			path: path.normalize(__dirname + '/../..') + '/log/info/infos.log',
			period: '2h',
			count: 5
		}
	]
});

module.exports = logger;
