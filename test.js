const monitor = require('./routes/apps/liveMonitor');
const log =require('./routes/apps/logger');
monitor.addSub(528210);
(async ()=>{
	log.info(await monitor.isOnLiveAsync(528210));
})();

