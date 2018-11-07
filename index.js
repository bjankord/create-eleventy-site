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

	console.log('📥 Installing the static setup & 11ty');
	console.log('☕️ This might take a while');
	console.log('');
	await run('npx @gentsagency/create-static-site --yes --scope=@gentsagency');
	await run('npm install --save-dev 11ty/eleventy');

	console.log('🚢 Moving some files around');
	console.log('');
	await fs.copy(`${__dirname}/templates/src`, `${cwd}/src`);

	console.log('🤖 Registering automation scripts');
	console.log('');
	const pkg = await fs.readJson(`${cwd}/package.json`);

	if (!pkg.scripts) {
		pkg.scripts = {};
	}

	Object.assign(pkg.scripts, {
		serve: 'eleventy --serve --input=src --output=www --formats=md,html,njk',
		build: 'eleventy --input=src --output=www --formats=md,html,njk & gulp; exit 0;',
	});

	await fs.outputJson(`${cwd}/package.json`, pkg, { spaces: 2 });

	console.log('🌱 All set! Let\'s get you started:');
	console.log('');
	console.log(`    cd ${cwd}`);
	console.log('    gulp watch & npm run serve');
	console.log('');
	console.log('🤞 Good luck, have fun!');
}());
