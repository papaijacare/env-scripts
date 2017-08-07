const jsonfile = require('jsonfile');
const file = './config/servers.json';


const run = () => {
	try{
		return jsonfile.readFileSync(file);
	} catch(err) {
		console.log(err);
		return 1;
	}
}

module.exports = run;