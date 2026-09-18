const fs = require("fs");
const path = require("path");

module.exports = () =>
	fs
		.readdirSync(path.join(__dirname, "translations"))
		.filter((file) => /\.ya?ml$/.test(file))
		.map((file) => file.replace(/\.ya?ml$/, ""));
