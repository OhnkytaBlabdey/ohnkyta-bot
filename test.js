const jielong = require('./routes/apps/jielong');
(async () => {
	const rep = await jielong(123, '龙子');
	console.log('rep' + rep);
})();
