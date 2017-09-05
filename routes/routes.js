const router = require("express").Router();
const { User, Snippet } = require("../models/Schema");

const {
	getByUserName,
	getUserById,
	addUser,
	addSnipe,
	getSnipe,
	findSnipeByTag,
	searchSnippets
} = require("../dal");

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
					next();
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

router.route("/").get((req, res) => {
	Snippet.find()
		.populate("author", "username")
		.exec((err, doc) => {
			const completeSnips = doc.reverse();
			res.render("index", {
				user: req.session.user,
				snippets: completeSnips
			});
		});
});

router
	.route("/login")
	.get((req, res) => {
		const user = req.session.user;
		const message = req.session.message;
		res.render("login", { user, message });
	})
	.post(userNameCheck, passCheck, (req, res) => {
		res.redirect("/");
	});

router.route("/logout").get((req, res) => {
	req.session.destroy();
	res.redirect("/login");
});

router
	.route("/signup")
	.get((req, res) => {
		res.render("signup");
	})
	.post(alreadyExists, (req, res) => {
		addUser(req.body).then(() => {
			res.redirect("/login");
		});
	});

router.route("/user/:user").get((req, res) => {
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

router
	.route("/snipe/newsnipe")
	.get((req, res) => {
		if (!req.session.user) res.redirect("/login");
		res.render("newsnipe", { user: req.session.user });
	})
	.post((req, res) => {
		if (!req.session.user) res.redirect("/login");
		addSnipe(req.body, req.session.user.id).then(() => {
			res.redirect(`/user/${req.session.user.username}`);
		});
	});

router.route("/snipe/langs/:language").get((req, res) => {
	Snippet.find({ language: req.params.language })
		.populate("author", "username")
		.exec((err, doc) => {
			const completeSnips = doc.reverse();
			res.render("index", {
				user: req.session.user,
				snippets: completeSnips
			});
		});
});

router.route("/snipe/:snipeID").get((req, res) => {
	getSnipe(req.params.snipeID).then(snipe => {
		res.render("index", { snippets: snipe, user: req.session.user });
	});
});

router.route("/tags/:tag").get((req, res) => {
	findSnipeByTag(req.params.tag).then(snipes => {
		res.render("index", { snippets: snipes, user: req.session.user });
	});
});

router.route("/search").get((req, res) => {
	searchSnippets(req.query.search).then(snippets => {
		console.log(snippets);
		res.render("index", { snippets: snippets, user: req.session.user });
	});
});

module.exports = router;
