'use-strict';

const log = require('./logger');
require('sequelize');
const MsgRec = require('./database/model/messageRecord');
const sha256 = require('js-sha256');

const handle = (timestamp, msg, groupid, userid) => {
	if (msg.length > 256) msg = '长消息';
	const hash = sha256.sha256.create();
	hash.update(groupid);
	const group = hash.hex();
	hash.update(userid);
	const user = hash.hex();
	MsgRec.create({
		mtime: timestamp,
		msg: msg,
		group: group,
		user: user
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
