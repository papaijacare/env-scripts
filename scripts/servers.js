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
	serversList.push(CUSTOM_SRV_OPTION_STRING);
	serversList.push(new inquirer.Separator());
	serversList.push(OPTION_BACK);
	serversList.push(OPTION_EXIT);
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
			default: 		false
		}
	];
	inquirer.prompt(questions).then(chosenServer);
}

const chosenServer = (answers) => {
	if (answers.server === CUSTOM_SRV_OPTION_STRING) {
		const choice = serversList[0];
		choice.name = 'Custom server';
		choice.host = answers.ip;
		choice.async = answers.async;
		folders(choice);
	} else if(answers.server === OPTION_BACK) {
		module.parent.exports();
	} else if(answers.server === OPTION_EXIT) {
		console.log('Bye!');
		return 1;
	} else {
		const choice = serversList.filter((element) => element.name === answers.server)[0];
		choice.async = answers.async;
		folders(choice);
	}
}

const validateIP = (value) => value.match(/^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/) ? true : 'Invalid IP address!';
	
module.exports = run;