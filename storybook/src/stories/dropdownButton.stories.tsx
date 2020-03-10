import * as React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { DropdownButton, Icon } from "../_symlink";

import "../theme/theme.scss";


const options = [
  { label: <div><Icon icon={Icon.Icomoon.rocket}/>Custom element</div>, onClick: () => alert('there')},
  { label: "goodbye", onClick: () => alert('there')},
]

storiesOf("Dropdown Button", module)
  .addParameters({
    options: {
      showAddonPanel: true
    }
  })
  .add("Standard", () => (
    <>
      <p>
        A button which toggles a dropdown list when clicked
      </p>
      <pre>{`<DropdownButton options={options} onClick={action("clicked")}>Hello Button</DropdownButton>`}</pre>
      <br/>
      <br/>
      <DropdownButton leftIcon={Icon.Icomoon.arrowDown3} options={options}>Hello Button</DropdownButton>
    </>
  ));
