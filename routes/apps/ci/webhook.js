const http = require('http');
const createHandler = require('github-webhook-handler');
const spawn = require('child_process').spawn;
const config = require('../../../config.json');
const handler = createHandler({
	path: '/',
	secret: config['ci_key']
});
const log = require('../logger');
log.info(process.cwd());
http
	.createServer((req, res) => {
		handler(req, res, function (err) {
			res.statusCode = 404;
			res.end('no such location');
			log.warn(err);
		});
	})
	.listen(10001);

handler.on('error', (err) => {
	log.error('Error:', err.message);
});
const rumCommand = (cmd, args, callback) => {
	const child = spawn(cmd, args);
	let response = '';
	child.stdout.on('data', (buffer) => (response += buffer.toString()));
	child.stdout.on('end', () => callback(response));
};
rumCommand('ls', ['-l'], (txt) => {
	log.info('webhook initialized on', txt);
});
handler.on('push', (event) => {
	log.info(
		'Received a push event for %s to %s',
		event.payload.repository.name,
		event.payload.ref
	);
	rumCommand('sh', ['./bot_sync.sh'], (txt) => {
		log.info(txt);
	});
});
