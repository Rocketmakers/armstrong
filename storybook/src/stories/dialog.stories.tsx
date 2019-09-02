import * as React from "react"

import { storiesOf } from '@storybook/react';
import { Grid, Row, Col, Dialog, TextInput, Button, useDialog } from "../_symlink";

import "../theme/theme.scss";
import { bind } from "q";

const data = { name: "keith" }

storiesOf('Dialog', module)
  .add('Classic dialog', () => {
    const [open, setOpen] = React.useState(false)

    return (
      [
        <Dialog bodySelector="body" isOpen={open} onClose={() => setOpen(false)}>
          <SampleDialogContent />
        </Dialog>,
        <Button onClick={() => setOpen(true)}>Open Classic</Button>
      ]
    )
  })
  .add('Hook dialog [BROKEN]', () => {
    const { open, portal } = useDialog(() => <div>Oh shit, waddup?!</div>, { hostElement: "body" })
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