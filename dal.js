const mongoose = require("mongoose");
const { User, Snippet } = require("./models/Schema");
mongoose.Promise = require("bluebird");

mongoose.connect("mongodb://localhost:27017/snippetdb");

function addUser(newUser) {
	console.log("Saving new user");
	console.log(newUser.name);
	const user = new User({
		username: { type: String },
		password: { type: String },
		img: { type: String },
		name: { type: String },
		bio: { type: String }
	});
	console.log(user);
	user.save(function(err) {
		console.log(err);
	});
	return Promise.resolve("success");
}

module.exports = {
	getAllMoons
};
