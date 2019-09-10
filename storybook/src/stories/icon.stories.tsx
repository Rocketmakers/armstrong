import * as React from "react"

import { storiesOf } from '@storybook/react';
import { Icon } from "../_symlink";

import "../theme/theme.scss";

storiesOf('Icon', module)
  .addParameters({
    options: {
      showAddonPanel: false
    }
  })
  .add('Rocket', () => <Icon icon={Icon.Icomoon.rocket} />)
  .add('Larger size', () => <Icon className="f-size-xlarge" icon={Icon.Icomoon.rocket} />)