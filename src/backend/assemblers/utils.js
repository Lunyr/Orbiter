/**
 * clearNulls removes any object properties with a null value
 * @param {object} obj is the object to clean up
 * @returns {object} the same object with null props removed
 */
export const clearNulls = (obj) => {
  Object.keys(obj).forEach((key) => (obj[key] === null) && delete obj[key]);
  return obj;
};

/**
 * clearUndefined removes any object properties with an 'undefined' value
 * @param {object} obj is the object to clean up
 * @returns {object} the same object with null props removed
 */
export const clearUndefined = (obj) => {
  Object.keys(obj).forEach((key) => (typeof obj[key] === 'undefined') && delete obj[key]);
  return obj;
};