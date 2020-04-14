'use-strict';

const log = require('./logger');
require('sequelize');
const MsgRec = require('./database/model/messageRecord');
const crypto = require('crypto');

const handle = (timestamp, msg, groupid, userid) => {
	if (msg.length > 256) msg = '长消息';
	let sha256 = crypto.createHash('sha256');
	sha256.update(groupid + '');
	const group = sha256.digest('hex');
	sha256 = crypto.createHash('sha256');
	sha256.update(userid + '');
	const user = sha256.digest('hex');
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
