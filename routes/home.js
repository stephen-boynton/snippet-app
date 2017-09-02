const router = require("express").Router();
const session = require("express-session");
const { User, Snippet } = require("../models/Schema");
const { getByUserName, addUser } = require("../dal");
const { createToken, ensureAuthenticated } = require("../auth/helper");

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

router.route("/login").get((req, res) => {
	console.log(req.session);
	res.render("login", { session: req.session });
});

router.route("/login").post((req, res) => {
	getByUserName(req.body).then(user => {
		console.log(user[0]);
		if (!user[0]) {
			res.redirect("/login");
		} else {
			User.validPassword(
				req.body.password,
				user[0].password,
				(err, isMatch) => {
					if (isMatch) {
						req.session.AU = true;
						req.session.user = {
							user: user[0].username,
							img: user[0].img,
							id: user[0]._id,
							bio: user[0].bio
						};
						console.log(req.session.user);
						res.send({ token: createToken(user), roles: user.roles });
					} else if (err) {
						console.log(err);
						req.session.message = "Invalid username or password.";
						res.redirect("/login");
					}
				}
			);
		}
	});
});

router.route("/logout").get((req, res) => {});

module.exports = router;
