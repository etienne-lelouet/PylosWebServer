const express = require("express");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const routes = require("./routes");
require("dotenv").config();

const app = express();
app.use(expressValidator());
app.use(bodyParser.json());

app.use(routes);
app.listen(8080, () => {
	console.log("listening on port 8080");
});
