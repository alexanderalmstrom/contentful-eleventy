const fs = require('fs-extra');
const contentful = require('../services/contentful');
const contentfulSyncPath = './contentfulSync.json';

const contentfulSync = async ({ nextSyncToken, ...options }) => {
  return contentful.sync(
    nextSyncToken ?
    {
      nextSyncToken
    } : {
      initial: true,
      ...options
    }
  ).then(response => JSON.parse(response.stringifySafe()));
}

const writeContentfulJson = async ({ nextSyncToken, ...rest }) => {
  fs.outputJsonSync(contentfulSyncPath, {
    nextSyncToken,
    ...rest
  });
}

const mapEntryByLocale = ({ fields }, locale = process.env.CONTENTFUL_DEFAULT_LOCALE || 'en-US') => (
  Object.keys(fields).reduce((state, key) => ({
    ...state,
    [key]: (fields[key][locale] || null)
  }), {})
)

const runSync = ({ ...options }) => {
  return options.initial ? initialSync(options) : nextSync(options);
}

const initialSync = async (options) => {
  const sync = await contentfulSync({ ...options });
  const json = fs.readJsonSync(contentfulSyncPath, { throws: false });
  const entries = sync.entries.map(entry => mapEntryByLocale(entry));

  if (!json) {
    writeContentfulJson({ nextSyncToken: sync.nextSyncToken, ...entries });
  }

  return entries;
}

const nextSync = async () => {
  const json = await fs.readJsonSync(contentfulSyncPath, { throws: false });
  const sync = contentfulSync({ nextSyncToken: json.nextSyncToken });
  const entries = sync.entries.map(entry => mapEntryByLocale(entry));

  if (sync.nextSyncToken !== json.nextSyncToken) {
    writeContentfulJson({ nextSyncToken: sync.nextSyncToken, ...entries });
  }

  return entries;
}

module.exports = async () => {
  const entries = runSync({ initial: true });

  setInterval(runSync, 10000);

  return { entries };
};
