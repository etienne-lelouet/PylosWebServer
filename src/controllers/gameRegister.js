const { checkSchema, validationResult } = require("express-validator/check");
const mongoose = require("mongoose");
const User = require("../model/User");
const Game = require("../model/Game");

const checkGameRegister = () => checkSchema({

	loginPlayerWhite: {
		in: [ "body" ],
		custom: {
			options: (value) => {
				if (!value || value.length <= 3) {
					return Promise.reject(process.env.UNAVAILABLEDATA);
				}
				return User.findOne({ login: value }).then((user) => {
					if (!user) {
						return Promise.reject(process.env.UNAVAILABLEDATA);
					}
				});
			}
		}
	},
	loginPlayerBlack: {
		in: [ "body" ],
		custom: {
			options: (value) => {
				if (!value || value.length <= 3) {
					return Promise.reject(process.env.UNAVAILABLEDATA);
				}
				return User.findOne({ login: value }).then((user) => {
					if (!user) {
						return Promise.reject(process.env.UNAVAILABLEDATA);
					}
				});
			}
		}
	},
	winner: {
		in: [ "body" ],
		custom: {
			options: (value, { req }) => {
				if (!value) {
					return Promise.reject(process.env.UNAVAILABLEDATA);
				}
				if (value !== req.body.loginPlayerBlack && value !== req.body.loginPlayerWhite) {
					return Promise.reject(process.env.UNAVAILABLEDATA);
				}
				return true;
			}
		}
	},
	winnerScore: {
		in: [ "body" ],
		custom: {
			options: (value) => {
				if (!value) {
					return Promise.reject(process.env.UNAVAILABLEDATA);
				}
				return true;
			}
		}
	},
	loserScore: {
		in: [ "body" ],
		custom: {
			options: (value) => {
				if (!value) {
					return Promise.reject(process.env.UNAVAILABLEDATA);
				}
				return true;
			}
		}
	},
	moveList: {
		in: [ "body" ],
		custom: {
			options: (value) => {
				const authorizedValues = [ "white", "black" ];
				const valueAsArray = JSON.parse(value);
				valueAsArray.forEach((move) => {
					if (!authorizedValues.includes(move.couleurPion)) {
						return Promise.reject(process.env.UNAVAILABLEDATA);
					}
					if (!Number.isInteger(move.hauteur) || !Number.isInteger(move.xPos) || !Number.isInteger(move.yPos)) {
						return Promise.reject(process.env.UNAVAILABLEDATA);
					}
				});
				return true;
			}
		}
	}
});

const gameRegisterController = (req, res) => {
	try {
		if (mongoose.connection.readyState === 0) {
			throw new Error("No connection to DB");
		}
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array().map(({ param, msg }) => ({ type: "param", param, msg }))
			});
		}
		const {
			loginPlayerWhite, loginPlayerBlack, winner, winnerScore, loserScore, moveList
		} = req.body;
		const game = new Game({
			loginPlayerWhite, loginPlayerBlack, winner, winnerScore, loserScore, moveList: JSON.parse(moveList)
		});

		console.log(game);

		User.findOneAndUpdate({ login: winner }, { $inc: { nbParties: 1, nbVictoires: 1, score: winnerScore } }, (e) => {
			if (e) {
				return res.status(500).json({
					errors: [ {
						type: "other",
						msg: "registerFailed"
					} ]
				});
			}
		});
		let loser;

		if (winner === loginPlayerWhite) {
			loser = loginPlayerBlack;
		} else {
			loser = loginPlayerWhite;
		}

		User.findOneAndUpdate({ login: loser }, { $inc: { nbParties: 1, nbDefaites: 1, score: -loserScore } }, (e) => {
			if (e) {
				return res.status(500).json({
					errors: [ {
						type: "other",
						msg: "registerFailed"
					} ]
				});
			}
		});

		game.save((e) => {
			if (e) {
				return res.status(500).json({
					errors: [ {
						type: "other",
						msg: "registerFailed"
					} ]
				});
			}
			return res.status(200).json({
			});
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({ errors: [ { type: "other", msg: "unavailableData" } ] });
	}
};

module.exports = { checkGameRegister, gameRegisterController };
