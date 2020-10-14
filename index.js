#!/usr/bin/env node

const fs = require('fs-extra');
const cp = require('child_process');
const minimist = require('minimist');

const argv = minimist(process.argv.slice(2));

const cwd = (() => {
	if (argv._ && argv._.length > 0) {
		const dir = argv._.pop();
		return `${process.cwd()}/${dir}`;
	}

	return process.cwd();
})();

const run = (cmd, options = { cwd }) => new Promise((resolve, reject) => {
	cp.exec(cmd, options, (err, stdout) => {
		if (err) {
			return reject(err);
		}

		return resolve(stdout);
	});
});

(async function createEleventySite() {
	console.log(`👋 Creating a new Eleventy website in ${cwd}`);
	console.log('');
	await fs.ensureDir(cwd);

	console.log('📥 Installing the static setup');
	console.log('☕️ This might take a while');
	console.log('');
	console.log('🚢 Moving some files around');
	console.log('');
	await fs.copy(`${__dirname}/templates/src`, `${cwd}/src`);
	await fs.copy(`${__dirname}/_gitignore`, `${cwd}/.gitignore`);

	console.log('🤖 Registering automation scripts');
	console.log('');
	const pkg = await fs.readJson(`${cwd}/package.json`);

	if (!pkg.scripts) {
		pkg.scripts = {};
	}

	Object.assign(pkg.scripts, {
		serve: 'npx @11ty/eleventy --serve --input=src --output=dist --formats=html,njk,gif,png,jpg,webp,css,js',
		build: 'npx @11ty/eleventy --input=src --output=dist --formats=html,njk,gif,png,jpg,webp,css,js'
	});

	await fs.outputJson(`${cwd}/package.json`, pkg, { spaces: 2 });

	console.log('🌱 All set! Let\'s get you started:');
	console.log('');
	console.log(`    cd ${cwd}`);
	console.log('    npm run serve');
	console.log('');
	console.log('🤞 Good luck, have fun!');
}());
