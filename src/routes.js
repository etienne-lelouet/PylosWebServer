const { Router } = require("express");
const { checkLogin, loginController } = require("./controllers/login");
const { checkRegister, registerController } = require("./controllers/register");

const router = Router();

router.post("/api/login", checkLogin(), loginController);
router.post("/api/register", checkRegister(), registerController);

module.exports = router;
