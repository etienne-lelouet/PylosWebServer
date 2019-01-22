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

mongoose.connect(process.env.BDDCONNSTRING, { useNewUrlParser: true }).catch((e) => {
	console.log(e);
});

app.use(routes);

app.listen(8080, () => {
	console.log("listening on port 8080");
});
