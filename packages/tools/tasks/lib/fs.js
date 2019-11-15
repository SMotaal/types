import {promisify} from 'util';
import fs from 'fs';

export const async = {};

const proxy = new Proxy(Object.create(fs), {
	get(target, property) {
		return (
			async[property] ||
			(typeof target[property] === 'function' && (async[property] = promisify(target[property]))) ||
			target[property]
		);
	},
});

export const {exists, symlink, readdir, readlink, unlink} = proxy;

/** @type {path => string | false} */
export const linked = async path => {
	try {
		return `${await readlink(path)}`;
	} catch (exception) {
		return false;
	}
};

export default proxy;
