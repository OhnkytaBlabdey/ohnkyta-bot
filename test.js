const monitor = require('./routes/apps/liveMonitor');
const log =require('./routes/apps/logger');
// monitor.addSub(3, 'qwq', 123);
(async ()=>{
	log.info(await monitor.isOnLiveAsync(528210));
})();
log.info(RegExp(/^直播订阅\s\d+\s\S+/).test('直播订阅 1 qwq'));
log.info(RegExp(/^直播订阅\s\d+\s\S+/).test('直播订阅 1 '));
log.info(RegExp(/^直播订阅\s\d+\s\S+/).test('直播订阅 1a aa'));
log.info(RegExp(/^直播订阅\s\d+\s\S+/).test('直播订阅 1 aa bb'));
log.info(__dirname);
log.info(process.cwd());
