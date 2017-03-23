"use strict";

const logger = require("../utils/logger").logger;
const users = require("../repositories/users");


function getToken(headers) {
	if (headers && headers.authorization) {
		return headers.authorization;
	} else {
		return null;
	}
}


function authenticate (req, res, next) {
	let token = getToken(req.headers);
	if (!token) {
		res.json({ status: "ok", error: "Access denied. Token not provided." });
	} else {

		users.findByAccessToken(token)
			.then((user) => {
				if (!user) {
					return res.json({ status: "error", error: "Authentication failed. Session not found." });
				} else {
					let session = user.sessions.find((s) => s.accessToken === token);
					if (session.validThrough <= Date.now()) {
						res.status(401).json({status: "error", error: "Authentication failed. AccesToken is invalid now."});
					} else {
						req.user = user;
						next();
					}
				}
				
			}).catch((err) => {
				logger.error(`error on authenticate: ${err}`);
				return res.json({ status: "error", error: "Authentication failed. "});
			});	

	}
}

module.exports = {
	authenticate
};