import * as React from "react";

import { storiesOf } from "@storybook/react";

import "../theme/theme.scss";

import { SwitchInput } from "../_symlink";
import { getIconProps } from "../_symlink/components/display/icon";

const switchStyle: Pick<React.HTMLProps<HTMLDivElement>, "style"> = {
  style: { margin: "20px" }
};

storiesOf("Switch", module)
  .addParameters({
    options: {
      showAddonPanel: true
    }
  })
  .add("Simple Switch", () => (
    <div>
      <pre>{`<SwitchInput width={120} height={90} padding={10} hoverNudgeAmount={10} />`}</pre>
      <br />
      <SwitchInput {...switchStyle} />

      <SwitchInput
        {...switchStyle}
        width={120}
        height={90}
        padding={10}
        hoverNudgeAmount={10}
      />

      <SwitchInput
        {...switchStyle}
        width={400}
        height={60}
        padding={3}
        hoverNudgeAmount={10}
      />

      <SwitchInput
        {...switchStyle}
        width={80}
        height={50}
        padding={0}
        hoverNudgeAmount={0}
        inactiveColour="red"
        activeColour="green"
        hoveringColour="red"
      />

      <SwitchInput
        className="outlined-switch"
        {...switchStyle}
        width={80}
        height={50}
        padding={4}
        hoverNudgeAmount={0}
        inactiveColour="white"
        activeColour="white"
        inactiveNubbinColour="red"
        activeNubbinColour="green"
      />

      <SwitchInput
        {...switchStyle}
        width={50}
        height={10}
        padding={-10}
        activeColour="blue"
        borderedNubbin
        renderShadows={false}
      />

      <SwitchInput
        {...switchStyle}
        width={80}
        height={45}
        padding={4}
        iconSize={0.8}
        inactiveColour="white"
        activeColour="white"
        inactiveNubbinColour="red"
        activeNubbinColour="green"
      />

      <SwitchInput
        {...switchStyle}
        width={70}
        height={45}
        padding={-2}
        iconSize={0.8}
        inactiveColour="lightgray"
        activeColour="lightgray"
        inactiveNubbinColour="gray"
        activeNubbinColour="green"
        renderShadows={false}
      />

      <p>
        Sizes and colours can be defined in props, but if you're into seperation
        of concerns and would rather do it in scss, there's a couple mixins for
        handling them.
      </p>
      <br />
      <pre>
        @mixin resize-switch($switch-width, $switch-height, $switch-padding,
        $switch-hover-nudge-amount)
      </pre>
      <pre>
        @mixin recolour-switch($switch-inactive-colour, $switch-hover-colour,
        $switch-active-colour)
      </pre>
      <br />
      <br />
      <p>
        If you're only using css, the following vanilla css variables can be
        defined to style all switches
      </p>
      <pre>--armstrong-switch-height</pre>
      <pre>--armstrong-switch-width</pre>
      <pre>--armstrong-switch-padding</pre>
      <pre>--armstrong-switch-hover-nudge-amount</pre>
      <pre>--armstrong-switch-inactive-colour</pre>
      <pre>--armstrong-switch-hover-colour</pre>
      <pre>--armstrong-switch-active-colour</pre>
      <pre>--armstrong-switch-nubbin-inactive-colour</pre>
      <pre>--armstrong-switch-nubbin-hover-colour</pre>
      <pre>--armstrong-switch-nubbin-active-colour</pre>
    </div>
  ))
  .add("Switch with Icons", () => (
    <div>
      <p>Switches can work with icons in a few ways</p>
      <pre>iconStyle="on-nubbin"</pre>
      <SwitchInput
        {...switchStyle}
        width={80}
        height={50}
        padding={4}
        hoverNudgeAmount={5}
        iconSize={0.8}
        inactiveColour="red"
        activeColour="green"
        hoveringColour="red"
        activeIcon={getIconProps("Icomoon", "checkmark3")}
        inactiveIcon={getIconProps("Icomoon", "cross2")}
      />
      <SwitchInput
        {...switchStyle}
        width={45}
        height={30}
        padding={2}
        iconSize={0.9}
        inactiveColour="lightgray"
        activeColour="purple"
        hoveringColour="lightgray"
        activeIcon={getIconProps("Icomoon", "eye3")}
        inactiveIcon={getIconProps("Icomoon", "eyeBlocked3")}
      />
      <SwitchInput
        {...switchStyle}
        width={70}
        height={50}
        padding={1}
        iconSize={0.6}
        inactiveColour="lightgray"
        activeColour="red"
        hoveringColour="lightgray"
        activeIcon={getIconProps("Icomoon", "warning")}
      />
      <SwitchInput
        {...switchStyle}
        width={65}
        height={40}
        padding={1}
        iconSize={0.6}
        inactiveColour="gray"
        activeColour="blue"
        hoveringColour="gray"
        inactiveIcon={getIconProps("Icomoon", "micOff")}
        activeIcon={getIconProps("Icomoon", "mic")}
      />
      <SwitchInput
        {...switchStyle}
        width={75}
        height={20}
        padding={-20}
        iconSize={0.6}
        inactiveColour="gray"
        activeColour="blue"
        hoveringColour="gray"
        inactiveIcon={getIconProps("Icomoon", "glass2")}
        activeIcon={getIconProps("Icomoon", "glass")}
        borderedNubbin
      />
      <br />
      <pre>iconStyle="is-nubbin"</pre>
      <SwitchInput
        {...switchStyle}
        width={80}
        height={45}
        padding={4}
        iconSize={0.9}
        inactiveColour="red"
        activeColour="green"
        hoveringColour="red"
        activeIcon={getIconProps("Icomoon", "checkmark3")}
        inactiveIcon={getIconProps("Icomoon", "cross2")}
        iconStyle="is-nubbin"
      />
      <SwitchInput
        {...switchStyle}
        width={80}
        height={45}
        padding={4}
        iconSize={0.8}
        inactiveColour="purple"
        activeColour="gold"
        activeIcon={getIconProps("Icomoon", "sun")}
        inactiveIcon={getIconProps("Icomoon", "moon")}
        iconStyle="is-nubbin"
        renderShadows={false}
      />
      <SwitchInput
        {...switchStyle}
        width={80}
        height={45}
        padding={4}
        iconSize={0.8}
        inactiveColour="#dbdbdb"
        activeColour="#ebebeb"
        renderShadows={false}
        inactiveNubbinColour="red"
        activeNubbinColour="green"
        activeIcon={getIconProps("Icomoon", "thumbsUp3")}
        inactiveIcon={getIconProps("Icomoon", "thumbsDown3")}
        iconStyle="is-nubbin"
      />
      <pre>iconStyle="static"</pre>
      <SwitchInput
        {...switchStyle}
        width={85}
        height={45}
        padding={1}
        iconSize={0.6}
        inactiveColour="red"
        activeColour="green"
        hoveringColour="red"
        activeIcon={getIconProps("Icomoon", "checkmark3")}
        inactiveIcon={getIconProps("Icomoon", "cross2")}
        iconStyle="static"
      />
      <h3>custom icons</h3>
      <SwitchInput
        {...switchStyle}
        width={85}
        height={45}
        padding={1}
        iconSize={0.6}
        inactiveColour="red"
        activeColour="green"
        hoveringColour="red"
        activeIcon={<p>ON</p>}
        inactiveIcon={<p>OFF</p>}
        iconStyle="static"
      />
      <SwitchInput
        {...switchStyle}
        width={85}
        height={45}
        padding={1}
        iconSize={0.6}
        inactiveColour="gray"
        activeColour="red"
        hoveringColour="red"
        activeIcon={<p>👺</p>}
        inactiveIcon={<p>👽</p>}
        iconStyle="static"
      />
    </div>
  ));
