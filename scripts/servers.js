'use strict';

const CUSTOM_SRV_OPTION_STRING = 'Custom';
const OPTION_EXIT = 'Go back'
const inquirer = require('inquirer');
const folders = require('./folders');
const readFile = require('./read');
let serversList;

const run = () => {
	serversList = readFile();
	serversList.push(CUSTOM_SRV_OPTION_STRING);
	serversList.push(new inquirer.Separator());
	serversList.push(OPTION_EXIT);
	const questions = [
		{
			type: 		'list',
			name: 		'server',
			message: 	'What server do you want to set up?',
			choices: 	serversList
		}, {
			type: 			'input',
			name: 			'ip',
			message: 		'Enter IP address:',
			validate: 	validateIP,
			when: 	 		(answers) => answers.server === CUSTOM_SRV_OPTION_STRING
		}
	];
	inquirer.prompt(questions).then(chosenServer);
}

const chosenServer = (answers) => {
	if (answers.server === CUSTOM_SRV_OPTION_STRING) {
		const choice = serversList[0];
		choice.name = 'Custom server';
		choice.host = answers.ip;
		folders(choice);
		// inquirer.prompt({
		// 	type: 		'input',
		// 	name: 		'ip',
		// 	message: 	'Enter IP address:',
		// 	validate: validateIP,
		// }).then(this.customServer);
	} else if(answers.server === OPTION_EXIT) {
		module.parent.exports();
	} else {
		const choice = serversList.filter((element) => element.name === answers.server)[0];
		folders(choice);
	}
}

// const customServer = (answers) => {
// 	const choice = {
// 		name:   'Custom Server',
// 	  host:   answers.ip,
// 	  port:   '80',
// 	  suffix: '/a/config/deployment/',
// 	  file:   'service.properties',
// 	  solr: 	'ui/solr.connection.properties',
// 	};
// 	folders(choice);
// }

const validateIP = (value) => value.match(/^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/) ? true : 'Invalid IP address!';
	

module.exports = run;