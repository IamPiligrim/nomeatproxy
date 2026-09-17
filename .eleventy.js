module.exports = function (eleventyConfig) {
	// Hand-maintained static translations (will be migrated...)
	eleventyConfig.addPassthroughCopy("tr");
	eleventyConfig.addPassthroughCopy("pt-br");
	eleventyConfig.addPassthroughCopy("es-ar");

	// Shared static assets referenced by every locale.
	eleventyConfig.addPassthroughCopy("CNAME");
	eleventyConfig.addPassthroughCopy("*.{png,jpg,jpeg,svg,webp,gif,ico}");
	eleventyConfig.addPassthroughCopy("emoji");
	eleventyConfig.addPassthroughCopy("src/styles.css");
	eleventyConfig.addPassthroughCopy("src/script.js");

	return {
		dir: {
			input: "src",
			output: "_site",
			data: "_data",
		},
		templateFormats: ["njk"],
		htmlTemplateEngine: "njk",
		markdownTemplateEngine: "njk",
	};
};
