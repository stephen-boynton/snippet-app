const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const mustacheExpress = require("mustache-express");

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");

app.use(express.static("public"));
app.use(
	session({
		secret: "hamsandwich",
		saveUninitialized: false,
		resave: false
	})
);

app.get("/signup", (req, res) => {
	res.render("signup");
});

app.set("port", 3000);

app.listen(app.get("port"), () => {
	console.log("Your app has started, sir.");
});
