const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const passwordHash = require("password-hash");

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
	username: {
		type: String,
		trim: true,
		required: true
	},
	dateCreation: {
		type: Date,
		default: Date.now()
	},
	score: {
		type: Number,
		default: 0
	},
	nbParties: {
		type: Number,
		default: 0
	},
	nbVictoires: {
		type: Number,
		default: 0
	},
	nbDefaites: {
		type: Number,
		default: 0
	}
});

userSchema.methods = {
	authentify(password) {
		return passwordHash.verify(password, this.password);
	},
	getToken() {
		return jwt.sign({ login: this.login }, process.env.JWTSECRET, { expiresIn: "1d" });
	}
};

module.exports = mongoose.model("users", userSchema);
