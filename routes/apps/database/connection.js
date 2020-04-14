'use-strict';
const Sequelize = require('sequelize');
const log = require('../logger');

const connection = new Sequelize('botdb', null, null, {
	dialect: 'sqlite',
	storage: 'bot.db',
	define: {
		charset: 'utf8mb4'
	},
	host: '127.0.0.1',
	isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
	logging: (sql) => {
		log.warn(sql);
	},
	omitNull: true,
	sync: {
		force: true
	}
});
connection
	.authenticate()
	.then(() => {
		log.info('connected.');
		return;
	})
	.catch((err) => {
		if (err) {
			log.warn('connect failed', err);
			return;
		}
	});
module.exports = connection;
