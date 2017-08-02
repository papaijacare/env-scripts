const prompt = require('prompt');

const dir = require('./scripts/dir');
const servers = require('./config/servers');

for(let i=0; i<servers.length; i++) {
  console.log(`[ ${i} ] ${servers[i].name} (${servers[i].host})`);
}
console.log(`[ ${servers.length} ] Custom server IP`);
prompt.get([{
  description: 'Which server do you want to set up?',
  name: 'server',
  required: true,
  message: 'Invalid option!',
  conform: (value) => {
    if(value > servers.length) return false;
    return true;
  },
}], function (err, result) {
  if(err){
    console.log('Error: ', err);
    return 1;
  } else {
    if(result.server < servers.length) {
      const choice = servers[result.server];
      console.log('Server: ', choice.name);
      dir(choice);
    } else {
      prompt.get({
        description: 'Enter the IP of the server you want to set up - no port!',
        name: 'IP',
        required: true,
        message: 'Invalid IP!',
        pattern: /^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/,
      }, function (err, result) {
        if(err){
          console.log('Error: ', err);
          return 1;
        } else {
          console.log('Custom IP Sever: ', result.IP);
          const choice = {
            name:   'Custom IP Server',
            host:   result.IP,
            port:   '80',
            suffix: '/a/config/deployment/',
            file:   'service.properties',
            solr:   'ui/solr.connection.properties',
          }
          dir(choice);
        }
      });
    }
  }
});
