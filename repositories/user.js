"use strict";
const {SESSION_LIFE_TIME} = require("../utils/constants");
const mongoose = require("mongoose");
const randomString = require("randomstring");
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
	accessToken: 	{ type: String, default: () => randomString.generate() },
	refreshToken: 	{ type: String, default: () => randomString.generate() },
	validThrough: 	{ type: Date },
	
});

const UserSchema = new Schema({
	email: 		{ type: String, require: true, unique: true },
	name: 		{ type: String, require: true },
	password: 	{ type: String, require: true },
	sessions: 	[SessionSchema]

});


UserSchema.methods.addSession = function() {
	let user = this;

	let session = user.sessions.create({
		validThrough: new Date(Date.now() + SESSION_LIFE_TIME)
	});
	user.sessions.push(session);
	
	return new Promise((resolve, reject) => {
		user.save()
			.then((u) => resolve({ session: session }))
			.catch(reject);
	});
};

UserSchema.methods.getSession = function(sessionId) {
	let user = this;
	if (typeof sessionId !== "string") {
		sessionId = sessionId.toString();
	}
	return user.sessions.find((s) => s._id === sessionId);
};

UserSchema.methods.updateSessionByRefreshToken = function(refreshToken) {
	return new Promise((resolve, reject) => {

		let user = this;
		let session = user.sessions.find((s) => s.refreshToken === refreshToken);
		if (!session) {
			let error = `can not find session with refreshToken: ${refreshToken} of user ${session}`;
			reject(error);
		} else {
			session.accessToken = randomString.generate();
			session.validThrough = new Date(Date.now() + SESSION_LIFE_TIME);
			user.save()
				.then((u) => resolve(u.getSession(session._id)))
				.catch(reject);
		}
	});
	
};

module.exports = mongoose.model("User", UserSchema);