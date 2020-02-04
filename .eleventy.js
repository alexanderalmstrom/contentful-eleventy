const md = require('markdown-it')();

module.exports = function (config) {
  config.addShortcode('md', content => md.render(content));

  return {
    dir: {
      input: 'src',
      output: 'public'
    },
    templateFormats: ['njk', 'md'],
    htmlTemplateEngine: 'njk',
    passthroughFileCopy: true
  }
}
