require('dotenv').config();

const { createClient } = require('contentful');

const contentful = createClient({
	space: process.env.CONTENTFUL_SPACE_ID,
	accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
});

async function getPosts () {
	return contentful.getEntries({
		content_type: 'post'
	});
}

module.exports = async () => {
	const posts = await getPosts();

	return { posts }
}
