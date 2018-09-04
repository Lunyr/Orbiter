import React from 'react';
import baseRenderer from './base';

const months = [
  'Jan',
  'Feb.',
  'Mar.',
  'Apr.',
  'May',
  'June',
  'July',
  'Aug.',
  'Sept.',
  'Oct.',
  'Nov.',
  'Dec.',
];

class MLA extends React.Component {
  static italicize(text) {
    return `<i style="font-style: italic;">${text}</i>`;
  }

  static removeProtocols(url) {
    return url.replace(/http:\/\/|https:\/\//i, '');
  }

  static formatDate(timestamp) {
    const date = new Date(timestamp);
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  mappings() {
    return [
      { author: { prefix: '', suffix: '.' } },
      { title: { prefix: ' ', suffix: '.', formatters: [MLA.italicize] } },
      { creationDate: { prefix: ' ', suffix: '.' } },
      { publisher: { prefix: '  ', suffix: ',' } },
      { yearOfPub: { prefix: '  ', suffix: ',' } },
      { pagesCited: { prefix: '  ', suffix: ',' } },
      { url: { prefix: ' ', suffix: '', formatters: [MLA.removeProtocols] } },
      { lastAccessed: { prefix: ' Accessed ', suffix: '.', formatters: [MLA.formatDate] } },
      { print: { prefix: '  ', suffix: ',' } },
    ];
  }

  render() {
    return this.props.renderCitation({ mappings: this.mappings(), renderHtml: true });
  }
}

export default baseRenderer(MLA);
