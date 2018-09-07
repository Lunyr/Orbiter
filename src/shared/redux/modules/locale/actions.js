import locales from '../../../../assets/locales/index';

const actions = {
  CHANGE_LOCALE: 'locale/CHANGE_LOCALE',
};

const localeKeyToDisplay = {
  'en-US': 'English',
};

export const languageToReadable = {
  es: 'Español',
  en: 'English',
  zh: '中文',
};

export const localeLanguages = Object.keys(locales).reduce((acc, localeKey) => {
  acc.push({
    value: localeKey,
    label: localeKeyToDisplay[localeKey],
  });
  return acc;
}, []);

export const languageMaps = Object.keys(locales).reduce((acc, localeKey) => {
  acc[localeKey] = locales[localeKey];
  return acc;
}, {});

const getLocaleData = (language) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const locale = language.substring(0, language.indexOf('-'));
      const messages = languageMaps[language];
      if (language) {
        return resolve({
          locale,
          messages,
          language,
          loading: false,
        });
      }
      return reject({ error: 'Missing language pack', loading: false });
    }, 300);
  });

export const changeLocale = ({ value: language }) => ({
  type: actions.CHANGE_LOCALE,
  language,
  payload: getLocaleData(language),
});

export default actions;
