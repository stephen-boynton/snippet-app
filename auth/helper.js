const jwt = require("jsonwebtoken");
const moment = require("moment");

module.exports = { createToken, ensureAuthenticated };

function createToken(user) {
	const payload = {
		sub: user._id,
		iat: moment().unix(),
		exp: moment()
			.add(1, "day")
			.unix(),
		name: user.name,
		username: user.username,
		pic: user.picture,
		roles: user.roles
	};
	return jwt.sign(payload, process.env.TOKEN_SECRET);
}

function ensureAuthenticated(req, res, next) {
	console.log(req.headers.authorization);
	if (!req.headers.authorization) {
		return res
			.status(401)
			.send({ message: "Your request requires an Authorization Header" });
	}
	const token = req.headers.authorization;
	console.log(token);
	const payload = jwt.verify(token, process.env.TOKEN_SECRET);
	// if (exp <= moment().unix()) {
	// 	return res.status(401).send({ message: "Token has expired." });
	// }
	req.user = payload;
	next();
}
