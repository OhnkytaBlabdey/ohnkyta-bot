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
const handle = (user_id, card_name) => {
	Card.findOne({
		where: {
			name: card_name
		},
		attributes: ['head', 'tail']
	})
		.then((card) => {
			// 验证输入存在性
			if (card) {
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
					return {
						status: 'fail',
						desc: '你输了，接龙结束'
					};
				}
				// 回答
				Card.findAll({
					where: {
						head: card.tail
					},
					attributes: ['name', 'tail']
				})
					.then((cards) => {
						if (cards && cards.length >= 1) {
							let c = cards[Math.floor(Math.random() * cards.length)];
							last[user_id] = c.tail;
							return {
								status: 'ok',
								desc: c.name
							};
						} else {
							return {
								status: 'win',
								desc: '你赢了'
							};
						}
					})
					.catch((err) => {
						if (err) {
							log.warn(err);
							return {
								status: 'error',
								desc: '内部错误2'
							};
						}
					});
			} else {
				return {
					status: 'fail',
					desc: '你输了，这个卡名不存在'
				};
			}
		})
		.catch((err) => {
			if (err) {
				log.warn(err);
				return {
					status: 'error',
					desc: '内部错误1'
				};
			}
		});
};

module.exports = handle;
