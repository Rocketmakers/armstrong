import * as React from "react";

import { storiesOf } from "@storybook/react";
import { Icon } from "../_symlink";

import "../theme/theme.scss";
import { getIconProps } from "../_symlink/components/display/icon";

const style: Pick<React.HTMLAttributes<HTMLElement>, "style"> = {
  style: { margin: "20px", fontSize: "30px" }
};

storiesOf("Icon", module)
  .addParameters({
    options: {
      showAddonPanel: true
    }
  })
  .add("Icomoon", () => (
    <>
      <Icon {...style} {...getIconProps("Icomoon", "rocket")} />
      <Icon {...style} {...getIconProps("Icomoon", "leaf")} />
      <Icon {...style} {...getIconProps("Icomoon", "upload2")} />
      <Icon {...style} {...getIconProps("Icomoon", "package")} />
      <Icon {...style} {...getIconProps("Icomoon", "fileVideo")} />
      <br />
      <br />
      <p>
        Requires the IcoMoon-Ultimate.ttf pack available
        <a href="https://icomoon.io/#icons"> here</a>.
        <br />
        <br />
        Must be defined in your project as a css @font-face called
        IcoMoon-Ultimate (cannot be done in Armstrong for licencing reasons)
      </p>
    </>
  ))
  .add("Linear Icon", () => (
    <>
      <Icon {...style} {...getIconProps("LinearIcons", "sad")} />
      <Icon {...style} {...getIconProps("LinearIcons", "satellite2")} />
      <Icon {...style} {...getIconProps("LinearIcons", "scissors")} />
      <Icon {...style} {...getIconProps("LinearIcons", "userLock")} />
      <Icon {...style} {...getIconProps("LinearIcons", "vault")} />
      <br />
      <br />
      <p>
        Requires the Linearicons.ttf pack available
        <a href="https://icomoon.io/#icons"> here</a>.
        <br />
        <br />
        Must be defined in your project as a css @font-face called
        IcoMoon-Ultimate (cannot be done in Armstrong for licencing reasons)
      </p>
    </>
  ));
