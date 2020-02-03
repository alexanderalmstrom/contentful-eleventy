module.exports = function(eleventyConfig) {
  return {
    dir: { input: 'src', output: 'dist', data: '_data' },
    templateFormats: ['njk', 'md', 'css', 'html', 'yml'],
    htmlTemplateEngine: 'njk'
  }
}
