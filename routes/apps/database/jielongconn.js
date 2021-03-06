'use-strict';
const Sequelize = require('sequelize');
const log = require('../logger');

const connection = new Sequelize('botdb', null, null, {
	dialect: 'sqlite',
	storage: 'cardname.db',
	define: {
		charset: 'utf8mb4',
		timestamps: false
	},
	isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
	logging: (sql) => {
		log.debug(sql);
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
