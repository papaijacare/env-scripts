const fs = require('fs');
const pathXML = '/www/a/config/deployment/properties.dev.xml';
const options = {
  flags: 'w',
  defaultEncoding: 'utf8',
  autoClose: true
};
const fileXML = fs.createWriteStream(pathXML, options);

const processProperties = (content) => {
	const array = content.toString().split("\n");
	// fileXML.open();
  // fileXML.write('<?xml version="1.0" encoding="UTF-8" ?>\n<!-- Pointing to 11.120.101.30 - MCOM 1% Trunk Cell-2. Generated with ./env-setup.rb 2016-09-21 14:19 -->\n<config>\n');
  //<!-- Pointing to 11.120.101.30 - MCOM 1% Trunk Cell-2. Generated with ./env-setup.rb 2016-09-21 14:19 -->\n
  fileXML.write('<?xml version="1.0" encoding="UTF-8" ?>\n');
  fileXML.write('<config>\n');
  for(i in array) {
    const value = array[i].split('=');
    // console.log('<property name="' + value[0] + '"><override ifenv="dev-config/sandbox">' + value[1] + '</override></property>');
    fileXML.write('\t<property name="' + value[0] + '">\n\t\t<override ifenv="dev-config/sandbox">' + value[1] + '</override>\n\t</property>\n');
  }
  fileXML.write('</config>');
  fileXML.end();

  console.log('\nYou\'re good to go with Stella.')
};

module.exports = processProperties;