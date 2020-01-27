import * as React from "react";

import { storiesOf } from "@storybook/react";
import { Dialog, Button, useDialog, DateInput } from "../_symlink";

import "../theme/theme.scss";

storiesOf("Dialog", module)
  .addParameters({
    options: {
      showAddonPanel: true
    }
  })
  .add("Classic dialog", () => {
    const [open, setOpen] = React.useState(false);

    return (
      <>
        <p>
          The dialog component portals a dialog to the top of the dom when
          isOpen is true, allowing for a downwards flow of state into the Dialog
        </p>

        <pre>
          {`const [isOpen, setIsOpen] = React.useState(false)`}
          <br />
          <br />
          {`<Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} />`}
        </pre>

        <br />
        <br />

        <Dialog
          bodySelector="body"
          isOpen={open}
          onClose={() => setOpen(false)}
        >
          <SampleDialogContent />
          <DateInput />
        </Dialog>
        <Button onClick={() => setOpen(true)}>Open Classic</Button>
      </>
    );
  })
  .add("Hook dialog", () => {
    const { open, portal } = useDialog(SampleDialogContent, {
      hostElement: "body"
    });

    return (
      <>
        <p>
          Dialogs can alternatively be invoked using the useDialog hook, which
          takes the content of the dialog and its props, and returns several
          methods and the portal element which must be placed somwhere in the
          React tree
        </p>

        <br />

        <pre>{`const {open, portal} = useDialog(<p>I don't need safety gloves, because I'm Homer Simpson</p>)`}</pre>

        <br />
        <br />

        <Button onClick={() => open()}>Open Hook</Button>

        {portal}
      </>
    );
  });

const SampleDialogContent: React.FC = p => {
  return (
    <div>
      <h1>It is me.</h1>
      <p>The dialog</p>
    </div>
  );
};
