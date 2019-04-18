﻿import {html, css, Component, local} from './helpers.js';

const styles = css`
	@import '/pholio/styles/debug.css';

	:host {
		display: flex;
		padding: 0;
		margin: 0;
		/* flex-flow: row; */
		/* grid-auto-flow: row; */
		/* grid-auto-rows: 1fr; */
	}

	#wrapper {
		flex: 1;
		display: grid;
		grid-auto-flow: row;
		grid-auto-rows: min-content;
		/* grid-template-columns: repeat(auto-fit, minmax(7.5em, auto)); */
		grid-gap: 0.5ch;
		align-content: space-between;
		padding: 0.5ch;
	}
`;

export class SandboxConsoleElement extends Component {
	constructor() {
		super();
		// /** @type {HTMLSlotElement} */ const slot = this['::'];
	}

	connectedCallback() {
		super.connectedCallback();
	}
}

try {
	SandboxConsoleElement.shadowRoot = {mode: 'closed'};
	SandboxConsoleElement.styles = styles;
	SandboxConsoleElement.template = html`
		<div id="wrapper">
			<!-- <div id="toolbar"> -->
			<!-- <input id="address" /> -->
			<!-- <input id="reload" type="button" /> -->
			<!-- </div> -->
			<slot inert></slot>
			<div id="content"><slot id="output" name="output" hidden></slot></div>
		</div>
		<!-- Slot used to sort child elements -->
	`;

	customElements.define('sandbox-console', SandboxConsoleElement);
} catch (exception) {
	console.warn(exception);
}
