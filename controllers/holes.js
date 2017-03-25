"use strict";

const holeValidation = require("../validations/hole");
const logger = require("../utils/logger").logger;
const holes = require("../repositories/holes");



function getHoles(req, res){
    let city = req.body.city || "Kazan'";
    let perPage = req.body.perpage || 10;
    let page = req.body.page || 0;

    holes.getHoles(city, perPage, page)
        .then((holes) => {
            res.status(200).json({status: "ok", data: holes});
        })
        .catch((err) => {
            res.status(500).json({ status: "error", error: err });
        });
    
}

function createHole(req, res){
    let latitude = req.body.lat || null;
    let longitude = req.body.lng || null;

    holeValidation.geoValidation(latitude, longitude)
        .then(({lat,lng}) =>  {
            holes.createHole(lat, lng)
                .then((status) => { res.status(200).json({status:status});})
                .catch((err) => { res.status(500).json({ status: "error", error: err});}); 
        })
        .catch((err) => {
			res.status(500).json({ status: "error_invalid_input", error: err });
		});
    
}


module.exports = {
	getHoles,
    createHole
};