'use-strict';

const bunyan = require('bunyan');
const path = require('path');
const logger = bunyan.createLogger({
	name: 'bot',
	time:(()=>{
		return new Date().toLocaleString();
	})(),
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
			count: 8
		},
		{
			level: 'warn',
			type: 'rotating-file',
			path: path.normalize(__dirname + '/../..') + '/log/warn/warns.log',
			period: '24h',
			count: 8
		}
	]
});

module.exports = logger;
