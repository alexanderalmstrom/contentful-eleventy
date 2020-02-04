require('dotenv').config();

const { createClient } = require('contentful');

const contentful = createClient({
	space: process.env.CONTENTFUL_SPACE_ID,
	accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
});

module.exports = contentful;
