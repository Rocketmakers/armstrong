import * as React from "react";
import { Grid, Row, Col, TabControl, TabItem, Icon } from "armstrong-react";

interface ITabControlViewProps extends React.Props<TabControlView> {}

export class TabControlView extends React.Component<ITabControlViewProps, {}> {
  render() {
    return (
      <Grid>
        <Row>
          <Col>
            <article>
              <h1>Components: Tab control</h1>
              <p>The tab control allows you to switch between multiple pieces of content without navigating away from the page.</p>
              <pre className="callout major">
                {`import { TabControl, TabItem } from 'armstrong-react';`}
              </pre>

              <hr />

              <h2 id="tab-control">Tab Control</h2>
              <p>The main tab control element hosts one or many tab item children</p>

              <pre className="callout minor">
                {`<TabControl defaultSelectedIndex='(number)'
                onTabChanged='((index: number)=> void)'
                tabAlignment='('left' | 'right')'>
                children='(TabItem[])'
</TabControl>`}
              </pre>
              <table>
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>defaultSelectedIndex (number)</td>
                    <td>The default selected tab on first render.</td>
                  </tr>
                  <tr>
                    <td>onTabChanged ((index: number)=> void</td>
                    <td>Fires when the tab is changed by the user returning the new selected index.</td>
                  </tr>
                  <tr>
                    <td>tabAlignment ("left" | "right")</td>
                    <td>Wether to align the tabs to the right or left of the header. Defaults to left.</td>
                  </tr>
                </tbody>
              </table>

              <hr />

              <h2 id="tab-item">Tab Item</h2>
              <p>A child of the tab control. Controls its header and its contents</p>
              <pre className="callout minor">
                {`<TabItem title='(string|JSX.Element)' icon='(iconstring)'>{TAB CONTENTS}</TabItem>`}
              </pre>
              <table>
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>title (string|JSX.Element)</td>
                    <td>The title of the tab. Can be a string or an element</td>
                  </tr>
                  <tr>
                    <td>icon (string (Icomoon))</td>
                    <td>Tn optional icon to show to the left of the title in the tab header</td>
                  </tr>
                </tbody>
              </table>

              <hr />
              <h1 id="examples">Examples</h1>

              <TabControl>
                <TabItem title="Tab 1">I am the content for tab 1</TabItem>
                <TabItem title="Tab 2">I am the content for tab 2</TabItem>
                <TabItem title="Tab 3">I am the content for tab 3</TabItem>
                <TabItem title="Tab 4" icon={Icon.Icomoon.rocket}>
                  I am the content for tab 3
                </TabItem>
              </TabControl>

              <pre>
                {`<TabControl>
                <TabItem title="Tab 1">I am the content for tab 1</TabItem>
                <TabItem title="Tab 2">I am the content for tab 2</TabItem>
                <TabItem title="Tab 3">I am the content for tab 3</TabItem>
                <TabItem title="Tab 4" icon={Icon.Icomoon.rocket}>I am the content for tab 3</TabItem>
              </TabControl>`}
              </pre>
            </article>
          </Col>
          <Col className="secondary-nav" width={200}>
            <ul>
              <li>
                <a href="#tab-control">Tab control</a>
              </li>
              <li>
                <a href="#tab-item">Tab item</a>
              </li>
              <li>
                <a href="#examples">Examples</a>
              </li>
            </ul>
          </Col>
        </Row>
      </Grid>
    );
  }
}
