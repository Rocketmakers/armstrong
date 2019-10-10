import * as React from "react"
import { storiesOf } from '@storybook/react';
import { Icon, BurgerMenu, useBurgerMenu } from "../_symlink";

import "../theme/theme.scss";

const containerStyle: React.CSSProperties = {
  border: '1px solid grey',
  boxShadow: '0 0 5px rgba(0,0,0,0.1)',
  transform: 'scale(1)',
  height: 600,
  overflow: 'hidden'
};

const bodyStyle: React.CSSProperties = {
  color: 'white',
  height: '100%'
};

storiesOf('Burger menu', module)
  .addParameters({
    options: {
      showAddonPanel: true
    }
  })
  .add('Basic', () =>
    <div style={containerStyle}>
      <BurgerMenu
        position={"left"}
        mode={"push"}
        content={<MenuContent />}
        closeButtonIcon={Icon.Icomoon.cross}
        openButtonIcon={Icon.Icomoon.menu3}
      >
        <div style={bodyStyle}><PageContent /></div>
      </BurgerMenu>
    </div>)
  .add('Basic with hook events', () =>
    <div style={containerStyle}>
      <BurgerMenu
        hideOpenButton={true}
        content={<MenuContent />}
        closeButtonIcon={Icon.Icomoon.cross}
        openButtonIcon={Icon.Icomoon.menu3}
      >
        <div style={bodyStyle}><PageContentHooks /></div>
      </BurgerMenu>
    </div>)


const sideBarItemStyle: React.CSSProperties = {
  margin: '30px 0',
  display: 'block'
}
const sideBarItemIconStyle: React.CSSProperties = {
  marginRight: '20px'
}

const MenuContent: React.FC<{}> = () => {
  return (
    <div>
      <a style={sideBarItemStyle} ><Icon style={sideBarItemIconStyle} icon={Icon.Icomoon.crown} />LINK ONE</a>
      <a style={sideBarItemStyle} ><Icon style={sideBarItemIconStyle} icon={Icon.Icomoon.wallet} />LINK TWO</a>
      <a style={sideBarItemStyle} ><Icon style={sideBarItemIconStyle} icon={Icon.Icomoon.feed} />LINK THREE</a>
      <a style={sideBarItemStyle} ><Icon style={sideBarItemIconStyle} icon={Icon.Icomoon.hourGlass} />LINK FOUR</a>
    </div>
  )
}

const wowStyle: React.CSSProperties = {
  backgroundColor: 'white',
  border: '1px solid grey',
  boxShadow: '0 0 5px rgba(0,0,0,0.1)',
  height: 200,
  color: 'grey',
  padding: 20,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
};

const pageContentStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat( auto-fit, minmax(250px, 1fr))',
  gridGap: 20,
  padding: 20
}

const PageContent: React.FC<{}> = p => {
  return (
    <div style={pageContentStyle}>
      <div style={wowStyle}>WOW</div>
      <div style={wowStyle}>WOW</div>
      <div style={wowStyle}>WOW</div>
      <div style={wowStyle}>WOW</div>
    </div>
  )
}

const PageContentHooks: React.FC<{}> = p => {
  const { open, close, toggle, transitioning, isOpen } = useBurgerMenu()
  return (
    <div style={pageContentStyle}>
      <div style={wowStyle} onClick={open}>OPEN</div>
      <div style={wowStyle} onClick={close}>CLOSE</div>
      <div style={wowStyle} onClick={toggle}>TOGGLE</div>
      <div style={{ ...wowStyle, backgroundColor: transitioning ? 'pink' : 'white', color: transitioning ? 'white' : 'grey', transition: `0.3s` }}>TRANSITIONING</div>
      <div style={wowStyle}>isOpen: {isOpen ? "true" : "false"}</div>
    </div>
  )
}