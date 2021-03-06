const { checkSchema, validationResult } = require("express-validator/check");
const passwordHash = require("password-hash");
const mongoose = require("mongoose");
const User = require("../model/User");

const checkRegister = () => checkSchema({
	login: {
		in: [ "body" ],
		custom: {
			options: (value) => {
				if (!value || value.length <= 3) {
					return Promise.reject(process.env.INVALIDLOGIN);
				}
				return User.findOne({ login: value }).then((user) => {
					if (user) {
						return Promise.reject(process.env.LOGININUSE);
					}
				});
			}
		}
	},
	password: {
		in: [ "body" ],
		custom: {
			options: (value, { req }) => {
				if (!value || value.length <= 3) {
					return Promise.reject(process.env.INVALIDPASSWORD);
				}
				if (value !== req.body.passwordConfirmation) {
					return Promise.reject(process.env.PASSWORDDOESNOTMATCH);
				}
				return true;
			}
		}
	},
	username: {
		in: [ "body" ],
		custom: {
			options: (value) => {
				if (!value || value.length <= 3) {
					return Promise.reject(process.env.INVALIDUSERNAME);
				}
				return true;
			}
		}
	}
});

const registerController = (req, res) => {
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
		const { login, password, username } = req.body;
		const user = new User({ login, password: passwordHash.generate(password), username });
		user.save((e) => {
			if (e) {
				console.log(e);
				return res.status(500).json({
					errors: [ {
						type: "other",
						msg: "registerFailed"
					} ]
				});
			}
			return res.status(200).json({
				token: user.getToken()
			});
		});
	} catch (e) {
		return res.status(500).json({
			errors: [ {
				type: "other",
				msg: "unavailableData"
			} ]
		});
	}
};

module.exports = { checkRegister, registerController };
