"use strict";

const config = require("../config.js");
const winston = require("winston");

module.exports.init = function () {
	winston.configure({
		transports: [
			new (winston.transports.File)({ filename: config.logFile }),
			new (winston.transports.Console)()
		]
	});
	return winston;
};

module.exports.logger = winston;