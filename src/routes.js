const { Router } = require("express");
const { checkLogin, loginController } = require("./controllers/login");
const { checkRegister, registerController } = require("./controllers/register");
const { playerInfoController } = require("./controllers/playerInfo");
const { playerGameController } = require("./controllers/playerGame");
const { checkGameRegister, gameRegisterController } = require("./controllers/gameRegister");

const router = Router();
router.post("/api/login", checkLogin(), loginController);
router.post("/api/register", checkRegister(), registerController);
router.get("/api/getPlayerInfo", playerInfoController);
router.get("/api/getPlayerGames", playerGameController);
router.post("/api/gameRegister", checkGameRegister(), gameRegisterController);

module.exports = router;
