const request = require('request');
const Xray = require('x-ray');  
const x = Xray();
const prompt = require('prompt');

const processProperties = require('./process');


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
          prompt.get([{ //aks which folder
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
            const fetchUrl = `${newUrl}${options[result.option]}${choice.file}`;
            request.get(fetchUrl, (err, response, properties) => {
              if(err){ return onErr(err); } 

              if (response.statusCode == 200) {
                processProperties(properties);
              }
            });
          });

        } else {
          if (err) { return onErr(err); }

          const fetchUrl = `${newUrl}${options[0]}${choice.file}`;
          request.get(fetchUrl, (error, response, properties) => {
            if (!error && response.statusCode == 200) {
              processProperties(properties);
            }
          });
        }

      });

    } else {
      console.error('Something went wrong... Make sure you are inside Macy\s network (VPN).');
      return onErr(error);
    }
  });
};


function onErr(err) {
  console.log('Error: ', err);
  return 1;
}

module.exports = getDir;
