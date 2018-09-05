import fetch from 'node-fetch';

const actions = {
  FETCH: 'blog/FETCH',
};

function createUrlLink(title) {
  return title
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

function parseItems(items) {
  for (let i = 0; i < items.length; i++) {
    if (items[i].images === undefined) {
      items[i].images = [];
    }

    // Create images array
    let m,
      str = items[i].content,
      rex = /<img[^>]+src="(https:\/\/[^">]+)"/g;
    // eslint-disable-next-line
    while ((m = rex.exec(str))) {
      items[i].images.push(m[1]);
    }

    // Create URL
    if (items[i].url === undefined) {
      items[i].url = createUrlLink(items[i].title);
    }

    items[i].title = items[i].title.replace('&amp;', '&');
  }
  return items;
}

const RSS_ENGLISH = 'https://medium.com/feed/lunyr/';
const RSS_KOREAN = 'https://medium.com/feed/lunyrkr';
const RSS_CHINESE = 'https://medium.com/feed/lunyrcn';
const URL = 'https://api.rss2json.com/v1/api.json';
const KEY = 'qiugwcihihle5izqyudxzrefqlodu6fxzocgeznt';

export const fetchBlogPosts = () => ({
  type: actions.FETCH,
  payload: Promise.all([
    fetch(URL + `?rss_url=${RSS_ENGLISH}&api_key=${KEY}`),
    fetch(URL + `?rss_url=${RSS_KOREAN}&api_key=${KEY}`),
    fetch(URL + `?rss_url=${RSS_CHINESE}&api_key=${KEY}`),
  ]).then(([english, korean, chinese]) => ({
    english: parseItems(english.items),
    korean: parseItems(korean.items),
    chinese: parseItems(chinese.items),
    isFetchingPosts: false,
  })),
});

export default actions;
