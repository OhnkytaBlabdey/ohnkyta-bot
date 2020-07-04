const express = require('express');
const router = express.Router();
const drawYunshi = require('./apps/yunshi');
const drawMingyan = require('./apps/mingyan');
const log = require('./apps/logger');
const saver = require('./apps/saveRec');
const jielong = require('./apps/jielong');
const drawSpell = require('./apps/spellCard');
const axios = require('axios');
const config = require('../config.json');

router.post('/', function (req, res) {
	try {
		if (req.body.message_type === 'group') {
			if (req.body.message.length > 128) {
				res.status(204);
				res.end();
				// .send({
				// 	reply:
				// 		(req.body.sender.card || req.body.sender.nickname) +
				// 		'说：' +
				// 		req.body.message,
				// 	auto_escape: false,
				// 	at_sender: false
				// });
			} else if ('随机符卡' === req.body.message) {
				const spell = drawSpell();
				res.send({
					auto_escape: false,
					at_sender: true,
					reply:
						// req.body.sender.nickname +
						'抽到的符卡是——\n【' +
						spell.game +
						'】中【' +
						spell.character +
						'】用的\n ' +
						spell.name
				});
			} else if (
				'歪比歪比' === req.body.message &&
				req.body.user_id == 1263189143
			) {
				res.send({
					auto_escape: true,
					at_sender: false,
					reply: 'HTTP API功能正常[CQ:face,id=14]'
				});
			} else if ('今日运势' === req.body.message) {
				//TODO 支持分时间段和分用户
				const yunshi = drawYunshi();
				res.send({
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
				res.send({
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
				res.status(204);
				res.end();
				const group_id = req.body.group_id;
				(async () => {
					const url = 'http://localhost:5700/send_group_msg';
					const rep = await jielong(req.body.sender.user_id, card);
					log.info('处理结果', rep);
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
								group_id: group_id,
								message:
									'【' + req.body.sender.nickname + '的接龙结束】 ' + rep.desc
							}
						});
					}
				})();
			} else {
				res.status(204);
				res.end();
				saver(
					req.body.time,
					req.body.message,
					req.body.group_id,
					req.body.user_id
				);
			}
		} else {
			res.status(204);
			res.end();
			log.info('收到私聊');
			saver(req.body.time, req.body.message, 0, req.body.user_id);
		}
	} catch (error) {
		log.warn(error);
	}
});

module.exports = router;
