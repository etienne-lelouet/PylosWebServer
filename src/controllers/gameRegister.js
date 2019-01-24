const { checkSchema, validationResult } = require("express-validator/check");
const mongoose = require("mongoose");
const User = require("../model/User");

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
				if (!value || value.length <= 3) {
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
					return Promise.reject(process.env.INVALIDLOGIN);
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
					return Promise.reject(process.env.INVALIDLOGIN);
				}
				return true;
			}
		}
	},
	moveList: {
		in: [ "body" ],
		custom: {
			options: (value) => {
				console.log(value);
			}
		}
	}
});

const gameRegisterController = (req, res) => {
	try {
		console.log(req.body);
		if (mongoose.connection.readyState === 0) {
			throw new Error("No connection to DB");
		}
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array().map(({ param, msg }) => ({ type: "param", param, msg }))
			});
		}
	} catch (e) {
		console.log(e);
	}
};

module.exports = { checkGameRegister, gameRegisterController };
