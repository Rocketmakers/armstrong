import * as React from "react"

import { storiesOf } from '@storybook/react';
import centered from '@storybook/addon-centered/react';
import { Image, useDummyImageSrc, useRandomUserImageSrc } from "../_symlink";

import "../theme/theme.scss";

storiesOf('Image', module)
  .addParameters({ options: { showPanel: false } })
  .add('WEBP source', () => <Image src={require('../assets/images/naut.jpg')} webpSrc={require('../assets/images/naut.webp')} />)
  .add('Rounded', () => <Image rounded src={require('../assets/images/naut.jpg')} />)
  .add('Placeholder', () => <Image src={useDummyImageSrc(256, 256)} />)
  .add('Random user', () => <Image src={useRandomUserImageSrc('Neil')} />)