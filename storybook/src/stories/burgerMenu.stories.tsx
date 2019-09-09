import * as React from "react"
import { storiesOf } from '@storybook/react';
import { Icon, SimpleBurgerMenu, useSimpleBurgerMenu, Button } from "../_symlink";

import "../theme/theme.scss";

storiesOf('Burger menu', module)
  .add('Simple', () => <SimpleBurgerMenu
    position={"left"}
    content={<MenuContent />}
    closeButtonIcon={Icon.Icomoon.cross}
    openButtonIcon={Icon.Icomoon.menu3}
  >
    <div id="site-wrapper">BODY</div>
  </SimpleBurgerMenu>)
  .add('Simple with hook', () =>
    <SimpleBurgerMenu
      hideOpenButton={true}
      content={<MenuContent />}
      closeButtonIcon={Icon.Icomoon.cross}
      openButtonIcon={Icon.Icomoon.menu3}
    >
      <div id="site-wrapper"><Header /></div>
    </SimpleBurgerMenu>)


const MenuContent: React.FC<{}> = () => {

  return (
    <div>
      <div style={{ margin: '30px 0' }} className="sidebar-item"><Icon style={{ marginRight: '20px' }} icon={Icon.Icomoon.crown} />LINK ONE</div>
      <div style={{ margin: '30px 0' }} className="sidebar-item"><Icon style={{ marginRight: '20px' }} icon={Icon.Icomoon.wallet} />LINK TWO</div>
      <div style={{ margin: '30px 0' }} className="sidebar-item"><Icon style={{ marginRight: '20px' }} icon={Icon.Icomoon.feed} />LINK THREE</div>
      <div style={{ margin: '30px 0' }} className="sidebar-item"><Icon style={{ marginRight: '20px' }} icon={Icon.Icomoon.hourGlass} />LINK FOUR</div>
    </div>
  )
}


const Header: React.FC<{}> = p => {
  const { open, setOpen } = useSimpleBurgerMenu()
  return (
    <>
      <Button onClick={() => setOpen(!open)}>{open ? "CLOSE" : "OPEN"} MENU</Button>
    </>
  )
}