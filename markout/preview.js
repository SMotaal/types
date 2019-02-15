import {dynamicImport} from '../pholio/lib/import.js';

typeof document === 'object' &&
	typeof location === 'object' &&
	(async () => {
		let title, href, hash, type;

		const section = document.querySelector('markout-content:not([src])');

		if (!section) return;

		const link = document.head.querySelector(
			'link[rel="alternate" i][type^="text/markout" i][type^="text/markdown" i][type^="text/md" i][href], link[rel="alternate" i][href$=".md" i][href$=".markdown" i], link[rel="alternate" i][href]',
		);

		const base = /markout\/preview\.\b/i.exec(import.meta.url)
			? import.meta.url.replace(/markout\/preview\.\b.*$/i, '/')
			: location.origin
			? `${location.origin}${
					/\/markout\//i.test(location.pathname) ? location.pathname.replace(/\/markout\/.*$/i, '/') : '/'
			  }`
			: `${new URL('./', location)}`;

		const src =
			(link && ({href, title} = link) && href) ||
			((hash = location.hash) && (hash = hash.trim().slice(1)) && (href = `${new URL(hash, location.origin)}`)) ||
			((title = 'Markout'), `${base}./markout/README.md`);

		title ||
			((title = `${href.replace(/(.*?)((?:[^/]+?[/]?){1,2})(?:\..*|)$/, '$2')}`.trim()) &&
				(document.title = `${title} — Markout`));

		addEventListener('hashchange', () => location.reload());

		// section.rewriteAnchors = anchors => {
		// 	for (const anchor of anchors) {
		// 		!anchor || anchor.hash || !anchor.href || (anchor.href = `#${anchor.href}`);
		// 	}
		// };
		// addEventListener('hashchange', () => {
		// 	const src =
		// 		(hash = location.hash) && (hash = hash.trim().slice(1)) && (href = `${new URL(hash, location.origin)}`);

		// 	src && section.load(src);
		// });

		section.setAttribute('src', src);

		const lib = `${base}quench/${
			/^\?dev\b|\&dev\b/i.test(location.search) ? 'lib/browser/markout.js' : 'dist/markout.m.js'
		}`;

		dynamicImport(lib);
	})();
