"use strict";

const Hole = require("../models/hole");
const logger = require("../utils/logger").logger;
const holes = require("../repositories/holes");


function getHoles(req, res){

}

function createHole(req, res){
   let location = req.body.location || null;

}


module.exports = {
	getHoles
};