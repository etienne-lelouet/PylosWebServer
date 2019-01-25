const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const playerInfoController = (req, res) => {
	try {
		if (mongoose.connection.readyState === 0) {
			throw new Error("no connection to DB");
		}
		if (req.headers.authorization) {
			jwt.verify(req.headers.authorization, process.env.JWTSECRET, (error, decoded) => {
				if (error) {
					console.log("AUTH", error);
					return res.status(400).json({ errors: [ { type: "other", msg: "invalidAuth" } ] });
				}
				req.decoded = decoded;
			});
		} else {
			return res.status(400).json({ errors: [ { type: "other", msg: "missingAuth" } ] });
		}
		if (!req.decoded) {
			return 0;
		}
		if (req.params.user && req.params.user.length > 3) {
			req.decoded.login = req.params.user;
		}
		User.findOne(({ login: req.decoded.login }), (err, user) => {
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
			const {
				login, username, score, nbParties, nbVictoires, nbDefaites
			} = user;
			return res.status(200).json({
				login,
				username,
				score,
				nbParties,
				nbVictoires,
				nbDefaites
			});
		});
	} catch (e) {
		console.log(e);
	}
};

module.exports = { playerInfoController };
