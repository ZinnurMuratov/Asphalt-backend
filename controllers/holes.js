"use strict";

const Hole = require("../models/hole");
const logger = require("../utils/logger").logger;
const holes = require("../repositories/holes");
const geocoder = require('geocoder');


function getHoles(req, res){
    
}

function createHole(req, res){
    geocoder.reverseGeocode( 55.797499,49.124649, function ( err, data ) {
        res.status(200).json(data.results[0].address_components[2].long_name);
    });
}


module.exports = {
	getHoles,
    createHole
};