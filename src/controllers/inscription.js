const { body, validationResult } = require("express-validator/check");
const passwordHash = require("password-hash");
const User = require("./model/User");

const checkInscription = () => {
	return [
		body("login", "nom d'utilisateur invalide").custom(value => {
			if (value.length <= 3) {
				return new Promise.reject("invalidUsername");
			}
			
		}),
		body("password", "mot de passe invalide").isLength({ min: 3 })
	];
};

const inscriptionController = (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const errorList = errors.array();
		const toSend = errorList.map(({ param, msg }) => ({ param, msg }));
		res.status(422).json({ errors: toSend });
	} else {
		try {
			const { login, password } = req.body;
			MongoClient.connect(process.env.BDDCONNSTRING, { useNewUrlParser: true },
				(errConn, client) => {
					if (errConn) {
						throw (errConn);
					} else {
						const db = client.db(process.env.DATABASENAME);
						db.collection(process.env.USERSTABLENAME).findOne(
							{ login }, (errFind, document) => {
								if (errFind) {
									throw (errFind);
								} else if (document) {
									const hashedPassword = document.password;
									if (passwordHash.verify(password, hashedPassword)) {
										res.status(200).json({ result: "ok" });
									} else {
										res.status(422).json({ result: "nok" });
									}
								} else {
									res.status(422).json({ result: "nok" });
								}
							}
						);
					}
				});
		} catch (e) {
			console.log(e);
			res.status(500).json({ error: "unavailableData" });
		}
	}
};

module.exports = { checkInscription, inscriptionController };
