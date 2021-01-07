const express = require('express');
const router = express.Router();
const drawYunshi = require('./apps/yunshi');
const drawMingyan = require('./apps/mingyan');
const log = require('./apps/logger');
const saver = require('./apps/saveRec');
const jielong = require('./apps/jielong');
const drawSpell = require('./apps/spellCard');
const setu = require('./apps/setu');
const chatSync = require('./apps/chatSync');
require('./apps/thunderNotify');
const child_process = require('child_process');
const liveMonitor = require('./apps/liveMonitor');
const videoMonitor = require('./apps/videoMonitor');
const axios = require('axios');
const config = require('../config.json');

let latestReq = new Map();
const reqThreshold = 5;
router.post('/', function (req, res) {
	// TODO 限制频率，针对QQ号
	const uid = req.body.user_id;
	if(!latestReq.get(uid)){
		latestReq.set(uid, []);
		let now = new Date().getTime();
		latestReq.get(uid).push(now);
		if(latestReq.get(uid).length>reqThreshold){
			let prev = latestReq.get(uid).shift();
			if((prev-now) < 60000){
				res.status(204);
				res.end();
				return;
			}
		}
	}
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
					at_sender: false,
					reply: 'HTTP API功能正常[CQ:face,id=179]'
				});
			} else if (
				'歪比巴卜' === req.body.message &&
				req.body.user_id == 1263189143
			) {
				res.send({
					at_sender: false,
					reply: '即将重启[CQ:face,id=178]'
				});
				const shell_cmd =
					'cross-env NODE_ENV=production PORT=9961 TZ=\'Asia/Shanghai\' pm2 restart ohnkyta-bot --update-env';
				child_process.exec(shell_cmd, (err, stdout, stderr) => {
					if (err) log.warn(err);
					if (stdout) log.warn(stdout);
					if (stderr) log.warn(stderr);
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
			} else if (RegExp(/^\/色图[\s\S+]?/).test(req.body.message)) {
				let keyword = null;
				if(RegExp(/^\/色图\s\S+/).test(req.body.message))
					keyword = req.body.message.split(RegExp(/\s/), 2)[1];
				setu(req.body.group_id, keyword);
			} else if (
				RegExp(/^直播订阅\s\d+\s\S+/).test(req.body.message) &&
				req.body.user_id == 1263189143
			) {
				res.status(204);
				const group_id = req.body.group_id;
				const params = req.body.message.split(RegExp(/\s/), 3);
				const idStr = params[1];
				const id = parseInt(idStr);
				const name = params[2];
				liveMonitor.addSub(id, name, group_id);
			} else if (
				RegExp(/^取消直播订阅\s\d+/).test(req.body.message) &&
				req.body.user_id == 1263189143
			) {
				res.status(204);
				const group_id = req.body.group_id;
				const params = req.body.message.split(RegExp(/\s/), 2);
				const idStr = params[1];
				const id = parseInt(idStr);
				liveMonitor.removeSub(id, group_id);
			} else if (
				RegExp(/^视频订阅\s\d+/).test(req.body.message) &&
				req.body.user_id == 1263189143
			) {
				res.status(204);
				const group_id = req.body.group_id;
				const params = req.body.message.split(RegExp(/\s/), 2);
				const idStr = params[1];
				const id = parseInt(idStr);
				videoMonitor.addSub(id, group_id);
			} else if (
				RegExp(/^取消视频订阅\s\d+/).test(req.body.message) &&
				req.body.user_id == 1263189143
			) {
				res.status(204);
				const group_id = req.body.group_id;
				const params = req.body.message.split(RegExp(/\s/), 2);
				const idStr = params[1];
				const id = parseInt(idStr);
				videoMonitor.removeSub(id, group_id);
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
				if (req.body.group_id == 905253381) {
					//有时会出现unknown
					const title =
						(req.body.sender.title !== 'unknown' && req.body.sender.title) ||
						'群成员';
					const card = req.body.sender.card || req.body.sender.nickname;
					const message = req.body.message;
					chatSync(title, card, message);
				}
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

router.post('/frps', function (req, res) {
	log.info('处理frps请求');
	if (req.body && req.body.content && req.body.content.proxy_name) {
		// 发送通知
		const url = 'http://localhost:5700/send_group_msg';
		axios.default.get(url, {
			params: {
				access_token: config['auth'],
				group_id: 905253381,
				message: '【' + req.body.content.proxy_name + '】 的连接已建立'
			}
		});
		res.status(200).send({
			reject: false,
			unchange: true
		});
		res.end();
	}
	log.info(req.body);
});

module.exports = router;
