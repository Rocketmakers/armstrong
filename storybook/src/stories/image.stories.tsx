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

    return (
      <div style={{ width: '100px', height: '100px' }}>
        <Image src={src} renderSpinner />
      </div>
    );
  })
  .add('Lazy loading', () => (
    <>
      <Image renderSpinner lazy src={require('../assets/images/frank.jpg')} />

      <p>Scroll down for a lazy loaded image</p>

      <div className='space' style={{ height: '1024px' }} />

      <Image renderSpinner lazy src={require('../assets/images/frank2.jpg')} />

      <div className='space' style={{ height: '1024px' }} />

      <div
        style={{
          width: '800px',
          height: '600px',
          backgroundColor: 'lightgray',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        <Image
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'centre'
          }}
          renderSpinner
          lazy
          src='https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg'
          minimumTimeToSpinner={500}
        />
      </div>
    </>
  ))
  .add('Custom Loader', () => (
    <div
      style={{
        width: '800px',
        height: '600px',
        backgroundColor: 'lightgray',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <Image
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'centre'
        }}
        src={
          'https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg'
        }
        renderSpinner
        spinnerElement={<p>Loading nice image...</p>}
      />
    </div>
  ))
  .add('Image Error Handling', () => (
    <div
      style={{
        width: '800px',
        height: '600px',
        backgroundColor: 'lightgray',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <Image
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'centre'
        }}
        src={'THIS ISNT A URL'}
        renderSpinner
        renderError
      />
    </div>
  ));
