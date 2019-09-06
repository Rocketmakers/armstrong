import * as React from "react"

import { storiesOf } from '@storybook/react';
import { Tooltip} from "../_symlink";

import "../theme/theme.scss";

storiesOf('Tooltip', module)
  .add('Retain', () =>
    <Tooltip tooltip="It is me. The tooltip." retain={true}>
      <span>Hover here</span>
    </Tooltip>
  )
  .add('Manual aria', () =>
    <Tooltip tooltip="It is me. The tooltip" ariaLabel="The tooltip I am.">
      <span>Hover here</span>
    </Tooltip>
  )
  .add('No aria', () =>
    <Tooltip tooltip={<span>It is me. The tooltip</span>} ariaHideTooltip>
      <span>Hover here</span>
    </Tooltip>
  )
