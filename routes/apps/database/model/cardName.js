'use-strict';

const Sequelize = require('sequelize');

const connection = require('../jielongconn');
const log = require('../../logger');
const attr = {
	id: {
		type: Sequelize.INTEGER
	},
	name: {
		type: Sequelize.STRING
	},
	head: {
		type: Sequelize.STRING,
		validate: {
			len: [1, 32]
		}
	},
	tail: {
		type: Sequelize.STRING,
		validate: {
			len: [1, 32]
		}
	}
};

class Card extends Sequelize.Model {}
Card.init(attr, {
	sequelize: connection,
	// disable the modification of tablenames; By default, sequelize will automatically
	// transform all passed model names (first parameter of define) into plural.
	// if you don't want that, set the following
	freezeTableName: true,

	// define the table's name
	tableName: 'texts'
});
log.info(attr);
module.exports = Card;
