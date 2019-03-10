export async function dynamicImport(specifier, referrer) {
	dynamicImport.base || (dynamicImport.base = `${new URL('./', document.baseURI)}`);
	const src = `${new URL(specifier, referrer || dynamicImport.base)}`;
	if (!('import' in dynamicImport)) {
		try {
			dynamicImport.import = null;
			dynamicImport.import = (1, eval)(`specifier => import(specifier)`);
		} catch (exception) {
			const promises = new Map();
			dynamicImport.import = (specifier, referrer = dynamicImport.base) => {
				let script, promise;
				(promise = promises.get(src)) ||
					promises.set(
						src,
						(promise = new Promise((onload, onerror) => {
							document.body.append(
								Object.assign((script = document.createElement('script')), {src, type: 'module', onload, onerror}),
							);
						})),
					);
				promise.finally(() => script && script.remove());
				return promise;
			};
		}
	}
	return dynamicImport.import(src);
}
