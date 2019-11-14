import * as React from "react";

import { storiesOf } from "@storybook/react";
import { Icon } from "../_symlink";

import "../theme/theme.scss";

storiesOf("Icon", module)
  .addParameters({
    options: {
      showAddonPanel: true
    }
  })
  .add("Icomoon", () => (
    <>
      <Icon className="f-size-xlarge m-right-small" iconSet='Icomoon' iconName='rocket' />
      <Icon className="f-size-xlarge m-right-small" iconSet="Icomoon" iconName="leaf" />
      <Icon className="f-size-xlarge m-right-small" iconSet="Icomoon" iconName="upload2" />
      <Icon className="f-size-xlarge m-right-small" iconSet="Icomoon" iconName="package" />
      <Icon className="f-size-xlarge m-right-small" iconSet="Icomoon" iconName="fileVideo" />
      <br />
      <br />
      <p>
        Requires the IcoMoon-Ultimate.ttf pack available
        <a href="https://icomoon.io/#icons"> here</a>.
        <br/><br/>
        Must be defined in your project as a css @font-face called IcoMoon-Ultimate (cannot be done in Armstrong for licencing reasons)
      </p>
    </>
  ))
  .add("Linear Icon", () => (
    <>
      <Icon className="f-size-xlarge m-right-small" iconSet="LinearIcons" iconName="sad" />
      <Icon
        className="f-size-xlarge m-right-small"
        iconSet="LinearIcons"
        iconName="satellite2"
      />
      <Icon
        className="f-size-xlarge m-right-small"
        iconSet="LinearIcons"
        iconName="scissors"
      />
      <Icon
        className="f-size-xlarge m-right-small"
        iconSet="LinearIcons"
        iconName="userLock"
      />
      <Icon
        className="f-size-xlarge m-right-small"
        iconSet="LinearIcons"
        iconName="vault"
      />
      <br />
      <br />
      <p>
        Requires the Linearicons.ttf pack available
        <a href="https://icomoon.io/#icons"> here</a>.
        <br/><br/>
        Must be defined in your project as a css @font-face called IcoMoon-Ultimate (cannot be done in Armstrong for licencing reasons)
      </p>
    </>
  ));
