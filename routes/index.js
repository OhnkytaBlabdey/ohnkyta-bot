const express = require('express');
const router = express.Router();
const drawYunshi = require('./apps/yunshi');
const drawMingyan = require('./apps/mingyan');
const log = require('./apps/logger');
const saver = require('./apps/saveRec');

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
					reply: '"' + mingyan.sentence + '"' + '\n\t————' + mingyan.author
				});
			}
		} else {
			res.status(200);
		}
	} catch (error) {
		log.warn(error);
	}
});

module.exports = router;
