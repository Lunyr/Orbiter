import React from 'react';

import {
  MdFormatBold as BoldIcon,
  MdFormatItalic as ItalicIcon,
  MdInsertLink as LinkIcon,
  MdFormatListBulleted as BulletListIcon,
  MdFormatQuote as QuoteIcon,
  MdFormatListNumbered as NumberListIcon,
  MdTitle as TitleIcon,
} from 'react-icons/md';

export default [
  {
    type: 'entity',
    label: 'Citations',
    style: 'link',
    entity: 'REFERENCE',
    icon: () => <span>CITE</span>,
  },
  { type: 'separator' },
  { type: 'inline', label: 'B', style: 'BOLD', icon: BoldIcon },
  { type: 'inline', label: 'I', style: 'ITALIC', icon: ItalicIcon },
  { type: 'entity', label: 'Link', style: 'link', entity: 'LINK', icon: LinkIcon },
  { type: 'separator' },
  { type: 'block', label: 'UL', style: 'unordered-list-item', icon: BulletListIcon },
  { type: 'block', label: 'OL', style: 'ordered-list-item', icon: NumberListIcon },
  { type: 'block', label: 'QT', style: 'blockquote', icon: QuoteIcon },
  { type: 'separator' },
  { type: 'entity', label: 'Title', style: 'TITLE', entity: 'TITLE', icon: TitleIcon },
];
