import { storiesOf } from "../story-host";
import { BurgerMenu, BurgerMenuItem } from '../_symlink';
import * as React from 'react'

storiesOf("BurgerMenu", BurgerMenu)
  .add("Basic", () => {
    return (
      <BurgerMenu closeOnNavigate>
        <BurgerMenuItem title="One">
          <h3>One</h3>
        </BurgerMenuItem>
        <BurgerMenuItem title="Two">
          <h3>Two</h3>
        </BurgerMenuItem>
        <BurgerMenuItem title="Three">
          <h3>Three</h3>
        </BurgerMenuItem>
        <BurgerMenuItem title="Four">
          <h3>Four</h3>
        </BurgerMenuItem>
      </BurgerMenu>
    )
  })
