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
	// log.info({ body: req.body });
	log.info({ sender: req.body.sender });
	log.info({ user_id: req.body.sender.user_id });
	// log.info('type ', typeof req.body.sender);
	res.status(200).send({
		reply: 'hi'
	});
	return;
	// if (
	// 	req.body.message_type === 'group' &&
	// 	req.body.sender &&
	// 	req.body.sender.user_id != 1345832339
	// ) {
	// 	res.json({
	// 		reply: req.body.sebder.nickname + '说：' + req.body.message,
	// 		auto_escape: false,
	// 		at_sender: false
	// 	});
	// } else {
	// 	res.json({
	// 		reply: '其他'
	// 	});
	// }
	// res.status(200);
	// next();
});

module.exports = router;
