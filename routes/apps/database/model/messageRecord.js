'use-strict';

const Sequelize = require('sequelize');

const connection = require('../connection');
const log = require('../../logger');
const attr = {
	mtime: {
		allowNull: false,
		comment: '消息产生时间',
		type: Sequelize.INTEGER,
		validate: {
			notNull: true
		}
	},
	msg: {
		allowNull: false,
		comment: '消息的内容',
		type: Sequelize.STRING,
		validate: {
			len: [1, 60],
			notNull: true
		}
	}
};

class MsgRec extends Sequelize.Model {}
MsgRec.init(attr, {
	sequelize: connection,
	modelName: 'msg_rec'
});
log.info(attr);
module.exports = MsgRec;
