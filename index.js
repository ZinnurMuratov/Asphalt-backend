"use strict";

global.base_dir = __dirname;
global.abs_path = function(path) {
	return global.base_dir + path;
};

global.include = function(file) {
	return require(global.abs_path("/" + file));
};


const express = require("express");
const compress = require("compression");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");

const api = require("./routes/api");
const auth = require("./middleware/auth.js");
const config = require("./config");
const logger = require("./utils/logger.js").init();
const port = process.env.PORT || 8000;

const app = express();

mongoose.Promise = global.Promise;

mongoose.connect(config.database)
    .then(() => logger.info(`connected to database ${config.database}.`))
    .catch((err) => logger.error(`connection to database ${config.database} failed: ${err}`));


app.use(compress())
	.use(bodyParser.json())
	.use(bodyParser.urlencoded({ extended : false }));

api.register(app);

app.get("/hello", auth.authenticate, (req, res) => {
	res.json(req.user);
});

app.use(function(req, res) {
	logger.error("not found - %s", req.url);
	let err = new Error("Not Found");
	err.status = 404;
	res.status(404).json(err);
});


const server = app.listen(port);

server.on("listening", () => {
	logger.info(`Application running on ${config.host}:${port}`);
});

module.exports = app;