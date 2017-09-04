require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const mustacheExpress = require("mustache-express");
const mongoose = require("mongoose");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const MongoStore = require("connect-mongo")(session);
const { User, Snippet } = require("./models/Schema");
const { getByUserName, addUser, addSnipe } = require("./dal");
const { createToken } = require("./auth/helper");
let currentUser;
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	session({
		secret: process.env.TOKEN_SECRET || "hamsammy",
		saveUninitialized: false,
		resave: false,
		store: new MongoStore({ mongooseConnection: mongoose.connection })
	})
);

function userNameCheck(req, res, next) {
	getByUserName(req.body.username).then(user => {
		console.log(user);
		if (!user[0]) {
			console.log("Name check");
			req.session.message = "Invalid username or password.";
			res.redirect("/login");
		} else {
			console.log("Pass name check");
			next();
		}
	});
}

function passCheck(req, res, next) {
	getByUserName(req.body.username).then(user => {
		user[0].validPassword(
			req.body.password,
			user[0].password,
			(err, isMatch) => {
				if (err) {
					console.log(err);
					req.session.message = "Invalid username or password.";
					console.log("You didn't make it in?");
					res.render("/login");
				} else if (isMatch) {
					console.log("It is a match!");
					req.session.user = {
						username: user[0].username,
						img: user[0].img,
						id: user[0]._id,
						faved: user[0].faved
					};
					currentUser = req.session.user;
					io.emit("info", req.session.user);
					const token = createToken(user);
					res.send({ token: token });
				}
			}
		);
	});
}

function alreadyExists(req, res, next) {
	getByUserName(req.body.username).then(user => {
		if (!user[0]) next();
		req.session.message = "Username already exists.";
		res.redirect("/signup");
	});
}

app.use((req, res, next) => {
	if (req.session.user) {
		User.find({ _id: req.session.user.id }).then(user => {
			req.session.user = {
				username: user[0].username,
				img: user[0].img,
				id: user[0]._id,
				faved: user[0].faved
			};
			currentUser = req.session.user;
			io.emit("info", req.session.user);
			next();
		});
	} else {
		next();
	}
});

function favArray(snippets, userfavs) {
	const favArray = [];
	userfavs.forEach((elm, ind, arr) => {
		for (let i = 0; i < snippets.length; i++) {
			if (userfavs[ind] === snippets[i]) {
				favArray.push(true);
			} else {
				favArray.push(false);
			}
		}
	});
}

app.get("/", (req, res) => {
	if (req.session.user) {
		Snippet.find()
			.populate("author", "username")
			.exec((err, doc) => {
				const completeSnips = doc.reverse();
				const favorites = favArray(doc, req.session.user.faved);
				res.render("index", {
					user: req.session.user,
					snippets: completeSnips,
					favorites: favorites
				});
			});
	} else {
		Snippet.find()
			.populate("author", "username")
			.exec((err, doc) => {
				const completeSnips = doc.reverse();
				res.render("index", {
					user: req.session.user,
					snippets: completeSnips
				});
			});
	}
});

app.get("/login", (req, res) => {
	const user = req.session.user;
	const message = req.session.message;
	res.render("login", { user, message });
});

app.post("/login", userNameCheck, passCheck, (req, res) => {
	res.redirect("/");
});

app.get("/logout", (req, res) => {
	req.session.destroy();
	res.redirect("/login");
});

app.get("/signup", (req, res) => {
	res.render("signup");
});

app.post("/signup", alreadyExists, (req, res) => {
	addUser(req.body).then(() => {
		res.redirect("/login");
	});
});

app.get("/snipe/:user", (req, res) => {
	getByUserName(req.params.user).then(userPage => {
		const [userInfo] = userPage;
		Snippet.find({ author: userInfo._id }).then(authSnips => {
			res.render("user", {
				user: req.session.user,
				userInfo: userInfo,
				snippets: authSnips.reverse()
			});
		});
	});
});

app.get("/user/newsnipe", (req, res) => {
	res.render("newsnipe", { user: req.session.user });
});

app.post("/user/newsnipe", (req, res) => {
	addSnipe(req.body, req.session.user.id).then(() => {
		res.redirect(`/snipe/${req.session.user.username}`);
	});
});

io.on("connection", function(socket) {
	console.log("a user connected");
	socket.on("disconnect", function() {
		console.log("user disconnected");
	});
});

io.on("connection", function(socket) {
	socket.on("fav", function(msg) {
		Snippet.find({ _id: msg.snippet })
			.then(snip => {
				snip[0].faves++;
				snip[0].save();
			})
			.then(snip => {
				getByUserName(msg.user).then(user => {
					console.log(user[0].faved);
					user[0].faved.push(msg.snippet);
					user[0].save();
					console.log(user[0].faved);
				});
			});
	});
});
// io.on("connection", function(socket) {
// 	socket.on("unfav", function(msg) {
// 		Snippet.find({ _id: msg.snippet })
// 			.then(snip => {
// 				snip[0].faves--;
// 				snip[0].save();
// 			})
// 			.then(snip => {
// 				getByUserName({ username: msg.user }).then(user => {
// 					user[0].faved.slice(user[0].faved.indexOf(msg), 1);
// 				});
// 			});
// 	});
// });

app.set("port", 3000);

http.listen(app.get("port"), () => {
	console.log("Your app has started, sir.");
});
