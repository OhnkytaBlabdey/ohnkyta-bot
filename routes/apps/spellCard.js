'use-strict';
const Axios = require('axios');
const log = require('./logger');
const cheerio = require('cheerio');
let spellCardData = [];
const spellUrl = 'https://thwiki.cc/%E7%AC%A6%E5%8D%A1%E5%88%97%E8%A1%A8';
// const spellUrl = 'https://thwiki.cc/%E4%B8%9C%E6%96%B9%E6%B0%B8%E5%A4%9C%E6%8A%84';

let htmlContent = null;
(async () => {
	htmlContent = await Axios.get(spellUrl);
	log.info(typeof htmlContent);
	log.info(htmlContent.status);
	log.info(typeof htmlContent.data);
	log.info(htmlContent.data.length);
	const $ = cheerio.load(htmlContent.data);
	$('h2 .mw-headline').each((i, e) => {
		let game = $(e).first().text();
		log.info(game);
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
		log.info(game + 'end');
	});
})();

const drawSpell = () => {
	return spellCardData[Math.floor(Math.random() * spellCardData.length)];
};

module.exports = drawSpell;
