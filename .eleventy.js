const md = require('markdown-it')();

module.exports = function (config) {
  config.addShortcode('md', content => md.render(content));

  config.addCollection('pages', function(collection) {
    return collection.getFilteredByTags('page');
  });

  return {
    dir: {
      input: 'src',
      output: 'public'
    },
    templateFormats: ['njk', 'md', 'css'],
    htmlTemplateEngine: 'njk',
    passthroughFileCopy: true
  }
}
