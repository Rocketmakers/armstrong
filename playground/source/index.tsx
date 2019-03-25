import "./theme/theme.scss";

import * as ReactDom from "react-dom";
import * as React from "react";
import { StoryHost } from './story-host';
import "./stories"

ReactDom.render(<StoryHost />, document.getElementById("host"))