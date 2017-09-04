const mongoose = require("mongoose");
const moment = require("moment");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
	username: { type: String },
	password: { type: String },
	img: {
		type: String,
		default: "https://openclipart.org/download/247316/abstract-user-flat-2.svg"
	},
	name: { type: String },
	email: { type: String },
	bio: { type: String },
	snippets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Snippet" }],
	faved: [{ type: mongoose.Schema.Types.ObjectId, ref: "Snippet" }]
});

const SnippetSchema = new mongoose.Schema({
	title: { type: String },
	language: { type: String },
	code: { type: String },
	notes: { type: String },
	date: { type: String, default: moment().format() },
	tags: [{ type: String }],
	author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	faves: { type: Number, default: 0 }
});

UserSchema.statics.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password, dbpassword, done) {
	bcrypt.compare(password, dbpassword, (err, isMatch) => {
		console.log("password check");
		done(err, isMatch);
	});
};

const User = mongoose.model("User", UserSchema);
const Snippet = mongoose.model("Snippet", SnippetSchema);

module.exports = { User, Snippet };
