const fs = require('fs-extra');
const contentful = require('../services/contentful');
const contentfulSyncPath = './contentfulSync.json';

const contentfulSync = async ({ nextSyncToken, ...rest }) => {
  return contentful.sync(
    nextSyncToken ?
    {
      nextSyncToken
    } : {
      initial: true,
      ...rest
    }
  ).then(response => JSON.parse(response.stringifySafe()));
}

const writeToContentfulJson = async ({ nextSyncToken, ...rest }) => {
  const json = await fs.readJson(contentfulSyncPath);

  if (nextSyncToken !== json.nextSyncToken) {
    contentfulSync({ nextSyncToken });

    fs.outputJson(contentfulSyncPath, {
      nextSyncToken,
      ...rest
    });
  }
}

const mapEntryByLocale = ({ fields }, locale = 'en-US') => (
  Object.keys(fields).reduce((state, key) => ({
    ...state,
    [key]: (fields[key][locale] || null)
  }), {})
)

module.exports = async () => {
  const sync = await contentfulSync({ type: 'all' });
  const entries = sync.entries.map(entry => mapEntryByLocale(entry));

  setInterval(()=> writeToContentfulJson(sync.nextSyncToken, entries), 10000);

  return { entries };
};
