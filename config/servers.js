const servers = [{
	  name:   'MCOM Cell2',
	  host:   '11.120.101.30',
	  port:   '8080',
	  suffix: '/a/config/deployment/',
	  file:   'service.properties',
	}, {
		name:   'BCOM Cell2',
	  host:   '11.120.101.76',
	  port:   '8080',
	  suffix: '/a/config/deployment/',
	  file:   'service.properties',
	}, {
		name:   'MCOM Staging',
	  host:   '11.120.103.60',
	  port:   '80',
	  suffix: '/a/config/deployment/',
	  file:   'service.properties',
	}, {
		name:   'BCOM Staging',
	  host:   'mdc2brc0405',
	  port:   '8280',
	  suffix: '/a/config/deployment/',
	  file:   'service.properties',
	}, 

];

module.exports = servers;