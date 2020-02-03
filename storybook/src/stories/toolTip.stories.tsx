import * as React from "react";

import { storiesOf } from "@storybook/react";
import { ITooltipPositions, Tooltip, ITooltipCustomPositions } from "../_symlink";

import "../theme/theme.scss";

const positionPriorities: ITooltipPositions[] = [["left", "top"], ["top", "bottom", "right"], ["top", "hidden"], "fixed"];

const customPositionPriorities: ITooltipCustomPositions[] = ["top", ["farBelow", "bottomRight"], ["farBelow", "bottom", "hidden"]];

const tooltipInnerProps: Pick<React.HTMLProps<HTMLElement>, "style"> = {
  style: {
    padding: "10px",
    borderRadius: "2px",
    boxShadow: "1px 1px 10px rgba(0,0,0,0.05)",
    margin: "10px 0",
    border: "1px solid gray ",
    fontWeight: 600
  }
};

storiesOf("Tooltip", module)
  .add("Default", () => (
    <>
      <p>Tooltip components will attempt to cause a tooltip to appear on hover on the specified side, defaulting to right, falling back on other directions if there's no space for it.</p>
      <br />
      <pre>{'<Tooltip tooltip="It is me. The tooltip.">'}</pre>
      <br />
      <Tooltip tooltip="It is me. The tooltip.">
        <div {...tooltipInnerProps}>Hover here</div>
      </Tooltip>
    </>
  ))
  .add("Retain", () => (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .bridge {
            background: lime;
            opacity: 0.5;
          }
        `
        }}
      />
      <p>Tooltip will still be displayed when hovering over the tooltip. If there is a gap between tooltipChildren & tooltip, this gap will be bridged (coloured green for this example), but only if tooltipChildren & tooltip overlap on 1 axis.</p>
      <br />
      <pre>{'<Tooltip tooltip="It is me. The tooltip." retain>'}</pre>
      <br />
      <Tooltip tooltip="It is me. The tooltip." retain>
        <div {...tooltipInnerProps}>Hover here</div>
      </Tooltip>
    </>
  ))
  .add("Disable", () => (
    <>
      <p>Tooltip will not be displayed.</p>
      <br />
      <pre>{'<Tooltip tooltip="It is me. The tooltip. I am forever hidden." disable>'}</pre>
      <br />
      <Tooltip tooltip="It is me. The tooltip. I am forever hidden." disable>
        <div {...tooltipInnerProps}>Hover here</div>
      </Tooltip>
    </>
  ))
  .add("Position priority", () => (
    <>
      <p>Different position priority order can be set. Unused positions will be used in default order, if specified positions are not fully within viewport.</p>
      <br />
      <pre>{'<Tooltip tooltip="It is me. The tooltip." position={["right", "left", "bottom", "top", "fixed", "hidden"]} >'}</pre>
      <br />
      {positionPriorities.map((positionPriority, i) => (
        <Tooltip tooltip="It is me. The tooltip." position={positionPriority} key={"tooltip" + i}>
          <div {...tooltipInnerProps}>{typeof positionPriority === "string" ? `"${positionPriority}"` : `[${positionPriority.map(position => `"${position}"`).join(", ")}]`}</div>
        </Tooltip>
      ))}
      <Tooltip tooltip="It is me. The tooltip." position={["right", "left", "bottom", "top", "fixed", "hidden"]}>
        <div {...tooltipInnerProps}>All preset positions in default order: ["right", "left", "bottom", "top", "fixed", "hidden"]</div>
      </Tooltip>
      <br />
      <br />
      Preset positons can be overwritten with css:
      <br />
      <br />
      <pre>.tooltip[data-position=left]</pre>
    </>
  ))
  .add("Display: none", () => (
    <>
      <p>Tooltip will be hidden wih display: none, rather than opacity: 0.</p>
      <br />
      <pre>{'<Tooltip tooltip="It is me. The tooltip." displayNone>'}</pre>
      <br />
      <Tooltip tooltip="It is me. The tooltip." displayNone>
        <div {...tooltipInnerProps}>Hover here</div>
      </Tooltip>
    </>
  ))
  .add("Custom position priority", () => (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .tooltip-example-1.tooltip[data-position=farBelow] {
              top: 1000%;
              left: 0;
            }

            .tooltip-example-1.tooltip[data-position=bottomRight] {
              top: 100%;
              left: 100%;
            }
          `
        }}
      />
      <p>Define position priority order using your own custom positions. Final position can be used even if not fully within viewport.</p>
      <br />
      <pre>{'<Tooltip tooltip="It is me. The tooltip." customPosition={["farBelow", "bottom", "hidden"]} >'}</pre>
      <br />
      {customPositionPriorities.map((customPositionPriority, i) => (
        <Tooltip tooltip="It is me. The tooltip." customPosition={customPositionPriority} tooltipAttributes={{ className: "tooltip-example-1" }} key={"customPositionTooltip" + i}>
          <div {...tooltipInnerProps}>{typeof customPositionPriority === "string" ? `"${customPositionPriority}"` : `[${customPositionPriority.map(position => `"${position}"`).join(", ")}]`}</div>
        </Tooltip>
      ))}
      <br />
      <br />
      Custom positons can be created with css:
      <br />
      <br />
      <pre>.tooltip[data-position=farBelow]</pre>
      <br />
      <pre>.tooltip[data-position=bottomRight]</pre>
    </>
  ))
  .add("Centre", () => (
    <>
      <p>Centres the tooltip positions in relation to tooltipChildren.</p>
      <br />
      <pre>{'<Tooltip tooltip="It is me. The tooltip." center={false}>'}</pre>
      <br />
      <Tooltip tooltip="It is me. The tooltip.">
        <div {...tooltipInnerProps}>Centred (default)</div>
      </Tooltip>
      <Tooltip tooltip="It is me. The tooltip." center={false}>
        <div {...tooltipInnerProps}>Uncentred</div>
      </Tooltip>
    </>
  ))
  .add("Arrow", () => (
    <>
      <p>Adds tooltip arrow pointing at tooltipChildren.</p>
      <br />
      <pre>{'<Tooltip tooltip="It is me. The tooltip." withArrow={false}>'}</pre>
      <br />
      <Tooltip tooltip="It is me. The tooltip.">
        <div {...tooltipInnerProps}>With arrow (default)</div>
      </Tooltip>
      <Tooltip tooltip="It is me. The tooltip." withArrow={false}>
        <div {...tooltipInnerProps}>Without arrow</div>
      </Tooltip>
    </>
  ));
