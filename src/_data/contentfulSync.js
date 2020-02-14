const fs = require('fs-extra');
const contentful = require('../services/contentful');
const contentfulSyncPath = './contentfulSync.json';

const contentfulSync = async ({ nextSyncToken,  ...options }) => {
  return contentful
    .sync(nextSyncToken ? {
      nextSyncToken
    } : {
      initial: true,
      ...options
    })
    .then(response => JSON.parse(response.stringifySafe()));
}

const writeContentfulJson = async ({ ...data }) => {
  fs.outputJsonSync(
    contentfulSyncPath,
    { ...data }
  );
}

const mapEntryByLocale = ({ fields }, locale = process.env.CONTENTFUL_DEFAULT_LOCALE || 'en-US') => (
  Object.keys(fields).reduce((state, key) => ({
    ...state,
    [key]: (fields[key][locale] || null)
  }), {})
);

const runSync = (initial) => {
  return initial ? initialSync() : nextSync();
}

const initialSync = async () => {
  const json = await fs.readJsonSync(contentfulSyncPath, { throws: false });
  const sync = await contentfulSync({ nextSyncToken: false });
  const entries = sync.entries.map(entry => mapEntryByLocale(entry));

  if (!json) {
    writeContentfulJson({ ...sync, entries });
  }

  return entries;
}

const nextSync = async () => {
  const json = await fs.readJsonSync(contentfulSyncPath);
  const sync = await contentfulSync({ nextSyncToken: json.nextSyncToken });
  const entries = sync.entries.map(entry => mapEntryByLocale(entry));

  if (sync.nextSyncToken !== json.nextSyncToken) {
    writeContentfulJson({ ...sync, entries });
  }

  return entries;
}

module.exports = async () => {
  const entries = await runSync(true);

  setInterval(async () => await runSync(), 10000);

  return { entries };
}
