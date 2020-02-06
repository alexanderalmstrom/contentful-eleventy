const fs = require('fs-extra');
const path = require('path');
const contentful = require('../services/contentful');
const contentfulSyncPath = './contentfulSync.json';

const responseToJson = response => JSON.parse(response.stringifySafe());

const contentfulSync = async ({ nextSyncToken, ...rest }) => {
  return contentful.sync(
    nextSyncToken ?
    {
      nextSyncToken
    } : {
      initial: true,
      ...rest
    }
  ).then(response => responseToJson(response));
}

const writeSync = async ({ nextSyncToken, ...rest }) => {
  const contentfulSyncJson = await fs.readJson(contentfulSyncPath);

  if (nextSyncToken !== contentfulSyncJson.nextSyncToken) {
    contentfulSync({ nextSyncToken });

    fs.outputJson(contentfulSyncPath, {
      nextSyncToken,
      ...rest
    });
  }
}

module.exports = (async () => {
  const entries = await contentfulSync({ type: 'Entry' });

  console.log('====== ENTRIES ======', entries);

  writeSync(entries);
});
