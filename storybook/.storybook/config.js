import { configure, addDecorator, addParameters } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withA11y } from '@storybook/addon-a11y';
import { themes } from '@storybook/theming';
import { Wrapper } from "../src/components/wrapper"

import React from "react"
import armstrongTheme from './armstrongTheme';

addDecorator(withInfo({ inline: true, source: false }));
addDecorator((Story) => <Wrapper><Story /></Wrapper>)

addDecorator(withA11y)

addParameters({
  options: {
    theme: armstrongTheme,
    panelPosition: 'right',
    sortStoriesByKind: true
  }
});

const req = require.context("../src/stories", true, /\.stories\.ts(x)?$/);

function loadStories() {
  require('./welcome')
  req
    .keys()
    .sort()
    .forEach(filename => req(filename));
}


configure(loadStories, module);