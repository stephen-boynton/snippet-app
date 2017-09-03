require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const mustacheExpress = require("mustache-express");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
const { User, Snippet } = require("./models/Schema");
const { getByUserName, addUser } = require("./dal");
const { createToken } = require("./auth/helper");
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
						id: user[0]._id
					};
					console.log(req.session.id);
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

app.get("/", (req, res) => {
	console.log(req.session.user);
	req.session.reload(err => {
		console.log(err);
	});
	console.log(req.session.id);
	res.render("index", { user: req.session.user });
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
		res.render("user", { user: req.session.user, userInfo: userInfo });
	});
});

app.set("port", 3000);

app.listen(app.get("port"), () => {
	console.log("Your app has started, sir.");
});
