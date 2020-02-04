const contentful = require('../services/contentful');

module.exports = contentful.getEntries({
	content_type: 'post'
});
