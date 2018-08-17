import LinkIcon from './entities/icons/LinkIcon';
import BulletListIcon from './entities/icons/BulletListIcon';
import QuoteIcon from './entities/icons/QuoteIcon';
import ItalicIcon from './entities/icons/ItalicIcon';
import HeaderIcon from './entities/icons/HeaderIcon';
import TitleIcon from './entities/icons/TitleIcon';
import BoldIcon from './entities/icons/BoldIcon';
import NumberListIcon from './entities/icons/NumberListIcon';

export default [
  /*
  {
    type: 'entity',
    label: 'Citations',
    style: 'link',
    entity: 'REFERENCE',
    icon: () => <span>CITE</span>,
  },
  */
  { type: 'separator' },
  { type: 'inline', label: 'B', style: 'BOLD', icon: BoldIcon },
  { type: 'inline', label: 'I', style: 'ITALIC', icon: ItalicIcon },
  { type: 'entity', label: 'Link', style: 'link', entity: 'LINK', icon: LinkIcon },
  { type: 'separator' },
  { type: 'block', label: 'UL', style: 'unordered-list-item', icon: BulletListIcon },
  { type: 'block', label: 'OL', style: 'ordered-list-item', icon: NumberListIcon },
  { type: 'block', label: 'H2', style: 'header-two', icon: HeaderIcon },
  { type: 'block', label: 'QT', style: 'blockquote', icon: QuoteIcon },
  { type: 'separator' },
  { type: 'entity', label: 'Title', style: 'TITLE', entity: 'TITLE', icon: TitleIcon },
];
