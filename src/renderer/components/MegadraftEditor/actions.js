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
  /* {
    type: 'entity',
    label: 'Citations',
    style: 'link',
    entity: 'REFERENCE',
    icon: () => (
      <span style={{ fontSize: '0.9rem', fontWeight: 500, position: 'relative', bottom: 5 }}>
        CITE
      </span>
    ),
  },
  */
  { type: 'separator' },
  { type: 'inline', label: 'B', style: 'BOLD', icon: () => <BoldIcon size={20} /> },
  { type: 'inline', label: 'I', style: 'ITALIC', icon: () => <ItalicIcon size={20} /> },
  {
    type: 'entity',
    label: 'Link',
    style: 'link',
    entity: 'LINK',
    icon: () => <LinkIcon size={20} />,
  },
  { type: 'separator' },
  {
    type: 'block',
    label: 'UL',
    style: 'unordered-list-item',
    icon: () => <BulletListIcon size={20} />,
  },
  {
    type: 'block',
    label: 'OL',
    style: 'ordered-list-item',
    icon: () => <NumberListIcon size={20} />,
  },
  { type: 'block', label: 'QT', style: 'blockquote', icon: () => <QuoteIcon size={20} /> },
  { type: 'separator' },
  {
    type: 'entity',
    label: 'Title',
    style: 'TITLE',
    entity: 'TITLE',
    icon: () => <TitleIcon size={20} />,
  },
];
