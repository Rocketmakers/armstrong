import { storiesOf } from "../story-host";
import { Button, IButtonRef, Icon } from '../_symlink';
import * as React from 'react'

storiesOf("Button", Button)
  .props("Rounded", () => {
    return { onClick: () => alert("click"), rounded: true, children: "click" }
  })
  .props("Pending", () => {
    return { onClick: () => alert("click"), pending: true, children: "click" }
  })
  .props("Left Icon", () => {
    return { onClick: () => alert("click"), leftIcon: Icon.Icomoon.happy, children: "click" }
  })
  .props("Right Icon", () => {
    return { onClick: () => alert("click"), rightIcon: Icon.Icomoon.sad, children: "click" }
  })
  .add("Focus/Blur", () => {
    const buttonRef = React.useRef<IButtonRef>()
    return (
      <div>
        <button onClick={() => buttonRef.current.focus()}>Focus button</button>
        <button onClick={() => buttonRef.current.blur()}>Blur button</button>
        <Button ref={buttonRef} onClick={() => alert("click")}>click</Button>
      </div>
    )
  })