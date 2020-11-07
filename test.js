// const monitor = require('./routes/apps/liveMonitor');
const log =require('./routes/apps/logger');
const axios = require('axios');

// (async ()=>{
// 	log.info(await monitor.isOnLiveAsync(528210));
// 	log.info(await monitor.getInfo(15126927));
// })();
log.info(process.cwd());
axios.default.post('http://47.102.140.37:9999', {
	val:'a',
	date:'b',
	code:'7151bc597b9a0cca17c41be011f6be6f357070484c382c60f85f2ae9d2624bb9'
});