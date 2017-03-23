"use strict";

const User = require("../models/user");
const logger = require("../utils/logger").logger;

function getResultFromUser(user) {
	return {
		email: user.email,
		name: user.name,
		accessToken: user.sessions.accessToken,
		refreshToken: user.sessions.refreshToken
	};
}

function getUser(req,res){
    res.json({ status: "ok", result: getResultFromUser(req.user) });
}


module.exports = {
	getUser
};