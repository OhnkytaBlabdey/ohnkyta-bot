'use-strict';
const Axios = require('axios');
const log = require('./logger');
const cheerio = require('cheerio');
const random = require('random');
let spellCardData = [
	{
		game: '请稍候',
		character: '请稍候',
		name: '请稍候'
	}
];
const spellUrl = 'https://thwiki.cc/%E7%AC%A6%E5%8D%A1%E5%88%97%E8%A1%A8';

let htmlContent = null;
(async () => {
	htmlContent = await Axios.get(spellUrl);
	log.debug(typeof htmlContent);
	log.debug(htmlContent.status);
	log.debug(typeof htmlContent.data);
	log.debug(htmlContent.data.length);
	const $ = cheerio.load(htmlContent.data);
	$('h2 .mw-headline').each((i, e) => {
		let game = $(e).first().text();
		log.debug(game);
		let p = $(e).parent().next();
		while (!$(p).is('h2') && !$(p).is('div')) {
			if ($(p).is('h3')) {
				let character = $(p).children().eq(1).first().text();
				log.debug('-' + character);
				let q = $(p).next();
				if ($(q).is('ul')) {
					$(q)
						.children()
						.each((index, el) => {
							log.debug('--' + $(el).text());
							spellCardData.push({
								game: game,
								character: character,
								name: $(el).text()
							});
						});
					p = $(q).next();
				}
			}
			// log.info($(p).text());
			else {
				p = $(p).next();
			}
		}
		log.debug(game + 'end');
	});
	spellCardData.shift();
	log.info('符卡爬取结束');
})();

const drawSpell = () => {
	return spellCardData[random.int(0, spellCardData.length - 1)];
};

module.exports = drawSpell;
