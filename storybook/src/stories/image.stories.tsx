import * as React from 'react';

import { storiesOf } from '@storybook/react';
import { Image, useDummyImageSrc, useRandomUserImageSrc } from '../_symlink';

import '../theme/theme.scss';

storiesOf('Image', module)
  .addParameters({
    options: {
      showAddonPanel: true
    }
  })
  .add('WEBP source', () => (
    <Image
      src={require('../assets/images/naut.jpg')}
      alternateSources={[
        { srcSet: require('../assets/images/naut.webp'), type: 'image/webp' }
      ]}
    />
  ))
  .add('Rounded', () => (
    <Image rounded src={require('../assets/images/naut.jpg')} />
  ))
  .add('Placeholder', () => <Image src={useDummyImageSrc(256, 256)} />)
  .add('Random user', () => {
    const src = useRandomUserImageSrc('Neil');

    return <Image src={src} />;
  })
  .add('Lazy loading', () => (
    <>
      <Image lazy src={require('../assets/images/frank.jpg')} />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <Image lazy src={require('../assets/images/frank.jpg')} />
    </>
  ));
