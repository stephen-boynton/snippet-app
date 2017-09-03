const mongoose = require("mongoose");
const { User, Snippet } = require("./models/Schema");
mongoose.Promise = require("bluebird");

mongoose.connect("mongodb://localhost:27017/snippetdb");

function getByUserName(userName) {
	console.log(userName);
	return User.find({ username: userName });
}

function addUser(newUser) {
	console.log("Saving new user");
	console.log(newUser.name);
	const hash = User.generateHash(newUser.password);
	const user = new User({
		username: newUser.username,
		password: hash,
		img: newUser.img,
		name: newUser.name,
		email: newUser.email,
		bio: newUser.bio
	});
	console.log(user);
	if (user.img === "")
		user.img =
			"https://openclipart.org/download/247316/abstract-user-flat-2.svg";
	user.save(function(err) {
		console.log(err);
	});
	return Promise.resolve("success");
}

module.exports = {
	getByUserName,
	addUser
};
