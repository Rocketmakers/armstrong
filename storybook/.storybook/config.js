import { configure, addDecorator, addParameters } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import { themes } from "@storybook/theming";
import { Wrapper } from "../src/components/wrapper";

import React from "react";

addDecorator(withInfo({ inline: true }));
addDecorator(Story => (
  <Wrapper>
    <Story />
  </Wrapper>
));

addParameters({
  options: {
    theme: themes.light,
  },
});

const req = require.context("../src/stories", true, /\.stories\.ts(x)?$/);

function loadStories() {
  req
    .keys()
    .sort()
    .forEach(filename => req(filename));
}

configure(loadStories, module);
