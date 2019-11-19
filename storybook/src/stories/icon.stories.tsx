import * as React from "react";

import { storiesOf } from "@storybook/react";
import { Icon } from "../_symlink";

import "../theme/theme.scss";
import {
  getIconProps,
  IcomoonIcon,
  LinearIcon
} from "../_symlink/components/display/icon";

const style: Pick<React.HTMLAttributes<HTMLElement>, "style"> = {
  style: { margin: "20px", fontSize: "30px" }
};

storiesOf("Icon", module)
  .addParameters({
    options: {
      showAddonPanel: true
    }
  })
  .add("Icomoon", () => (
    <>
      <pre>{`<Icon iconSet="Icomoon" icon={Icon.Icomoon.<ICONNAME>} />`}</pre>
      <br />
      <pre>{`<Icon {...getIconProps("Icomoon">, <ICONNAME>)} />`}</pre>
      <br />
      <pre>{`<IcomoonIcon iconName=<ICONNAME> />`}</pre>
      <br />
      <Icon {...style} {...getIconProps("Icomoon", "rocket")} />
      <Icon {...style} {...getIconProps("Icomoon", "leaf")} />
      <Icon {...style} {...getIconProps("Icomoon", "upload2")} />
      <Icon {...style} {...getIconProps("Icomoon", "package")} />
      <Icon {...style} {...getIconProps("Icomoon", "fileVideo")} />
      <br />
      <br />
      <p>
        Requires the IcoMoon-Ultimate.ttf pack available
        <a href="https://icomoon.io/#icons"> here</a>.
        <br />
        <br />
        Must be defined in your project as a css @font-face called
        IcoMoon-Ultimate (cannot be done in Armstrong for licencing reasons)
      </p>
    </>
  ))
  .add("Linear Icon", () => (
    <>
      <pre>{`<Icon iconSet="LinearIcons" icon={Icon.LinearIcons.<ICONNAME>} />`}</pre>
      <br />
      <pre>{`<Icon {...getIconProps("LinearIcons">, <ICONNAME>)} />`}</pre>
      <br />
      <pre>{`<LinearIcon iconName=<ICONNAME> />`}</pre>
      <br />
      <Icon {...style} {...getIconProps("LinearIcons", "sad")} />
      <Icon {...style} {...getIconProps("LinearIcons", "satellite2")} />
      <Icon {...style} {...getIconProps("LinearIcons", "scissors")} />
      <Icon {...style} {...getIconProps("LinearIcons", "userLock")} />
      <Icon {...style} {...getIconProps("LinearIcons", "vault")} />
      <br />
      <br />
      <p>
        Requires the Linearicons.ttf pack available
        <a href="https://icomoon.io/#icons"> here</a>.
        <br />
        <br />
        Must be defined in your project as a css @font-face called
        IcoMoon-Ultimate (cannot be done in Armstrong for licencing reasons)
      </p>
    </>
  ))
  .add("Icon Components", () => (
    <>
      <p>There are multiple ways of writing icon components</p>
      <br />
      <p>
        This helper function generates these props in a more type safe way, with
        options for ICONNAME inferred from ICONSET
      </p>
      <p>ICONSET defaults to 'Icomoon'</p>
      <pre>{"<Icon icon={Icon.<ICONSET>.<ICONNAME>} iconSet=<ICONSET> />"}</pre>
      <br />
      <br />
      <br />
      <br />
      <p>
        This helper function generates these props in a more type safe way, with
        options for ICONNAME inferred from ICONSET
      </p>
      <p>This way also means you don't have to write INCONTYPE twice</p>
      <pre>{"<Icon {...getIconProps(<ICONSET>, <ICONNAME>)} />"}</pre>
      <br />
      <br />
      <br />
      <br />
      <p>There are also more specific components available</p>
      <pre>{"<IcomoonIcon iconName=<ICONNAME> />"}</pre>
      <br />
      <pre>{"<LinearIcon iconName=<ICONNAME> />"}</pre>
      <br />
      <br />
      <IcomoonIcon {...style} iconName="download10" />
      <IcomoonIcon {...style} iconName="chessKnight" />
      <IcomoonIcon {...style} iconName="menu" />
      <LinearIcon {...style} iconName="mic" />
      <LinearIcon {...style} iconName="moon" />
      <LinearIcon {...style} iconName="mustacheGlasses" />
    </>
  ));
