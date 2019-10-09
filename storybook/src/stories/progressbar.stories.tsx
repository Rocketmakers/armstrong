import * as React from 'react';

import { storiesOf } from '@storybook/react';

import '../theme/theme.scss';
import {
  ProgressBar,
  AutoProgressBar
} from '../_symlink/components/display/progressBar';
import { Button } from '../_symlink';
import { useTemporaryState } from '../_symlink/hooks/useTemporaryState';

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

    return (
      <ProgressBar
        progress={progress}
        direction='up'
        thickness='9px'
        className='vertical-dude'
        labelText={`${progress}%`}
        labelVariant='following'
      />
    );
  })
  .add('Colour Fading Progress Bar', () => {
    const [progress, setProgress] = React.useState(0);
    const timeout = React.useRef(null);

    React.useEffect(() => {
      timeout.current = setTimeout(() => {
        if (progress < 100) {
          setProgress(progress + 1);
        } else {
          setProgress(0);
        }
      }, 1);
    });

    return (
      <ProgressBar
        startColour='yellow'
        endColour='green'
        progress={progress}
        direction='right'
        thickness='4px'
        className='vertical-dude'
      />
    );
  })
  .add('Fake Progress Bar', () => {
    const [loaded, setLoaded] = React.useState(false);

    const [resetting, setResetting] = useTemporaryState(false, 100);

    return (
      <>
        {!resetting && <AutoProgressBar startColour='red' endColour='green' thickness={'4px'} loaded={loaded} />}

        <br />

        <Button style={{ margin: '10px' }} onClick={() => setLoaded(true)}>
          Set Loaded
        </Button>

        <Button
          style={{ margin: '10px' }}
          onClick={() => {
            setResetting(true);
            setLoaded(false);
          }}
        >
          reset
        </Button>
      </>
    );
  });
