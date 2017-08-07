'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

let rootDir;
if(os.platform().indexOf('win32') !== -1) {
  rootDir = 'C:';
} else {
  rootDir = '/';
}

const pathSOLR = path.join(rootDir,'www','a','config','deployment','dev-config','sandbox','ui','solr.connection.properties');
// const pathSOLR = '/www/a/config/deployment/dev-config/sandbox/ui/solr.connection.properties';
const options = {
  flags: 'w',
  defaultEncoding: 'utf8',
  autoClose: true
};

const processProperties = (content) => {
  const backup = fs.createReadStream(pathSOLR).pipe(fs.createWriteStream(pathSOLR + '.bkp_' + new Date().getTime().toString()));
  backup.on('finish', () => {
    const fileSOLR = fs.createWriteStream(pathSOLR, options);
    fileSOLR.write(content);
    fileSOLR.end();

    console.log('You\'re good to go with Solr.')
  });
};

module.exports = processProperties;