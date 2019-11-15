import * as React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { Button, Icon } from "../_symlink";

import "../theme/theme.scss";
import { getIconProps } from "../_symlink/components/display/icon";

storiesOf("Button", module)
  .addParameters({
    options: {
      showAddonPanel: true
    }
  })
  .add("Standard", () => (
    <Button onClick={action("clicked")}>Hello Button</Button>
  ))
  .add("Themed with shadow", () => (
    <Button className="bg-warning shadow" onClick={action("clicked")}>
      Hello Button
    </Button>
  ))
  .add("Left icon", () => (
    <Button
      leftIcon={getIconProps("Icomoon", "rocket")}
      onClick={action("clicked")}
    >
      Launch rocket
    </Button>
  ))
  .add("Icon button", () => (
    <>
      <Button
        leftIcon={getIconProps("Icomoon", "rocket")}
        onClick={action("clicked")}
      />

      <p style={{ marginTop: "30px" }}>
        If no children are passed, and leftIcon or rightIcon (but not both) are
        passed, a data-is-icon-button property will be set to true, rendering
        the button as a circular button
      </p>
    </>
  ));
