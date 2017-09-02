require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const mustacheExpress = require("mustache-express");
const homeRoutes = require("./routes/home");
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
	session({
		secret: "hamsandwich",
		saveUninitialized: false,
		resave: false
	})
);
app.use("/", homeRoutes);

app.get("/", (req, res) => {
	res.render("index");
});

app.use((req, res, next) => {
	if (req.session.user) {
		req.session.message = "";
		next();
	} else {
		req.session.AU = false;
		next();
	}
});

app.set("port", 3000);

app.listen(app.get("port"), () => {
	console.log("Your app has started, sir.");
});
