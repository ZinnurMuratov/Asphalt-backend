"use strict";

const User = require("../models/user");
const logger = require("../utils/logger").logger;


function createUser(email, name, password){
	return new Promise((resolve, reject) => {

		User.findOne({email})
			.then((user) => {
				if (!user) {
					User.create({email, name, password})
						.then((newUser) => {
							newUser.addSession()
								.then(resolve)
								.catch(reject);
						})
						.catch((err) => {
							logger.error(`error on creating user ${err}`);
							reject();
					});
				} else {
					reject('email is already busy');
				}
			}).catch((err) => {
				logger.error(`error on creating user ${email}: ${err}`);
				reject('error');
			});
			
	});
}

function login(email, password){
	return new Promise((resolve, reject) => {
		User.findOne({email})
			.then((user) => {
				if (!user) {
					reject("Bad email");
				} else {
					if (user.password === password){
						user.addSession()
							.then(resolve)
							.catch(reject);
					} else {
						reject("Bad password");
					}
				}
			});
	});
}

function createSession(email, name, password) {
	
	return new Promise((resolve, reject) => {

		User.findOne({email})
			.then((user) => {
				if (!user) {
					User.create({email, name, password})
						.then((newUser) => {
							newUser.addSession()
								.then(resolve)
								.catch(reject);
						})
						.catch((err) => {
							logger.error(`error on creating user ${err}`);
							reject();
						});
				} else {
					user.addSession()
						.then(resolve)
						.catch(reject);
				}
			}).catch((err) => {
				logger.error(`error on creating session ${email}: ${err}`);
				reject();
			});
	});
	
}

function getSession(email, sessionId) {
	return new Promise((resolve, reject) => {

		User.findOne({email: email, sessions: {$elemMatch : {_id: sessionId} }})
			.then((user) => {
				resolve(user.sessions.find((e) => e._id === sessionId));
			}).catch(reject);
	});
}

function findUserSessionById(sessionId) {
	return new Promise((resolve, reject) => {
		User.findOne({ sessions: { $elemMatch: {_id: sessionId}}})
			.then((user) => {
				resolve({user, session: user ? user.getSession(sessionId) : null });
			}).catch(reject);
	});
}

function findSession(sessionId) {
	return new Promise((resolve, reject) => {
		findUserSessionById(sessionId)
			.then(({ session }) => {
				resolve(session);
			})
			.catch(reject);
	});
}

function findByAccessToken(accessToken) {
	return new Promise((resolve, reject) => {
		User.findOne({ sessions: { $elemMatch: { accessToken } } })
			.exec()
			.then((user) => {
				resolve(user);
			}).catch(reject);
	});
}




function updateSessionByRefreshToken(refreshToken) {
	return new Promise((resolve, reject) => {
		User.findOne({ sessions: { $elemMatch: { refreshToken } } })
			.then((user) => {
				if (!user) {
					resolve(null);
				} else {
					user.updateSessionByRefreshToken(refreshToken)
						.then((session) => resolve(session))
						.catch(reject);					
				}
			}).catch(reject);
	});
}


function findByName(name) {
	return User.findOne({ name });
}

function updateProfile(user, userUpdate) {
	
	for (let key in userUpdate) {
		if (userUpdate[key]) {
			user[key] = userUpdate[key];
		}
	}
	user.isDataFilled = true;
	return user.save()
		.then((u) => {
			return User.populate(u, { path: "avatar"});
		});
		
}





module.exports = {
	createUser,
	login, 
	createSession,
	getSession,
	findSession, 
	findByAccessToken,
	findByName,
	updateSessionByRefreshToken,
	updateProfile
};