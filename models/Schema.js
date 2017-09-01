const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	username: { type: String },
	password: { type: String },
	img: { type: String },
	name: { type: String },
	bio: { type: String },
	snippets: [{ type: Schema.Types.ObjectId, ref: "Snippet" }]
});

const SnippetSchema = new mongoose.Schema({
	title: { type: String },
	language: { type: String },
	code: { type: String },
	tags: [{ type: String }],
	author: { type: Schema.Types.ObjectId, ref: "User" },
	faves: { type: Number }
});

const User = mongoose.model("User", UserSchema);
const Snippet = mongoose.model("Snippet", SnippetSchema);

module.exports = { User, Snippet };
