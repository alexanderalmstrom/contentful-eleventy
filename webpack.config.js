const path = require('path');

module.exports = {
	entry: './src/scripts/index.js',
	output: {
		path: path.resolve(__dirname, 'public', 'scripts'),
		filename: 'index.js'
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader'
				}
			}
		]
	}
}
