import * as React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { Button } from "../_symlink";

import "../theme/theme.scss";
import { getIconProps } from "../_symlink/components/display/icon";

storiesOf("Button", module)
  .addParameters({
    options: {
      showAddonPanel: true
    }
  })
  .add("Standard", () => (
    <>
      <p>
        A wrapper for the HTML button tag with some extra features and some
        basic styling.
      </p>
      <pre>{`<Button onClick={action("clicked")}>Hello Button</Button>`}</pre>

      <br />
      <br />

      <Button onClick={action("clicked")}>Hello Button</Button>

      <br />

      <Button className="bg-warning shadow" onClick={action("clicked")}>
        Hello Button
      </Button>
    </>
  ))
  .add("Icons", () => (
    <>
      <p>
        Armstrong Icons can be added to the left or right of a button,
        supporting Armstrong icons passed in as an iconProps object, or a custom
        bit of JSX
      </p>
      <pre>
        {`<Button`}
        <br />
        {`  leftIcon={getIconProps("Icomoon", "rocket")}`}
        <br />
        {`  onClick={action("clicked")}`}
        <br />
        {`>`}
      </pre>
      <br />
      <br />
      <Button
        leftIcon={getIconProps("Icomoon", "rocket")}
        onClick={action("clicked")}
      >
        Launch rocket
      </Button>
      <br />
      <Button
        rightIcon={getIconProps("Icomoon", "rocket")}
        onClick={action("clicked")}
      >
        Launch rocket
      </Button>
      <br />
      <br />
      <br />
      <br />
      <p>
        If no children are passed, and leftIcon or rightIcon (but not both) are
        passed, a data-is-icon-button property will be set to true, rendering
        the button as a circular button
      </p>
      <Button
        leftIcon={getIconProps("LinearIcons", "rocket")}
        onClick={action("clicked")}
      />
    </>
  ))
  .add("Pending and Disabled", () => (
    <>
      <p>
        Buttons can take a pending and disabled prop, which add an attribute to
        the component, meaning they can be styled accordingly
      </p>
      <pre>
        {`<Button`}
        <br />
        {`  pending={isPending}`}
        <br />
        {`  disabled={isDisabled}`}
        <br />
        {`  leftIcon={getIconProps("Icomoon", "rocket")}`}
        <br />
        {`  onClick={action("clicked")}`}
        <br />
        {`>`}
      </pre>
      <br />
      <br />
      <Button disabled onClick={action("clicked")}>
        This button is disabled
      </Button>
      <br />
      <Button pending onClick={action("clicked")}>
        This button is pending
      </Button>
    </>
  ));
