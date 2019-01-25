const express = require("express");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const mongoose = require("mongoose");
const routes = require("./routes");
require("dotenv").config();

const app = express();
app.use(expressValidator());

app.use((req, res, next) => {
	bodyParser.json()(req, res, (err) => {
		if (err) {
			return res.status(400).json({ error: "badRequest" });
		}
		next();
	});
});

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Content-Length, X-Requested-With");
	res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
	res.header("Access-Control-Allow-Credentials", true);
	if (req.method === "OPTIONS") {
		res.status(200).send();
		return;
	}
	next();
});
mongoose.connect(process.env.BDDCONNSTRING, { useNewUrlParser: true }).catch((e) => {
	console.log(e);
});

app.use(routes);

app.listen(8000, () => {
	console.log("listening on port 8000");
});
