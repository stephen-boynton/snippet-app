const assert = require("assert");
const { User, Snippet } = require("../models/Schema");

describe("Updates snippets in the database", () => {
	let snippet;
	beforeEach(done => {
		snippet = new Snippet({ title: "New Snippet" });
		snippet.save().then(() => done());
	});
	it("Updates a snippet", done => {
		Snippet.update(
			{ _id: snippet._id },
			{
				$set: { title: "Updated" }
			},
			function(err, raw) {
				if (err) return console.log(err);
				console.log("OH MY GOD");
				console.log("The raw response from Mongo was ", raw);
			}
		);
		console.log(snippet);
		Snippet.findOne({ _id: snippet._id }).then(ham => {
			console.log(ham);
			done();
		});
	});
});
