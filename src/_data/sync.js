const fs = require('fs');
const path = require('path');
const contentful = require('../services/contentful');

const createDirIfNotExists = dir => (!fs.existsSync(dir) ? fs.mkdirSync(dir) : undefined);

const writeToFile = (filePath, data) => {
  fs.writeFileSync(path.resolve(process.cwd(), filePath), JSON.stringify(data));
};

module.exports = contentful.sync({ initial: true }).then((response) => {
  const data = JSON.parse(response.stringifySafe());
  const entries = JSON.stringify(data.entries, null, 2);

  createDirIfNotExists('entries');
  writeToFile('entries/entries.json', entries);
});
