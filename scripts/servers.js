'use strict';

const CUSTOM_SRV_OPTION_STRING = 'Custom';
const OPTION_BACK = 'Go back'
const OPTION_EXIT = 'Exit'
const inquirer = require('inquirer');
const folders = require('./folders');
const readFile = require('./read');
let serversList;

const run = () => {
	serversList = readFile();
	Array.prototype.push.apply(serversList, [CUSTOM_SRV_OPTION_STRING, new inquirer.Separator(), OPTION_BACK, OPTION_EXIT]);
	const questions = [
		{
			type: 		'list',
			name: 		'server',
			message: 	'What server do you want to set up?',
			choices: 	serversList,
	  	pageSize: serversList.length
		}, {
			type: 			'input',
			name: 			'ip',
			message: 		'Enter IP address:',
			validate: 	validateIP,
			when: 	 		(answers) => answers.server === CUSTOM_SRV_OPTION_STRING
		}, {
			type: 			'confirm',
			name: 			'async',
			message: 		'Do you want do add async role to configuration?',
			default: 		false,
			when: 			(answers) => answers.server !== OPTION_BACK && answers.server !== OPTION_EXIT
		}
	];
	inquirer.prompt(questions).then(chosenServer);
}

const chosenServer = (answers) => {
	if (answers.server === CUSTOM_SRV_OPTION_STRING) {
		const choice = Object.assign({}, serversList[0], { name: 'Custom server', host: answers.ip, async: answers.async });
		folders(choice);
	} else if(answers.server === OPTION_BACK) {
		module.parent.exports();
	} else if(answers.server === OPTION_EXIT) {
		console.log('Bye!');
		return 1;
	} else {
		const choice = Object.assign({}, serversList.filter((element) => element.name === answers.server)[0], {async: answers.async} );
		folders(choice);
	}
}

const validateIP = (value) => value.match(/^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/) ? true : 'Invalid IP address!';
	
module.exports = run;