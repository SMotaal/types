/// <reference types="node" />

import {exists, symlink, readdir, linked, unlink} from './lib/fs.js';

(async () => {
	const task = 'relink';
	const scope = `${process.cwd()}/`;
	const modules = `${scope}packages/`;

	const {log, warn, group, groupEnd} = console;

	group('[%s]: %s', task, scope.replace(/^.*?(\/).*?\busers?\1.+?\1/i, '~$1'));

	try {
		OP: {
			const tasks = [];

			for (const name of await readdir(modules)) {
				name.startsWith('.') || tasks.push(relink({name, target: `${modules}${name}`, scope}));
			}

			const result = await Promise.all(tasks);

			for (const {name, error, wasFound, wasLinked, target} of result) {
				log();
				group('%O [%s]', name, error ? 'error' : !wasFound ? 'skipped' : wasLinked ? 'relinked' : 'unchanged');
				error ? warn(error) : target && log('-> %O', target);
				groupEnd();
			}

			log();
		}
	} catch (exception) {
		warn(exception);
	} finally {
		groupEnd();
	}
})();

export async function relink({scope, name, target, force = true}) {
	const parameters = arguments[0];
	const link = `${scope}${name}`;
	let wasLinked, error, wasFound;

	const absolute = new URL(target, `file://${scope}`).pathname;
	const relative = absolute.startsWith(scope) ? absolute.replace(scope, './') : undefined;

	target = relative || absolute;

	// console.log({parameters, link, absolute, relative, target});

	try {
		if ((wasFound = await exists(absolute))) {
			const alreadyExists = await exists(link);
			let currentLink = alreadyExists && (await linked(link));
			const canLink = !alreadyExists || currentLink !== false;
			const shouldRelink = currentLink && currentLink !== target;
			const canRelink = !!force;

			if (canLink) {
				if (currentLink) {
					if (canRelink) {
						currentLink = void (await unlink(link));
					} else if (shouldRelink) {
						error = new ReferenceError(
							`Error — path already exists and is linked to "${currentLink}" instead of "${target}"`,
						);
					}
				}
				if (!currentLink) {
					await symlink(target, link);
					wasLinked = true;
				}
			} else if (alreadyExists && !canLink) {
				error = new ReferenceError(`Error — path already exists and is not a link`);
			}
		}
	} catch (exception) {
		error = exception;
	}

	return {name, link, module: target, target: target, wasLinked, error, wasFound};
}
