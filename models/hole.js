"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const HoleSchema = new Schema({
	owner: 		{ type: Schema.Types.ObjectId, ref: "User" },
	status: 	{ type: String, require: true },
	lat: 		{ type: String, require: true },
	lng:    	{ type: String, require: true },
	city:       { type: String, require: true },
    createdAt:  { type: Date, default: Date.now() }
});



module.exports = mongoose.model("Hole", HoleSchema);