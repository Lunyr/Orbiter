import moment from 'moment';

/*
* Utility namespace for common formatting functions
*/

export const cleanUnderscores = title => title && title.replace(new RegExp('_', 'g'), ' ');

export const formatDisplayDate = date => moment(date).format('MMM Do YYYY');

export const formatDisplayDateLong = date => moment(date).format('MMMM Do YYYY, h:mm:ss a');

export const timeAgoDisplay = date => moment(date).fromNow();

export const parseIntWithRadix = value => parseInt(value, 10);
