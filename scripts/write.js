const jsonfile = require('jsonfile');
const file = './config/servers.json';


const run = (obj) => {
	try{
		return jsonfile.writeFileSync(file, obj, {spaces: 2, flag: 'w'});
	} catch(err) {
		console.log(err);
		return 1;
	}
}

module.exports = run;