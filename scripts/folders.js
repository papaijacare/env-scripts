'use strict';


const request = require('request');
const Xray = require('x-ray');  
const x = Xray();

const inquirer = require('inquirer');


const writeStella = require('./stella');
const writeSolr = require('./solr');

const DEFAULT_FOLDER_CONTENT_NAME = 'stella'

let currentServer;

const main = (server) => {
  currentServer = server;
  request.get(getURL(), getFolders)
};

const getFolders = (error, response, body) => {
  if (!error && response.statusCode == 200) {
    x(body, {folders: ['a']})(handleFolders)
  }
  else {
    console.error('Something went wrong... Make sure you are inside Macy\s network (VPN).');
    return onErr(error);
  }
};

const handleFolders = (err, result) => {
  if (err) return onErr(err);
  const folders = result['folders'].filter( (x) => x.indexOf(DEFAULT_FOLDER_CONTENT_NAME) != -1 );
  if(folders.length === 1) {
    fetchProperties(folders[0]);
  } else {
    multipleFolders(folders)
  };
};

const multipleFolders = (folders) => {
  inquirer.prompt({
    type:     'list',
    name:     'folder',
    message:  'Which folder contains the property file?',
    choices:  folders,
  }).then(chosenFolder);
};

const chosenFolder = (answers) => {
  fetchProperties(answers.folder);
};

const fetchProperties = (folder) => {
  fetchStella(getURL() + folder + currentServer.stella);
  fetchSolr(getURL() + folder + currentServer.solr);
};

const fetchStella = (url) => {
  console.log('Fetching Stella properties...')
  request.get(url, (err, response, properties) => {
    if (!err && response.statusCode == 200) {
      writeStella(properties);
    }
  });
};

const fetchSolr = (url) => {
  console.log('Fetching Solr properties...');
  request.get(url, (err, response, properties) => {
    if (!err && response.statusCode == 200) {
      writeSolr(properties);
    } else {
      const questions = [{
        type:     'confirm',
        name:     'solr',
        message:  'Unable to find Solr property file on ' + url +'. Do you want to enter the full URL property file?'
      }, {
        type:     'input',
        name:     'url',
        message:  'Full URL:',
        when:     (answers) => answers.solr
      }];
      inquirer.prompt(questions).then(chosenSolr);
    }
  })
};

const chosenSolr = (answers) => {
  if (!answers.solr) {
    console.log('You chose not to set up Solr properties.');
  } else if (answers.url) {
    request.get(url, (err, response, properties) => {
      if(err){ return onErr(err); } 
      if (!err && response.statusCode == 200) {
        writeSolr(properties);
      }
    });
  }
};

const getURL = () => `http://${currentServer.host}${currentServer.dir}`;

const onErr = (err) => {
  console.log('Error: ', err);
  return 1;
};

module.exports = main;