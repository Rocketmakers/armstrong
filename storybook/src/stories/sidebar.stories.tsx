import * as React from "react"
import { storiesOf } from '@storybook/react';
import { Sidebar, Icon, Button, useSidebar } from "../_symlink";

import "../theme/theme.scss";

storiesOf('Sidebar', module)
  .add('Basic', () => <Sidebar
    content={({ open }) => <div>
      {open ?
        <>
          <div className="armstrong-burger-menu-item"><Icon icon={Icon.Icomoon.sad} />LINK 1</div>
          <div className="armstrong-burger-menu-item"><Icon icon={Icon.Icomoon.sad} />LINK 2</div>
          <div className="armstrong-burger-menu-item"><Icon icon={Icon.Icomoon.sad} />LINK 3</div>
          <div className="armstrong-burger-menu-item"><Icon icon={Icon.Icomoon.sad} />LINK 4</div>
        </>
        :
        <>
          <div className="armstrong-burger-menu-item"><Icon icon={Icon.Icomoon.sad} /></div>
          <div className="armstrong-burger-menu-item"><Icon icon={Icon.Icomoon.sad} /></div>
          <div className="armstrong-burger-menu-item"><Icon icon={Icon.Icomoon.sad} /></div>
          <div className="armstrong-burger-menu-item"><Icon icon={Icon.Icomoon.sad} /></div>
        </>
      }
    </div>
    }
    closeButtonIcon={Icon.Icomoon.arrowLeft3}
    openButtonIcon={Icon.Icomoon.arrowRight3}
  >
    <div id="site-wrapper">BODY</div>
  </Sidebar>)
  .add('Basic with hook', () => <Sidebar
    position={"left"}
    content={({ open }) => <div>
      {open ?
        <>
          <div className="armstrong-burger-menu-item"><Icon icon={Icon.Icomoon.sad} />LINK 1</div>
          <div className="armstrong-burger-menu-item"><Icon icon={Icon.Icomoon.sad} />LINK 2</div>
          <div className="armstrong-burger-menu-item"><Icon icon={Icon.Icomoon.sad} />LINK 3</div>
          <div className="armstrong-burger-menu-item"><Icon icon={Icon.Icomoon.sad} />LINK 4</div>
        </>
        :
        <>
          <div className="armstrong-burger-menu-item"><Icon icon={Icon.Icomoon.sad} /></div>
          <div className="armstrong-burger-menu-item"><Icon icon={Icon.Icomoon.sad} /></div>
          <div className="armstrong-burger-menu-item"><Icon icon={Icon.Icomoon.sad} /></div>
          <div className="armstrong-burger-menu-item"><Icon icon={Icon.Icomoon.sad} /></div>
        </>
      }
    </div>
    }
    closeButtonIcon={Icon.Icomoon.arrowLeft3}
    openButtonIcon={Icon.Icomoon.arrowRight3}
  >
    <div id="site-wrapper"><MenuHandler /></div>
  </Sidebar>)

const MenuHandler: React.FC<{}> = p => {
  const { open, setOpen } = useSidebar()
  return (
    <>
      <Button onClick={() => setOpen(!open)}>{open ? "CLOSE" : "OPEN"} MENU</Button>
    </>
  )
}
