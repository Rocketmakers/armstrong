import * as React from "react"
import { storiesOf } from '@storybook/react';
import { Sidebar, Icon, Button, useSidebar } from "../_symlink";

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

storiesOf('Sidebar', module)
  .add('Basic', () =>
    <div style={containerStyle}>
      <Sidebar
        content={SidebarContent}
        closeButtonIcon={Icon.Icomoon.arrowRight3}
        openButtonIcon={Icon.Icomoon.arrowLeft3}
        position={"right"}
      >
        <div style={bodyStyle}>BODY<PageContent /></div>
      </Sidebar>
    </div>)
  .add('Basic with hook events', () =>
    <div style={containerStyle}>
      <Sidebar
        position={"left"}
        content={SidebarContent}
        closeButtonIcon={Icon.Icomoon.arrowLeft3}
        openButtonIcon={Icon.Icomoon.arrowRight3}
      >
        <div style={bodyStyle}><PageContentHooks /></div>
      </Sidebar>
    </div>)



const sideBarItemStyle: React.CSSProperties = {
  margin: '30px 0'
}
const sideBarItemIconStyle: React.CSSProperties = {
  marginRight: '20px'
}
const closedSideBarItemStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  margin: '30px 0'
}

const SidebarContent: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {

  return (
    <div>
      {isOpen ?
        <>
          <div style={sideBarItemStyle} ><Icon style={sideBarItemIconStyle} icon={Icon.Icomoon.crown} />LINK ONE</div>
          <div style={sideBarItemStyle} ><Icon style={sideBarItemIconStyle} icon={Icon.Icomoon.wallet} />LINK TWO</div>
          <div style={sideBarItemStyle} ><Icon style={sideBarItemIconStyle} icon={Icon.Icomoon.feed} />LINK THREE</div>
          <div style={sideBarItemStyle} ><Icon style={sideBarItemIconStyle} icon={Icon.Icomoon.hourGlass} />LINK FOUR</div>
        </>
        :
        <>
          <div style={closedSideBarItemStyle} ><Icon icon={Icon.Icomoon.crown} /></div>
          <div style={closedSideBarItemStyle} ><Icon icon={Icon.Icomoon.wallet} /></div>
          <div style={closedSideBarItemStyle} ><Icon icon={Icon.Icomoon.feed} /></div>
          <div style={closedSideBarItemStyle} ><Icon icon={Icon.Icomoon.hourGlass} /></div>
        </>
      }
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
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
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
  const { open, close, toggle, transitioning, isOpen } = useSidebar()
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