const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

before(() => {
	//before executes once... This pauses for the tests.
	mongoose.connect("mongodb://localhost:27017/snippetdb");
	mongoose.connection
		.once("open", () => console.log("Good to go!"))
		.on("error", error => {
			console.warn("Warning ", error);
		});
});
beforeEach(done => {
	mongoose.connection.collections.users.drop(() => {
		//ready to run next text!
		done();
	});
});
beforeEach(done => {
	mongoose.connection.collections.snippets.drop(() => {
		//ready to run next text!
		done();
	});
});
