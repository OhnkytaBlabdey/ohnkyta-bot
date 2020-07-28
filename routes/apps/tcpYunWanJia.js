'use-strict';
const net = require('net');
const log = require('./logger');

let handler = {};
handler.conn = false;
// 指定连接的tcp server ip，端口
const options = {
	host: 'cn-zz-bgp.sakurafrp.com',
	port: 10240
};

const tcp_client = net.Socket();

// 接收数据
tcp_client.on('data', function (data) {
	log.info('received data: %s from server', data.toString());
	handler.conn = true;
});

tcp_client.on('end', function () {
	log.info('data end!');
});

tcp_client.on('error', function (e) {
	if (e.errno === 'ETIMEDOUT') return;
	log.warn('tcp_client error!', e);
});
handler.send = (str) => {
	tcp_client.write(str);
};
handler.checkConn = () => {
	return handler.conn;
};
handler.getConnAndSend = (str) => {
	// 连接 tcp server
	// 会有连接超时错误
	tcp_client.connect(options, function () {
		log.info('connected to Server');
	});
	setTimeout(() => {
		if (!handler.conn) {
			tcp_client.end();
			log.info('tcp server not online');
		} else {
			handler.send(str);
		}
	}, 3000);
};
module.exports = handler;
