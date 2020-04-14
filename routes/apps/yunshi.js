'use-strict';
const yunshiData = [
	{
		yunshi: 'RBQ',
		desc: '你就是RBQ\n赶紧的，让群友们爽爽'
	},
	{
		yunshi: '囧仙',
		desc: '你的运势是囧仙？\n看来你得小心你的屏幕了！'
	}
];

const drawYunshi = () => {
	return yunshiData[Math.floor(Math.random() * yunshiData.length)];
};

module.exports = drawYunshi;
