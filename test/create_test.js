const assert = require("assert");
const { User, Snippet } = require("../models/Schema");

describe("Creating User", () => {
	it("saves a user", () => {
		const joe = new User({ name: "Joe" });
		joe.save().then(() => {
			//has joe been saved????????????????
			//is new flag is false when it is in the database
			//isNew flag is true when only exists in Node-land
			assert(!joe.isNew);
		});
	});
});

describe("Creating snippet", () => {
	it("saves a snippet", () => {
		const joe = User.find({ name: "Joe" });
		const snip = new Snippet({
			title: "My Snippet",
			author: joe._id,
			code:
				"function hamSammich(ham, bread, cheese) { return bread + ham + cheese + bread}"
		});
		snip.save().then(() => {
			console.log(snip);
			//has joe been saved????????????????
			//is new flag is false when it is in the database
			//isNew flag is true when only exists in Node-land
			assert(!snip.isNew);
		});
	});
	it("Adds author to snippet", () => {
		Snippet.find({ title: "My Snippet" }).then(code => {
			assert(code.author === joe._id);
		});
	});
	it("Has snippet info in author", () => {
		User.find({ name: "Joe" }).then(user => {
			const snip = Snippet.find({ title: "My Snippet" });
			assert(user.snippets[0] === snip._id);
		});
	});
});
