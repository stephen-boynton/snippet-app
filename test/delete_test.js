const assert = require("assert");
const { User, Snippet } = require("../models/Schema");

describe("Delete snippets out of the database", () => {
	let snippet;
	beforeEach(done => {
		snippet = new Snippet({ title: "Delete Snippet" });
		snippet.save().then(() => done());
	});
	it("Deletes one snippets by Snippet ID", done => {
		Snippet.find({ _id: snippet }).then(snip => {
			Snippet.deleteOne({ _id: snip._id }).then(() => {
				assert(Snippet.find({ _id: snip._id }));
				done();
			});
		});
	});
});

describe("Delete users out of the database", () => {
	let george;
	beforeEach(done => {
		george = new User({ name: "George" });
		george.save().then(() => done());
	});
	it("Deletes one snippets by Snippet ID", done => {
		User.find({ _id: george }).then(user => {
			User.deleteOne({ _id: user._id }).then(() => {
				assert(User.find({ _id: user._id }));
				done();
			});
		});
	});
});
