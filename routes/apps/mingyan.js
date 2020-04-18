'use-strict';

const d = [
	{
		sentence: '我不是，我没有，我没说过',
		author: '鲁迅'
	},
	{
		sentence: '見て見てパリさん？手コキですよ！'
	},
	{
		sentence: '打不过，就加入',
		author: '佚名'
	},
	{
		sentence: '游戏就到此为止了！',
		author: '丰聪耳神子'
	},
	{
		sentence: 'neeeeeee!'
	},
	{
		sentence: 'mooooooo!'
	}
];
const handle = () => {
	const data = d;
	return data[Math.floor(Math.random() * d.length)];
};

module.exports = handle;
