import { getLogger, Raven } from '../lib/logger';
import { settings } from './settings';

export const handleError = (err) => {
  if (err instanceof Error) {
    if (settings.isDevelopment) console.error(err);
    else if (settings.privacy.errorReporting) Raven.captureException(err);
  } else {
    console.error(err);
  }
};