const { Router } = require("express");
const { checkLogin, loginController } = require("./controllers/login");
const { checkInscription, inscriptionController } = require("./controllers/inscription");

const router = Router();

router.get("/api/test", (req, res) => {
	console.log("test");
	res.status(200).send("ok");
});
router.post("/api/login", checkLogin(), loginController);
router.post("/api/inscription", checkInscription(), inscriptionController);

module.exports = router;
