import * as React from "react";
import Helmet from "react-helmet";

import { ClassHelpers, Button } from "@rocketmakers/armstrong"

import "../theme/theme.scss";
import "./shell.scss";
import { Link } from "gatsby";
import GlobalContext from "../context/globalContext";



const Shell = ({ viewClass, children }) => {
  const { isMobileSize } = React.useContext(GlobalContext)

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <>
      <Helmet title="Armstrong React" />
      <header className="fixed-width">
        <Link to="/" className="logo">
          <img alt="Armstrong" src={require('../assets/armstrong-logo.svg')} />
        </Link>
        {isMobileSize && <Button className="menu-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>M</Button>}
        <nav className={ClassHelpers.classNames({ 'mobile-nav': isMobileSize }, { 'menu-open': isMenuOpen })}>
          <Link to="/installation">Installation</Link>
          <Link to="/compatability">Compatibility</Link>
          <a target="_blank" href="https://rocketmakers.github.io/armstrong">Storybook</a>
        </nav>
      </header>
      <main className={ClassHelpers.classNames(viewClass, "fixed-width")}>
        {children}
      </main>
      <footer className="fixed-width">
        <img alt="Rocketmakers" className="rm-logo" src={require('../assets/rocketmakers-logo.svg')} />
        <span>Built and powered by <a href="https://www.rocketmakers.com/" target="_blank">Rocketmakers</a> ltd {new Date().getFullYear()}</span>
      </footer>
    </>
  );
}

export default Shell;
