import * as React from 'react';

import { storiesOf } from '@storybook/react';

import '../theme/theme.scss';

import { SwitchInput } from '../_symlink/components/form/inputs/switchInput';

storiesOf('Switch', module)
  .addParameters({
    options: {
      showAddonPanel: true
    }
  })
  .add('Simple Switch', () => (
    <div>
      <SwitchInput />
    </div>
  ));
