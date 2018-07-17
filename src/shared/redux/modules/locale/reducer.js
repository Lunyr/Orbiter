import actions, { localeLanguages } from './actions';
import locales from '../../../../assets/locales/index';

const defaultLocale = 'en';
const defaultLanguage = 'en-US';

const initialState = {
  language: defaultLanguage,
  locale: defaultLocale,
  loading: false,
  messages: locales[defaultLanguage],
  localeLanguages,
};

const localeReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${actions.CHANGE_LOCALE}_START`: {
      return {
        ...state,
        loading: true,
      };
    }

    case `${actions.CHANGE_LOCALE}_SUCCESS`: {
      return {
        ...state,
        ...action.payload,
        loading: false,
      };
    }

    case `${actions.CHANGE_LOCALE}_ERROR`: {
      return {
        ...state,
        error: action.payload.error,
        loading: false,
      };
    }

    default:
      return state;
  }
};

export default localeReducer;
