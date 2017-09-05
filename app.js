//Move user to req.user instead of session.
// Take another look at ensureAuthentication middleware.

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
const { getByUserName, getUserById, addUser, addSnipe } = require("./dal");
const routes = require("./routes/routes");
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

app.use((req, res, next) => {
	if (req.session.user) {
		getUserById(req.session.user.id).then(user => {
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

app.use("/", routes);

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
