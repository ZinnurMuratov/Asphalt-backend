"use strict";

const apiv1 = require("./v1");
const auth = require("./authorization.js");

module.exports.register = function(app) {
	app.use("/api/v1", apiv1);
	app.use("/api/auth", auth.router);
};