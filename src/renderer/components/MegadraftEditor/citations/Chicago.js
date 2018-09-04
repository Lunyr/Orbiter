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

class Chicago extends React.Component {
  static formatDate(timestamp) {
    const date = new Date(timestamp);
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  mappings() {
    return [
      { author: { prefix: '', suffix: '.' } },
      { title: { prefix: '"', suffix: '." ' } },
      { currentDate: { prefix: 'Accessed ', suffix: '. ', formatters: [Chicago.formatDate] } },
      { url: { prefix: '', suffix: '' } },
      { publisher: { prefix: '  ', suffix: ',' } },
      { yearOfPub: { prefix: '  ', suffix: ',' } },
      { pagesCited: { prefix: '  ', suffix: ',' } },
    ];
  }

  render() {
    return this.props.renderCitation({ mappings: this.mappings() });
  }
}

export default baseRenderer(Chicago);
