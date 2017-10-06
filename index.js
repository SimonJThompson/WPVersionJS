let request = require('request');

module.exports = {

	check: function(target) {

		target = 'http://' + target + '/';

		return new Promise((resolve, reject) => {

			// Check for references in the WordPress feed.
			this.checkFeedReferences(target).then(version => {
				resolve(version);
			}).catch(error => {

				// Check for references in the code.
				this.checkCodeReferences(target).then(version => {
					resolve(version);
				}).catch(error => {
					reject(false);
				});
			});
		});

	},

	checkFeedReferences: function(target) {
		return new Promise((resolve, reject) => {

			// Get the feed.
			request(target + 'feed/', function(error, response, body) {

				if(error || !response.statusCode) return reject(false);

				// Check for the generator tag.
				var matches = body.match(/wordpress.org\/\?v=(\*|\d+(\.\d+){0,2}(\.\*)?)/);
				if(matches) return resolve(matches[1]);

				// No luck, reject the promise.
				return reject(false);
			});
		});
	},

	checkCodeReferences: function(target) {
		return new Promise((resolve, reject) => {

			// Get the homepage source code.
			request(target, function(error, response, body) {

				// Check meta tags.
				var matches = body.match(/content="WordPress (\*|\d+(\.\d+){0,2}(\.\*)?)"/);
				if(matches) return resolve(matches[1]);

				// Check for references to ?ver - requires more precise version numbers.
				var matches = body.match(/wp-emoji-release.min.js(?:.*)ver=(\*|\d+(\.\d+){1,2}(\.\*)?)/);
				if(matches) return resolve(matches[1]);

				// No luck, reject the promise.
				return reject(false);
			});
		});
	}

}