'use strict';

const CUSTOM_SRV_OPTION_STRING = 'I will enter the server IP address';
const inquirer = require('inquirer');
const folders = require('./folders');
const serversList = require('../config/servers');


class Servers {
	
	constructor() {
		serversList.push(new inquirer.Separator());
		serversList.push(CUSTOM_SRV_OPTION_STRING);
	}

	run() {
		inquirer.prompt({
			type: 		'list',
			name: 		'server',
			message: 	'What server do you want to set up?',
			choices: 	serversList,
		}).then(this.chosenServer);
	}

	chosenServer(answers) {
		if (answers.server === CUSTOM_SRV_OPTION_STRING) {
			inquirer.prompt({
				type: 		'input',
				name: 		'ip',
				message: 	'Enter IP address:',
				validate: validateIP,
			}).then(this.customServer);
		} else {
			const choice = serversList.filter((element) => element.name === answers.server)[0];
			folders(choice);
		}
	}

	customServer(answers) {
		const choice = {
			name:   'Custom Server',
		  host:   answers.ip,
		  port:   '80',
		  suffix: '/a/config/deployment/',
		  file:   'service.properties',
		  solr: 	'ui/solr.connection.properties',
		};
		folders(choice);
	}

	validateIP = (value) => value.match(/^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/) ? true : 'Invalid IP address!';
	
}

export default Servers;