"use strict";

const validator = require("email-validator");
const logger = require("../utils/logger").logger;

module.exports = {

    signUpFieldsIsValid : function(email, name, password){
        return new Promise((resolve, reject) => {
			if (!email){
				reject("email is empty");
			}
			else if (!validator.validate(email)) {
				reject("email is bad");
			} 
			else if (!name){
				reject("name is empty");
			}
			else if (!password){
				reject("password is null");
			}
			else {
				resolve({email: email, name: name, password: password});
			}
		});
    },
	signInFieldsIsValid : function(email, password){
		return new Promise((resolve, reject) => {
			if (!email){
				reject("email is empty");
			}
			else if (!validator.validate(email)) {
				reject("email is bad");
			} 
			else if (!password){
				reject("password is null");
			}
			else {
				resolve({email: email, password: password});
			}
		});
	}
};