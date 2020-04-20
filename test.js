// const jielong = require('./routes/apps/jielong');
const jielong = async (id, name) => {
	return new Promise((x) => {
		setTimeout(() => {
			x({
				status: 'ok'
			});
		}, 2000);
	});
};

(async () => {
	const rep = await jielong(123, '龙子');
	console.log('rep : ' + (rep.status));
	console.log('rep : ' + JSON.stringify(rep));
})();
