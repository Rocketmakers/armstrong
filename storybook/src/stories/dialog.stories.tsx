import * as React from "react"

import { storiesOf } from '@storybook/react';
import { Grid, Row, Col, Dialog, TextInput, Button, useDialog, DateInput } from "../_symlink";

import "../theme/theme.scss";

const data = { name: "keith" }

storiesOf('Dialog', module)
  .addParameters({
    options: {
      showAddonPanel: true
    }
  })
  .add('Classic dialog', () => {
    const [open, setOpen] = React.useState(false)

    return (
      [
        <Dialog bodySelector="body" isOpen={open} onClose={() => setOpen(false)}>
          <SampleDialogContent />
          <DateInput />
        </Dialog>,
        <Button onClick={() => setOpen(true)}>Open Classic</Button>
      ]
    )
  })
  .add('Hook dialog', () => {
    const { open, portal } = useDialog(SampleDialogContent, { hostElement: "body" })
    return (
      <>
        <Button onClick={() => open()}>Open Hook</Button>
        {portal}
      </>
    )
  })


const SampleDialogContent: React.FC = p => {
  return (
    <div>
      <h1>It is me.</h1>
      <p>The dialog</p>
    </div>
  )
}