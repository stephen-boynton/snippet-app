const mongoose = require("mongoose");
const { User, Snippet } = require("./models/Schema");
mongoose.Promise = require("bluebird");

mongoose.connect("mongodb://localhost:27017/snippetdb");

function getByUserName(userName) {
	console.log(userName);
	return User.find({ username: userName });
}

function getUserById(userID) {
	return User.find({ _id: userID });
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

function addSnipe(newSnipe, userId) {
	console.log("Saving snipe");
	console.log(newSnipe);
	const tagArray = createTags(newSnipe.tags);
	const snipe = new Snippet({
		title: newSnipe.title,
		language: newSnipe.language,
		code: newSnipe.code,
		notes: newSnipe.notes,
		tags: tagArray,
		author: userId
	});
	console.log(snipe);
	snipe.save(function(err) {
		console.log(err);
	});
	User.find({ _id: userId }).then(user => {
		user[0].snippets.push(snipe._id);
		user[0].save();
	});
	return Promise.resolve("success");
}

function createTags(tagString) {
	let tagArr = [];
	if (tagString.indexOf(",") > -1) {
		tagArr = tagString.split(", ");
	} else {
		tagArr = tagString;
	}
	return tagArr;
}

function getSnipe(snipeID) {
	return Snippet.findOne({ _id: snipeID });
}

function findSnipeByTag(snipeTag) {
	return Snippet.find({ tags: snipeTag });
}

//============================= Thanks goes to Nick for this one.
function searchSnippets(search) {
	return Snippet.find({
		$or: [
			{ title: { $regex: search, $options: "i" } },
			{ language: { $regex: search, $options: "i" } },
			{ code: { $regex: search, $options: "i" } },
			{ notes: { $regex: search, $options: "i" } },
			{ date: { $regex: search, $options: "i" } },
			{ tags: { $regex: search, $options: "i" } }
		]
	}).populate("author");
}
//================================================================

module.exports = {
	getByUserName,
	getUserById,
	addUser,
	addSnipe,
	getSnipe,
	findSnipeByTag,
	searchSnippets
};
