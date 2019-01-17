const routes = require("./routes");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(urlencodedParser);
app.use(bodyParser.json());

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// });

app.listen(8080, ()=> {
    console.log("listening on port 8080");
});