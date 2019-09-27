import * as React from 'react';

import { storiesOf } from '@storybook/react';

import '../theme/theme.scss';
import { Spinner } from '../_symlink/components/display/spinner';

storiesOf('Spinner', module)
  .addParameters({
    options: {
      showAddonPanel: true
    }
  })
  .add('Simple Spinner', () => (
    <div>
      <Spinner />
    </div>
  ))
  .add('Custom Spinner', () => (
    <div>
      <Spinner>
        <p>Custom spinner</p>
      </Spinner>
    </div>
  ));
