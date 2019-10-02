import * as React from 'react';

import { storiesOf } from '@storybook/react';

import '../theme/theme.scss';
import { ProgressBar } from '../_symlink/components/display/progressBar';

storiesOf('Progress Bar', module)
  .addParameters({
    options: {
      showAddonPanel: true
    }
  })
  .add('Simple Progress Bar', () => {
    const [progress, setProgress] = React.useState(0);
    const timeout = React.useRef(null);

    React.useEffect(() => {
      timeout.current = setTimeout(() => {
        if (progress < 100) {
          setProgress(progress + 1);
        } else {
          setProgress(0);
        }
      }, 10);
    });

    return <ProgressBar progress={progress} labelText={`${progress}%`} />;
  })
  .add('Vertical Progress Bar', () => {
    const [progress, setProgress] = React.useState(0);
    const timeout = React.useRef(null);

    React.useEffect(() => {
      timeout.current = setTimeout(() => {
        if (progress < 100) {
          setProgress(progress + 1);
        } else {
          setProgress(0);
        }
      }, 10);
    });

    return <ProgressBar progress={progress} direction='up' thickness="9px" className="vertical-dude" labelText={`${progress}%`} labelVariant="following" />;
  });
