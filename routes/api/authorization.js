"use strict";


const router = require("express").Router(); 
const users = require("../../repositories/users");
const logger = require("../../utils/logger").logger;
const authValidation = require("../../validations/auth");

function getResultFromSession(session) {
	return { 
		accessToken: session.accessToken,
		refreshToken: session.refreshToken
	};
}

router.post("/sign_up", (req, res) => {
	let email = req.body.email || null;
	let password = req.body.password || null;
	let name = req.body.name || null;
	
	authValidation.signUpFieldsIsValid(email,name,password)
		.then((validData) => {
			users.createUser(validData.email, validData.name, validData.password)
				.then(({session}) => {
					res.status(200).json({ status:"ok", result: getResultFromSession(session)});
				}).catch((err) => {
					logger.error(`error on /authorize: ${err}.`);
					res.status(500).json({ status: "error", error: err});
				});
		})
		.catch((err) => {
			res.status(500).json({ status: "error_invalid_input", error: err });
		});
	
});

router.post("/sign_in", (req, res) => {
	let email = req.body.email || null;
	let password = req.body.password || null;
	authValidation.signInFieldsIsValid(email, password)
		.then(({email, password}) => {
			users.login(email, password)
				.then(({session}) => {
					res.status(200).json({ status:"ok", result: getResultFromSession(session)});
				}).catch((err) => {
					logger.error("error on /authorize: ${err}.");
					res.status(500).json({ status: "error", error: err});
				});
		})
		.catch((err) => {
			res.status(500).json({ status: "error_invalid_input", error: err });
		});
});



router.post("/getNewToken", (req, res) => {
	let {refreshToken} = req.body;
	if (refreshToken) {
		users.updateSessionByRefreshToken(refreshToken)
			.then((session) => {
				if (session) {
					// res.setHeader('newToken', session.accessToken);
					res.writeHead({'access': session.accessToken});
					res.status(200).json({ status: "ok"});
				} else {
					res.json({ status: "error_session_not_found", error: "Can not found session with such refreshToken"});
				}
			}).catch((err) => {
				res.json({ status: "error_internal", error: "Internal server error" });
			});
	} else {
		res.json({ status: "error_invalid_input", error: "Refresh token not provided" });
	}
});

module.exports.router = router;