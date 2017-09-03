require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const mustacheExpress = require("mustache-express");
const homeRoutes = require("./routes/home");
const { getByUserName } = require("./dal");
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
	session({
		secret: process.env.TOKEN_SECRET
	})
);

app.use("/", homeRoutes);

app.get("/", (req, res) => {
	if (!req.session.user) {
		req.session.user = "";
		req.session.message = "";
	}
	console.log(req.session.user);
	res.render("index");
});

app.get("/snipe/:username", (req, res) => {
	const user = req.params.username;
	console.log(user);
	getByUserName(user).then(data => {
		const [userInfo] = data;
		console.log(userInfo);
		res.render("user", { userInfo });
	});
});

app.get("/user/newsnipe", (req, res) => {
	res.render("newsnipe");
});
//================================================ Start here.
app.post("/user/newsnipe", (req, res) => {
	addSnipe(req.body).then(() => {
		getById();
		res.redirect(`/snipe/${user}`);
	});
});

app.set("port", 3000);

app.listen(app.get("port"), () => {
	console.log("Your app has started, sir.");
});
