const fs = require('fs');
const pathSOLR = '/www/a/config/deployment/dev-config/sandbox/ui/solr.connection.properties';
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

    console.log('\nYou\'re good to go with Solr.')
  });
};

module.exports = processProperties;