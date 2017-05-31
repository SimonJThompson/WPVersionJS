let WPVersion = require('./index.js');

let samples = [
	'wordpress.org',
	'metro.co.uk'
];

samples.forEach(sample => {
	WPVersion.check(sample).then(version => {
		console.log(version + '\t' + sample);
	}).catch(error => {
		console.log(error);
	});
});