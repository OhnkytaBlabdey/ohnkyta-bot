const express = require('express');
const router = express.Router();
const drawYunshi = require('./apps/yunshi');
const drawMingyan = require('./apps/mingyan');
const log = require('./apps/logger');
const saver = require('./apps/saveRec');
const jielong = require('./apps/jielong');
const axios = require('axios');
const config = require('../config.json');

router.post('/', function (req, res) {
	try {
		saver(req.body.time, req.body.message, req.body.group_id, req.body.user_id);
		if (req.body.message_type === 'group') {
			if (req.body.message.length > 128) {
				res.status(200);
				// .send({
				// 	reply:
				// 		(req.body.sender.card || req.body.sender.nickname) +
				// 		'说：' +
				// 		req.body.message,
				// 	auto_escape: false,
				// 	at_sender: false
				// });
			} else if (RegExp(/今日运势/).test(req.body.message)) {
				const yunshi = drawYunshi();
				res.status(200).send({
					auto_escape: false,
					at_sender: false,
					reply:
						(req.body.sender.title || req.body.sender.nickname) +
						'今天的运势是——\n' +
						'【' +
						yunshi.yunshi +
						'】！\n' +
						yunshi.desc
				});
			} else if ('/名言' == req.body.message) {
				const mingyan = drawMingyan();
				res.status(200).send({
					auto_escape: false,
					at_sender: false,
					reply:
						'"' +
						mingyan.sentence +
						'"' +
						'\n\t————' +
						(mingyan.author || '匿名')
				});
			} else if (RegExp(/^接龙\s/).test(req.body.message)) {
				const card = req.body.message.replace('接龙 ', '');
				log.info('接龙收到', { name: card });
				res.status(200);
				const group_id = req.body.group_id;
				(async () => {
					const url = 'http://localhost:5700/send_group_msg';
					const rep = jielong(req.body.sender.user_id, card);
					if (rep.status === 'ok') {
						axios.default.get(url, {
							params: {
								access_token: config['auth'],
								group_id: group_id,
								message:
									'【' +
									req.body.sender.nickname +
									'的接龙进行中】 ' +
									rep.desc
							}
						});
					} else {
						axios.default.get(url, {
							params: {
								access_token: config['auth'],

								group_id: true,
								message:
									'【' + req.body.sender.nickname + '的接龙结束】 ' + rep.desc
							}
						});
					}
				})();
			}
		} else {
			res.status(200);
		}
	} catch (error) {
		log.warn(error);
	}
});

module.exports = router;
