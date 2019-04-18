import { storiesOf } from "../story-host";
import { useDummyImageSrc, useRandomUserImageSrc, Image } from '../_symlink';
import * as React from 'react'

storiesOf("Image", Image)
  .props("Dummy Src", () => ({ src: useDummyImageSrc(128, 128) }))
  .props("Rounded Dummy Src", () => ({ src: useDummyImageSrc(128, 128), rounded: true }))
  .add("Random User", () => {
    return <Image src={useRandomUserImageSrc()} />
  })
