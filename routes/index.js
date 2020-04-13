const express = require('express');
const router = express.Router();
const bunyan = require('bunyan');
const log = bunyan.createLogger({
	name: 'bot',
	time: new Date().toString(),
	streams: [
		{
			level: 'info',
			stream: process.stdout // log INFO and above to stdout
		},
		{
			level: 'info',
			type: 'rotating-file',
			path: './log/info/infos.log',
			period: '6h', // daily rotation : '1d'
			count: 64 // keep copies
		}
	]
});
router.post('/', function (req, res) {
	log.info({ query: req.query });
	log.info({ body: req.body });
	log.info({ sender: req.body['sender'] });
	log.info({ sender: req.body['sender']['nickname'] });
	const body = req.body;
	log.info('type ', typeof(body.sender));
	if (
		body['message_type'] === 'group' &&
		body['sender'] &&
		body['sender']['user_id'] != 1345832339
	) {
		res.json({
			reply: body['sebder']['nickname'] + '说：' + body['message'],
			auto_escape: false,
			at_sender: false
		});
	} else {
		res.json({
			reply: '其他'
		});
	}
	// next();
});

module.exports = router;
