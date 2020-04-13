const express = require('express');
const router = express.Router();
const bunyan = require('bunyan');
const log = bunyan.createLogger({
	name: 'hook',
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
	const message_type = req.data.message_type;
	log.info(req);
	log.info(req.data);
	if (message_type === 'group' && req.data.sender.user_id != 1345832339) {
		res.json({
			reply: req.data.sebder.card + '说：' + req.data.message,
			auto_escape: false,
			at_sender: false
		});
	}
	next();
});

module.exports = router;
