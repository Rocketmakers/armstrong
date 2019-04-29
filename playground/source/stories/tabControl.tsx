import { storiesOf } from "../story-host";
import { TabControl, TabItem } from '../_symlink';
import * as React from 'react'

storiesOf("TabControl", TabControl)
  .add("Basic", () => {
    return (
      <TabControl>
        <TabItem title="One">
          <h3>One</h3>
        </TabItem>
        <TabItem title="Two">
          <h3>Two</h3>
        </TabItem>
        <TabItem title="Three">
          <h3>Three</h3>
        </TabItem>
        <TabItem title="Four">
          <h3>Four</h3>
        </TabItem>
      </TabControl>
    )
  })
