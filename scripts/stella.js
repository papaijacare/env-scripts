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

const pathXML = path.join(rootDir,'www','a','config','deployment','properties.dev.xml');
const options = {
  flags: 'w',
  defaultEncoding: 'utf8',
  autoClose: true
};

const processProperties = (content) => {
  const backup = fs.createReadStream(pathXML).pipe(fs.createWriteStream(pathXML + '.bkp_' + new Date().getTime().toString()));
  backup.on('finish', () => {
    const fileXML = fs.createWriteStream(pathXML, options);
    const array = content.toString().split("\n");

    fileXML.write('<?xml version="1.0" encoding="UTF-8" ?>\n');
    fileXML.write('<config>\n');
    for(let i in array) {
      const value = array[i].split('=');
      // console.log('<property name="' + value[0] + '"><override ifenv="dev-config/sandbox">' + value[1] + '</override></property>');
      fileXML.write('\t<property name="' + value[0] + '">\n\t\t<override ifenv="dev-config/sandbox">' + value[1] + '</override>\n\t</property>\n');
    }
    fileXML.write('</config>');
    fileXML.end();

    console.log('You\'re good to go with Stella.')
  });
};

module.exports = processProperties;