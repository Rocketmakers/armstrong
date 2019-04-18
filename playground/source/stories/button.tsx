import { storiesOf } from "../story-host";
import { Button, IButtonRef, Icon } from '../_symlink';
import * as React from 'react'

storiesOf("Button", Button)
  .add("Rounded", () => {
    return <Button onClick={() => alert("click")} rounded>click</Button>
  })
  .add("Left Icon", () => {
    return <Button onClick={() => alert("click")} leftIcon={Icon.Icomoon.happy} >click</Button>
  })
  .add("Right Icon", () => {
    return <Button onClick={() => alert("click")} rightIcon={Icon.Icomoon.sad} >click</Button>
  })
  .add("Pending", () => {
    return <Button onClick={() => alert("click")} pending={true} >click</Button>
  })
  .add("Focus/Blur", () => {
    const buttonRef = React.useRef<IButtonRef>()
    return (
      <div>
        <div onClick={() => buttonRef.current.focus()}>Focus button</div>
        <div onClick={() => buttonRef.current.blur()}>Blur button</div>
        <Button ref={buttonRef} onClick={() => alert("click")}>click</Button>
      </div>
    )
  })