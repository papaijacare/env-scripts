const fs = require('fs');
const pathSOLR = '/www/a/config/deployment/dev-config/sandbox/ui/solr.connection.properties';
const options = {
  flags: 'w',
  defaultEncoding: 'utf8',
  autoClose: true
};
const fileSOLR = fs.createWriteStream(pathSOLR, options);

const processProperties = (content) => {
  fileSOLR.write(content);
  fileSOLR.end();

  console.log('\nYou\'re good to go with Solr.')
};

module.exports = processProperties;