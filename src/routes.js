const { Router } = require("express");
const login = require("./controllers/login");

const router = Router();

router.post("/api/test", (req, res) => {
	res.status(200).write("ok");
});
router.post("/api/login", login);

module.exports = router;
