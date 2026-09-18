const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Ajv = require("ajv");
const yaml = require("js-yaml");

const translationsDir = path.join(__dirname, "..", "src", "_data", "translations");
const schema = JSON.parse(
	fs.readFileSync(path.join(__dirname, "..", "schema", "translation.schema.json"), "utf8")
);
const languages = JSON.parse(
	fs.readFileSync(path.join(__dirname, "..", "src", "_data", "languages.json"), "utf8")
);

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);

const files = fs.readdirSync(translationsDir).filter((file) => /\.ya?ml$/.test(file));

function loadTranslation(file) {
	return yaml.load(fs.readFileSync(path.join(translationsDir, file), "utf8"));
}

test("every translation file matches the schema", () => {
	for (const file of files) {
		const data = loadTranslation(file);
		const valid = validate(data);
		assert.ok(
			valid,
			`${file} failed schema validation:\n${ajv.errorsText(validate.errors, { separator: "\n" })}`
		);
	}
});

test("each translation's lang field matches its filename", () => {
	for (const file of files) {
		const code = file.replace(/\.ya?ml$/, "");
		const data = loadTranslation(file);
		assert.equal(data.lang, code, `${file}: "lang" is "${data.lang}", expected "${code}"`);
	}
});

test("every templated locale has a matching languages.json entry", () => {
	for (const file of files) {
		const code = file.replace(/\.ya?ml$/, "");
		const entry = languages.find((l) => l.code === code);
		assert.ok(entry, `no languages.json entry for locale "${code}"`);
	}
});

test("languages.json entries have non-empty required fields", () => {
	for (const entry of languages) {
		for (const field of ["code", "hreflang", "lang", "name"]) {
			assert.ok(
				typeof entry[field] === "string" && entry[field].length > 0,
				`languages.json entry ${JSON.stringify(entry)} is missing "${field}"`
			);
		}
	}
});

test("only the root locale has an empty href in languages.json", () => {
	for (const entry of languages) {
		if (entry.code === "en") {
			assert.equal(entry.href, "", `expected the root locale "en" to have an empty href`);
		} else {
			assert.notEqual(
				entry.href,
				"",
				`languages.json entry for "${entry.code}" has an empty href — it will link to itself instead of /${entry.code}/`
			);
		}
	}
});
