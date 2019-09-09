import * as React from "react"
import { storiesOf } from '@storybook/react';
import { Sidebar, Icon, Button, useSidebar } from "../_symlink";

import "../theme/theme.scss";

storiesOf('Sidebar', module)
  .add('Basic', () =>
    <Sidebar
      content={SidebarContent}
      closeButtonIcon={Icon.Icomoon.arrowLeft3}
      openButtonIcon={Icon.Icomoon.arrowRight3}
    >
      <div id="site-wrapper">BODY</div>
    </Sidebar>)
  .add('Basic with hook', () =>
    <Sidebar
      position={"left"}
      content={SidebarContent}
      closeButtonIcon={Icon.Icomoon.arrowLeft3}
      openButtonIcon={Icon.Icomoon.arrowRight3}
    >
      <div id="site-wrapper"><MenuHandler /></div>
    </Sidebar>)


const SidebarContent: React.FC<{ open: boolean }> = ({ open }) => {

  return (
    <div>
      {open ?
        <>
          <div style={{ margin: '30px 0' }} className="sidebar-item"><Icon style={{ marginRight: '20px' }} icon={Icon.Icomoon.crown} />LINK ONE</div>
          <div style={{ margin: '30px 0' }} className="sidebar-item"><Icon style={{ marginRight: '20px' }} icon={Icon.Icomoon.wallet} />LINK TWO</div>
          <div style={{ margin: '30px 0' }} className="sidebar-item"><Icon style={{ marginRight: '20px' }} icon={Icon.Icomoon.feed} />LINK THREE</div>
          <div style={{ margin: '30px 0' }} className="sidebar-item"><Icon style={{ marginRight: '20px' }} icon={Icon.Icomoon.hourGlass} />LINK FOUR</div>
        </>
        :
        <>
          <div style={{ display: "flex", justifyContent: "center", margin: '30px 0' }} className="sidebar-item"><Icon icon={Icon.Icomoon.crown} /></div>
          <div style={{ display: "flex", justifyContent: "center", margin: '30px 0' }} className="sidebar-item"><Icon icon={Icon.Icomoon.wallet} /></div>
          <div style={{ display: "flex", justifyContent: "center", margin: '30px 0' }} className="sidebar-item"><Icon icon={Icon.Icomoon.feed} /></div>
          <div style={{ display: "flex", justifyContent: "center", margin: '30px 0' }} className="sidebar-item"><Icon icon={Icon.Icomoon.hourGlass} /></div>
        </>
      }
    </div>
  )
}

const MenuHandler: React.FC<{}> = p => {
  const { open, setOpen } = useSidebar()
  return (
    <>
      <Button onClick={() => setOpen(!open)}>{open ? "CLOSE" : "OPEN"} MENU</Button>
    </>
  )
}
