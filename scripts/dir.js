const request = require('request');
const Xray = require('x-ray');  
const x = Xray();
const prompt = require('prompt');

const processStella = require('./stella');
const processSolr = require('./solr');


const getDir = (choice) => {

  const newUrl = `http://${choice.host}${choice.suffix}`;

  request.get(newUrl, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      x(body, {
        dirList: ['a']
      })(function(err, result){

        if (err) { return onErr(err); }
        const options = result['dirList'].filter( (x) => x.indexOf('stella') != -1 );

        if(options.length > 1) {
          for(let i=0; i<options.length; i++) {
            console.log(`[${i}] ${options[i]}`);
          }
          prompt.get([{ //asks which folder
            description: 'Which folder contains the property file?',
            name: 'option',
            required: true,
            message: 'Invalid option!',
            conform: (value) => {
              if(value >= options.length) return false;
              return true;
            },
          }], function (err, result) { //folder prompt result
            if(err){ return onErr(err); } 

            console.log('Folder: ', result.option);
            fetchStella(`${newUrl}${options[result.option]}${choice.file}`);
            fetchSolr(`${newUrl}${options[result.option]}${choice.solr}`);
          });

        } else {
          if (err) { return onErr(err); }
          fetchStella(`${newUrl}${options[0]}${choice.file}`);
          fetchSolr(`${newUrl}${options[0]}${choice.solr}`);
        }

      });

    } else {
      console.error('Something went wrong... Make sure you are inside Macy\s network (VPN).');
      return onErr(error);
    }
  });
};

const fetchStella = (url) => {
  console.log('Fetching Stella properties...')
  request.get(url, (err, response, properties) => {
    if (!err && response.statusCode == 200) {
      processStella(properties);
    }
  });
};

const fetchSolr = (url) => {
  console.log('Fetching Solr properties...')
  request.get(url, (err, response, properties) => {
    if (!err && response.statusCode == 200) {
      processSolr(properties);
    } else {
      prompt.get([{ //asks which folder
        description: 'Unable to find Solr property file on ' + url +'. You cant enter the full URL property file or press enter to skip.',
        name: 'url',
      }], function (err, result) { //folder prompt result
        if(err){ return onErr(err); } 
        if(result.url){
          console.log('Solr properties URL: ', result.url);
          request.get(url, (err, response, properties) => {
            if(err){ return onErr(err); } 
            if (!err && response.statusCode == 200) {
              processSolr(properties);
            }
          });
        }
      });
    }
  });
};


const onErr = (err) => {
  console.log('Error: ', err);
  return 1;
};

module.exports = getDir;
