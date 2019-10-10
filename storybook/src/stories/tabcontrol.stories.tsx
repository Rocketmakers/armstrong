import * as React from "react"

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Icon, TabControl, TabItem } from "../_symlink";

import "../theme/theme.scss";

storiesOf('Tab control', module)
  .addParameters({
    options: {
      showAddonPanel: true
    }
  })
  .add('3 tabs with callback', () =>
    <TabControl onTabChanged={action("onTabChanged")}>
      {tabItems}
    </TabControl>
  )
  .add('3 tabs, right aligned', () =>
    <TabControl tabAlignment="right" onTabChanged={action("onTabChanged")}>
      {tabItems}
    </TabControl>
  )
  .add('3 tabs, 2nd selected', () =>
    <TabControl defaultSelectedIndex={1} onTabChanged={action("onTabChanged")}>
      {tabItems}
    </TabControl>
  )


const tabItems = [
  <TabItem title="Tab item 1" icon={Icon.Icomoon.scissors}>
    It is me. The first tab item.
      </TabItem>,
  <TabItem title="Tab item 2" icon={Icon.Icomoon.screwdriver}>
    It is me. The second tab item.
      </TabItem>,
  <TabItem title="Tab item 3" icon={Icon.Icomoon.dumbbell}>
    It is me. The third tab item.
      </TabItem>
]