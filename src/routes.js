const { Router } = require('express');
const { login } = require("./controllers/login");

const router = express.Router();

router.post("/api/login", login);


module.exports = router;