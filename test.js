const monitor = require('./routes/apps/liveMonitor');
const log =require('./routes/apps/logger');
(async ()=>{
	log.info(await monitor.isOnLiveAsync(528210));
	log.info(await monitor.getInfo(15126927));
})();
log.info(process.cwd());