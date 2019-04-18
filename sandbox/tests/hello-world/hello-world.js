{
	const div = document.querySelector('div#hello-world');
	div
		? (div.classList.add('hello-world'), console.log('hello world!'))
		: console.warn(`hello world! — can't find div#hello-world`);
}
