/// <reference types="node" />

(async () => {
	const {existsSync, symlinkSync, readdirSync, statSync, readlinkSync} = await import('fs');
	// const {createRequireFromPath} = await import('module');

	const root = new URL('../', import.meta.url).pathname;
	const modules = `${root}node_modules/@smotaal/`;
	// const require = createRequireFromPath(root);
	const task = 'relink';

	const isLink = path => {
		try {
			readlinkSync(path);
			return true;
		} catch (exception) {
			return false;
		}
	};

	for (const name of readdirSync(modules)) {
		if (name.startsWith('.')) continue;

		const link = `${root}${name}`;
		const module = `${modules}${name}`;
		const target = module.replace(root, './');
		const installed = existsSync(module);
		const exists = existsSync(link);
		const linked = exists && isLink(link);
		if (exists && !linked) {
			console.warn('[%s]: %O [%s]', task, `./${name}`, `Error — path already exists and is not a link`);
		} else if (linked) {
			console.log('[%s]: %O -> %O [%s]', task, `./${name}`, target, installed ? '√' : 'Not Installed');
		} else {
			symlinkSync(target, link);
			console.log('[%s]: %O -> %O [%s]', task, `./${name}`, target, installed ? 'Linked' : 'Not Installed');
		}
	}

	// const require = createRequireFunction

	// // const [, root, slash, base] = __dirname.match(/(.+)([\\/])(.+?)\2scripts\2?$/);
	// const modules = 'node_modules';
	// {
	//   const link = `${root}${slash}${modules}`;
	//   const target = `.${slash}${base}${slash}${modules}`;
	//   existsSync(link) || symlinkSync(target, link, 'dir');
	// }
})();
