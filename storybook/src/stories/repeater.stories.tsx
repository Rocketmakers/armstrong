import * as React from "react"

import { storiesOf } from '@storybook/react';
import { Image, Repeater } from "../_symlink";

import "../theme/theme.scss";

storiesOf('Repeater', module)
  .addParameters({
    options: {
      showAddonPanel: false
    }
  })
  .add('Standard', () => <Repeater count={10} render={item => <div>It is me, child {item.index}</div>} />)