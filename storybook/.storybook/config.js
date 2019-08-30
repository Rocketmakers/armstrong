import { configure, addDecorator } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

addDecorator(withInfo({ inline: true }));

const req = require.context("../src/stories", true, /\.stories\.ts(x)?$/);

function loadStories() {
  req
    .keys()
    .sort()
    .forEach(filename => req(filename));
}


configure(loadStories, module);