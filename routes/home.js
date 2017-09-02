const router = require("express").Router();
const { User, Snippet } = require("../models/Schema");
const { getByUserName, addUser, giveCreds } = require("../dal");
const { createToken, ensureAuthenticated } = require("../auth/helper");

router.route("/").get((req, res) => {
	res.render("index");
});

router
	.route("/signup")
	.get((req, res) => {
		res.render("signup");
	})
	.post((req, res) => {
		addUser(req.body).then(() => {
			res.redirect("/");
		});
	});

router
	.route("/login")
	.get((req, res) => {
		res.render("login", { message: req.session.message });
	})
	.post((req, res) => {
		getByUserName(req.body).then(user => {
			User.validPassword(
				req.body.password,
				user[0].password,
				(err, isMatch) => {
					if (isMatch) {
						giveCreds(user);
						console.log(req.session.user);
						res.send({ token: createToken(user), roles: user.roles });
					} else if (err) {
						console.log(err);
						res.redirect("/login");
					}
				}
			);
		});
	});

router.route("/logout").get((req, res) => {});

module.exports = router;
