const assert = require("assert");
const { User, Snippet } = require("../models/Schema");

describe("Reading users out of the database", () => {
	let bob;
	beforeEach(done => {
		bob = new User({ name: "Bob" });
		bob.save().then(() => done());
	});
	it("finds all users with a name of Bob", done => {
		User.find({ name: "Bob" }).then(users => {
			//have to run toString bc the ids are wrapped in the Object wrapper.
			assert(users[0]._id.toString() === bob.id.toString());
			done();
		});
	});
});

describe("Reading snippets out of the database", () => {
	let snippet;
	beforeEach(done => {
		snippet = new Snippet({ title: "My Snippet" });
		snippet.save().then(() => done());
	});
	it("finds all snippets with a title of My Snippet", done => {
		Snippet.find({ title: "My Snippet" }).then(snip => {
			//have to run toString bc the ids are wrapped in the Object wrapper.
			assert(snip[0]._id.toString() === snippet.id.toString());
			done();
		});
	});
});
