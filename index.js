#!/usr/bin/env node

const fs = require('fs-extra');
const minimist = require('minimist');

const argv = minimist(process.argv.slice(2));

const cwd = (() => {
	if (argv._ && argv._.length > 0) {
		const dir = argv._.pop();
		return `${process.cwd()}/${dir}`;
	}

	return process.cwd();
})();



(async function createEleventySite() {
	console.log(`👋 Creating a new Eleventy website in ${cwd}`);
	console.log('');
	await fs.ensureDir(cwd);

	console.log('🤖 Copying files over');
	console.log('');

	await fs.copy(`${__dirname}/templates/src`, `${cwd}/src`);
	await fs.copy(`${__dirname}/templates/.gitignoreFile`, `${cwd}/.gitignore`);
	await fs.copy(`${__dirname}/templates/README.md`, `${cwd}/README.md`);
	await fs.copy(`${__dirname}/templates/package.json`, `${cwd}/package.json`);

	console.log('🌱 All set! Let\'s get you started:');
	console.log('');
	console.log(`    cd ${cwd}`);
	console.log('    npm run serve');
	console.log('');
	console.log('👍 Good luck, have fun!');
}());
