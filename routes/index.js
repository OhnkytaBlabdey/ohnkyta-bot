const express = require('express');
const router = express.Router();

router.post('/', function (req, res, next) {
	const message_type = req.data.message_type;
	if (message_type === 'group' && req.data.sender.user_id != 1345832339) {
		res.send({
			reply: req.data.sebder.card + '说：' + req.data.message,
			auto_escape: false,
			at_sender: false
		});
	}
	next();
});

module.exports = router;
