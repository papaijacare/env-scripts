'use strict';

const inquirer = require('inquirer');
const servers = require('./servers');
const edit = require('./edit');
const OPTION_SETUP = 'Setup environment';
const OPTION_EDIT = 'Edit servers list';
const OPTION_EXIT = 'Exit';


const main = () => {
	const questions = [{
	  type:     'list',
	  name:     'option',
	  message:  'What do you want to do?',
	  choices: 	[OPTION_SETUP, OPTION_EDIT, new inquirer.Separator(), OPTION_EXIT]
	}];
	inquirer.prompt(questions).then(handleOption);
}

const handleOption = (answers) => {
	if(answers.option === OPTION_SETUP) {
		servers();
	} else if(answers.option === OPTION_EDIT) {
		edit();
	} else {
		console.log('Bye!');
		return 1;
	}
}

module.exports = main;