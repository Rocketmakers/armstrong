import React from "react";

import { configure, addDecorator } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import { centered } from "@storybook/addon-centered/react";

addDecorator(withInfo({ inline: false }));
addDecorator(Story => <Story />);

const req = require.context("../src/stories", true, /\.stories\.ts(x)?$/);

function loadStories() {
  req
    .keys()
    .sort()
    .forEach(filename => req(filename));
}

configure(loadStories, module);
