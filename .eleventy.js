module.exports = function (config) {
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
