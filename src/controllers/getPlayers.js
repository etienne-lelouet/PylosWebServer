const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const getPlayers = (req, res) => {
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
		User.find({ }).sort({ score: -1 }).exec(((err, docs) => {
      if(err) {
        return res.status(500).json({ errors: [ { type: "other", msg: "unkownError" } ]});
      }
      if (docs) {
        return res.status(200).json({ res: docs });
      } else {
        return res.status(500).json({ errors: [ { type: "other", msg: "unkownError" } ]});
      }
    })
    );
	} catch (e) {
    return res.status(500).json({ errors: [ { type: "other", msg: "unkownError" } ]});
	}
};

module.exports = { getPlayers };
