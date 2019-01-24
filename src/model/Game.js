const mongoose = require("mongoose");

const gameSchema = mongoose.Schema({
	loginPlayerA: {
		type: String,
		lowercase: true,
		trim: true,
		required: true
	},
	loginPlayerB: {
		type: String,
		lowercase: true,
		trim: true,
		required: true
	},
	winner: {
		type: String,
		lowerCase: true,
		trim: true,
		required: true
	},
	winnerScore: {
		type: Number,
		required: true
	},
	loserScore: {
		type: Number,
		required: true
	},
	datePlayed: {
		type: Date,
		default: Date.now()
	},
	moveList: [ {
		playerLogin: String,
		pawnColor: String,
		pawnPosition: String
	} ]
});

module.exports = mongoose.model("game", gameSchema);
