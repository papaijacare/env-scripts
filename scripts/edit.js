'use strict';

const inquirer = require('inquirer');
const readFile = require('./read');
const writeFile = require('./write');

const OPTION_LIST = 'List servers';
const OPTION_ADD = 'Add server';
const OPTION_REMOVE = 'Remove server';
const OPTION_BACK = 'Go back'
const OPTION_EXIT = 'Exit'

let serversList;

const run = () => {
	serversList = readFile();
	const questions = [{
	  type:     'list',
	  name:     'option',
	  message:  'Choose one:',
	  choices: 	[OPTION_LIST, OPTION_ADD, OPTION_REMOVE, new inquirer.Separator(), OPTION_BACK, OPTION_EXIT],
	  pageSize: 10
	}];
	inquirer.prompt(questions).then(handleOption);
}

const handleOption = (answers) => {
	if(answers.option === OPTION_LIST) {
		for(let i = 0; i < serversList.length; i++){
			console.log(serversList[i].name);
		}
		run();
	} else if(answers.option === OPTION_ADD) {
		add();
	} else if(answers.option === OPTION_REMOVE) {
		remove();
	} else if(answers.option === OPTION_BACK) {
		module.parent.exports();
	} else if(answers.option === OPTION_EXIT) {
		console.log('Bye!');
		return 1;
	}
}

const add = () => {
	const questions = [{
	  type:     'input',
	  name:     'name',
	  message:  'Name:',
	  validate: (value) => value ? true : 'Name is required'
	}, {
	  type:     'input',
	  name:     'host',
	  message:  'Host IP address:',
	  validate: validateIP
	}, {
	  type:     'input',
	  name:     'dir',
	  message:  'Stella config dir:',
	  default: 	'/a/config/deployment/'
	}, {
	  type:     'input',
	  name:     'stella',
	  message:  'Stella config file:',
	  default: 	'service.properties'
	}, {
	  type:     'input',
	  name:     'solr',
	  message:  'Solr config file path:',
	  default: 	'ui/solr.connection.properties'
	}];
	inquirer.prompt(questions).then(validateServer);
}

const validateServer = (answers) => {
	serversList.push(answers)
	writeFile(serversList);
	run();
}

const remove = () => {
	const newList = serversList.concat([new inquirer.Separator(), OPTION_BACK, OPTION_EXIT]);

	inquirer.prompt({
		type: 'list',
		name: 'server',
		message: 'Select a server to remove:',
		choices: newList,
	  pageSize: newList.length
	}).then(removeServer);
}

const removeServer = (answers) => {
	if(answers.server === OPTION_BACK) {
		run();
	} else if(answers.server === OPTION_EXIT) {
		console.log('Bye!');
		return 1;
	} else {
		inquirer.prompt({
			type: 'confirm',
			name: 'iamsure',
			message: 'Confirm you want to remove ' + answers.server + '?',
			default: false
		}).then((confirmation) => {
			if(confirmation.iamsure) { 
				const newServersList = serversList.filter((element) => element.name !== answers.server);
				writeFile(newServersList);
			}
			run();
		});
	}
	
}

const validateIP = (value) => value.match(/^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/) ? true : 'Invalid IP address!';


module.exports = run;