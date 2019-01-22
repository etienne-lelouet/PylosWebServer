const { checkSchema, validationResult } = require("express-validator/check");
const mongoose = require("mongoose");
const User = require("../model/User");

const checkLogin = () => checkSchema({
	login: {
		in: [ "body" ],
		custom: {
			options: (value) => {
				if (value.length <= 3) {
					return Promise.reject(process.env.INVALIDLOGIN);
				}
			}
		}
	},
	password: {
		in: [ "body" ],
		custom: {
			options: (value) => {
				if (value.length <= 3) {
					return Promise.reject(process.env.INVALIDPASSWORD);
				}
			}
		}
	}
});

const loginController = (req, res) => {
	try {
		if (mongoose.connection.readyState === 0) {
			throw new Error("no connection to DB");
		}
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array().map(({ param, msg }) => ({ type: "param", param, msg }))
			});
		}
		const { login, password } = req.body;
		User.findOne(({ login }), (err, user) => {
			if (err) {
				return res.status(500).json({
					errors: [ {
						type: "other",
						msg: process.env.UNAVAILABLEDATA
					} ]
				});
			}
			if (!user) {
				return res.status(400).json({
					errors: [ {
						type: "param",
						param: "login",
						msg: process.env.LOGINDOESNOTEXIST
					} ]
				});
			}
			if (user.authentify(password)) {
				return res.status(200).json({
					token: user.getToken()
				});
			}
			return res.status(400).json({
				errors: [ {
					type: "param",
					param: "password",
					msg: process.env.INCORRECTPASSWORD
				} ]
			});
		});
	} catch (e) {
		return res.status(500).json({
			errors: [ {
				type: "other",
				msg: process.env.UNAVAILABLEDATA
			} ]
		});
	}
};

module.exports = { checkLogin, loginController };
