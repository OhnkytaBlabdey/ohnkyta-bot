'use-strict';
require('sequelize');
const log = require('./logger');
const Card = require('./database/model/cardName');

let last = {};
/**
 *
 * @param {number} user_id
 * @param {string} card_name
 * @returns {string} status
 * @returns {string} desc
 */
const handle = async (user_id, card_name) => {
	return new Promise((x) => {
		log.info('处理接龙');
		if (!user_id || !card_name) {
			x({
				status: 'fail',
				desc: '不完整'
			});
			return;
		}
		Card.findOne({
			where: {
				name: card_name
			},
			attributes: ['head', 'tail']
		})
			.then((card) => {
				// 验证输入存在性
				if (card) {
					log.info('found');
					if (last[user_id] && last[user_id] != card.head) {
						// 验证输入正确性
						// try {
						// 	async () => {
						// 		const res = await Card.count({
						// 			where: {
						// 				head: last[user_id].tail
						// 			}
						// 		});
						// 	};
						// } catch (error) {
						// 	log.warn(error);
						// 	return '内部错误3';
						// }
						log.info('failed');
						last[user_id] = null;
						x({
							status: 'fail',
							desc: '你输了，接龙结束'
						});
						return;
					}
					// 回答
					Card.findAll({
						where: {
							head: card.tail
						},
						attributes: ['name', 'tail']
					})
						.then((cards) => {
							log.info('reply');
							if (cards && cards.length >= 1) {
								let c = cards[Math.floor(Math.random() * cards.length)];
								last[user_id] = c.tail;
								x({
									status: 'ok',
									desc: c.name
								});
								return;
							} else {
								log.info('win');
								if (last[user_id]) {
									last[user_id] = null;
									x({
										status: 'win',
										desc: '你赢了'
									});
									return;
								} else {
									x({
										status: 'win',
										desc: '你只用了一步就赢了'
									});
									return;
								}
							}
						})
						.catch((err) => {
							if (err) {
								log.warn(err);
								last[user_id] = null;
								x({
									status: 'error',
									desc: '内部错误2'
								});
								return;
							}
						});
				} else {
					log.info('not exists');
					last[user_id] = null;
					x({
						status: 'fail',
						desc: '你输了，这个卡名不存在'
					});
					return;
				}
			})
			.catch((err) => {
				if (err) {
					log.warn(err);
					last[user_id] = null;
					x({
						status: 'error',
						desc: '内部错误1'
					});
					return;
				}
			});
	});
};

module.exports = handle;
