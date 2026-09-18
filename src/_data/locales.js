const fs = require("fs");
const path = require("path");

module.exports = () =>
	fs
		.readdirSync(path.join(__dirname, "translations"))
		.filter((file) => file.endsWith(".json"))
		.map((file) => file.replace(/\.json$/, ""));
