"use strict";

const Hole = require("../models/hole");
const geocoder = require('geocoder');
const {CITY_NOT_DEFINED, NEW_HOLE} = require("../utils/constants");

function createHole(lat, lng){
    return new Promise((resolve, reject) => {
        
        geocoder.reverseGeocode( lat,lng, function ( err, data ) {
            let city = err ? CITY_NOT_DEFINED : data.results[0].address_components[2].long_name;
            Hole.create({NEW_HOLE, lat, lng, city})
                .then((newHole) => {
                    if (newHole){
                        resolve("ok");
                    } else {
                        reject("error");
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });
			
	});
}

function getHoles(city, perPage, page){
    return new Promise((resolve, reject) => {
        Hole.find({city})
            .sort({created: 'desc'})
            .limit(perPage)
            .skip(perPage * page)
            .then((holes) => {
                let holesArr = [];
                holes.forEach(function(hole) {
                    holesArr.push(hole);
                });
                resolve(holesArr);
            })
            .catch((err) => {
                reject(err);
            });
    });
}



module.exports = {
	createHole,
    getHoles
};