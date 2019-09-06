import * as React from "react"
import { storiesOf } from '@storybook/react';
import { Icon, SimpleBurgerMenu, useSimpleBurgerMenu, Button } from "../_symlink";

import "../theme/theme.scss";

storiesOf('Burger menu', module)
  .add('Simple', () => <SimpleBurgerMenu
    position={"left"}
    mode={"push"}
    content={<div>
      <div className="armstrong-burger-menu-item"><Icon icon={Icon.Icomoon.sad} />LINK 1</div>
      <div className="armstrong-burger-menu-item"><Icon icon={Icon.Icomoon.sad} />LINK 2</div>
      <div className="armstrong-burger-menu-item"><Icon icon={Icon.Icomoon.sad} />LINK 3</div>
      <div className="armstrong-burger-menu-item"><Icon icon={Icon.Icomoon.sad} />LINK 4</div>
    </div>}
    closeButtonIcon={Icon.Icomoon.cross}
    openButtonIcon={Icon.Icomoon.menu3}
  >
    <div id="site-wrapper">BODY</div>
  </SimpleBurgerMenu>)
  .add('Simple with hook', () =>
    <SimpleBurgerMenu
      hideOpenButton={true}
      content={<div>
        <div className="armstrong-burger-menu-item"><Icon icon={Icon.Icomoon.sad} />LINK 1</div>
        <div className="armstrong-burger-menu-item"><Icon icon={Icon.Icomoon.sad} />LINK 2</div>
        <div className="armstrong-burger-menu-item"><Icon icon={Icon.Icomoon.sad} />LINK 3</div>
        <div className="armstrong-burger-menu-item"><Icon icon={Icon.Icomoon.sad} />LINK 4</div>
      </div>}
      closeButtonIcon={Icon.Icomoon.cross}
      openButtonIcon={Icon.Icomoon.menu3}
    >
      <div id="site-wrapper"><Header /></div>
    </SimpleBurgerMenu>)


const Header: React.FC<{}> = p => {
  const { open, setOpen } = useSimpleBurgerMenu()
  return (
    <>
      <Button onClick={() => setOpen(!open)}>{open ? "CLOSE" : "OPEN"} MENU</Button>
    </>
  )
}