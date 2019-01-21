const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const passwordHash = require("password-hash");
require("dotenv").config();


const userSchema = mongoose.Schema({
	login: {
		type: String,
		lowercase: true,
		trim: true,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	userName: {
		type: String,
		trim: true,
		require: true
	}
});

userSchema.methods = {
	authentify(password) {
		return passwordHash.verify(password, this.password);
	},
	getToken() {
		return jwt.sign({ email: this.email }, process.env.jwToken, { expiresIn: 3600 });
	}
};

module.exports = mongoose.model("users", userSchema);
