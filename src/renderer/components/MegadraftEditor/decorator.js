import DraftJS from 'draft-js';
import { createTypeStrategy } from 'megadraft/lib/utils';
import ReferenceComponent from './entities/references/ReferenceComponent';
import TitleComponent from './entities/title/TitleComponent';
import LinkComponent from 'megadraft/lib/components/Link';

export default new DraftJS.CompositeDecorator([
  /*{
    strategy: createTypeStrategy('REFERENCE'),
    component: ReferenceComponent,
  },
  */
  {
    strategy: createTypeStrategy('LINK'),
    component: LinkComponent,
  },
  {
    strategy: createTypeStrategy('TITLE'),
    component: TitleComponent,
  },
]);
