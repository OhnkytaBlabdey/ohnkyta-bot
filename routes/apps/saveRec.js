'use-strict';

const log = require('./logger');
require('sequelize');
const MsgRec = require('./database/model/messageRecord');

const handle = (timestamp, msg) => {
	MsgRec.create({
		mtime: timestamp,
		msg: msg
	})
		.then((rec) => {
			log.info(rec, 'created');
		})
		.catch((err) => {
			if (err) {
				log.warn(err, 'in handling save record.');
			}
		});
};

module.exports = handle;
