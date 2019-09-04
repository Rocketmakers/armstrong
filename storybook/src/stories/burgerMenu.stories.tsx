import * as React from "react"

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import centered from '@storybook/addon-centered/react';
import { NewBurgerMenu, Icon } from "../_symlink";

import "../theme/theme.scss";

storiesOf('Burger menu', module)

  .addDecorator(centered)
  .add('hello', () => <NewBurgerMenu
    position={"left"}
    collapse={true}
    content={<div>
      <div className="armstrong-burger-menu-item"><Icon icon={Icon.Icomoon.sad} />LINK 1</div>
      <div className="armstrong-burger-menu-item"><Icon icon={Icon.Icomoon.sad} />LINK 2</div>
      <div className="armstrong-burger-menu-item"><Icon icon={Icon.Icomoon.sad} />LINK 3</div>
      <div className="armstrong-burger-menu-item"><Icon icon={Icon.Icomoon.sad} />LINK 4</div>
    </div>}
    closeButtonIcon={Icon.Icomoon.cross}
    openButtonIcon={Icon.Icomoon.menu3}
  >
    <div id="wow">BODY</div>
  </NewBurgerMenu>)

