import {DarkModeController} from '../dark-mode-controller';

void class extends DarkModeController {
	target = document.body;
	state: 'auto';
	prefers: 'light';
	id = '';
	key = '';
};
