const mongoose = require("mongoose");
const { User, Snippet } = require("./models/Schema");
mongoose.Promise = require("bluebird");

mongoose.connect("mongodb://localhost:27017/snippetdb");

function getByUserName(user) {
	return User.find({ username: user.username });
}

function giveCreds(user) {
	req.session.AU = true;
	req.session.user = {
		user: user[0].username,
		img: user[0].img,
		id: user[0]._id,
		bio: user[0].bio
	};
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
	user.save(function(err) {
		console.log(err);
	});
	return Promise.resolve("success");
}

module.exports = {
	getByUserName,
	addUser
};
