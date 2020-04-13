const express = require('express');
const router = express.Router();
const bunyan = require('bunyan');
const log = bunyan.createLogger({
	name: 'bot',
	time: new Date().toString(),
	streams: [
		{
			level: 'info',
			stream: process.stdout
		},
		{
			level: 'info',
			type: 'rotating-file',
			path: './log/info/infos.log',
			period: '6h',
			count: 64
		}
	]
});

router.post('/', function (req, res) {
	log.info({ message: req.body.message });
	log.info({ sender: req.body.sender });
	log.info({ message_type: req.body.message_type });

	try {
		if (req.body.message_type === 'group') {
			res.status(200).send({
				reply:
					(req.body.sender.card || req.body.sender.nickname) +
					'说：' +
					req.body.message,
				auto_escape: false,
				at_sender: false
			});
		}
	} catch (error) {
		log.warn(error);
	}
});

module.exports = router;
