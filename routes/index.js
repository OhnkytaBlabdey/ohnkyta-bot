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
router.post('/', function (req, res, next) {
	log.info(req.body);
	const message_type = req.body.message_type;
	// log.info(req);
	if (message_type === 'group' && req.body.sender.user_id != 1345832339) {
		res.json({
			reply: req.body.sebder.card + '说：' + req.body.message,
			auto_escape: false,
			at_sender: false
		});
	} else {
		res.json({
			reply: '其他'
		});
	}
	next();
});

module.exports = router;
