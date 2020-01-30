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
  .add("Retain", () => (
    <>
      <p>Tooltip components will attempt to cause a tooltip to appear on hover on the specified side, defaulting to right, falling back on other directions if there's no space for it.</p>
      <br />
      <pre>{'<Tooltip tooltip="It is me. The tooltip." retain={true}>'}</pre>
      <br />
      <Tooltip tooltip="It is me. The tooltip." retain={true}>
        <div {...tooltipInnerProps}>Hover here</div>
      </Tooltip>
    </>
  ))
  .add("Manually set aria-label", () => (
    <Tooltip tooltip="It is me. The tooltip.">
      <div {...tooltipInnerProps}>Hover here</div>
    </Tooltip>
  ))
  .add("Disable", () => (
    <Tooltip tooltip="It is me. The tooltip.  I am forever hidden." disable={true}>
      <span>Hover here</span>
    </Tooltip>
  ))
  .add("Position priority", () => (
    <>
      <p>Different positions can be set</p>
      <pre>{'<Tooltip tooltip="It is me. The tooltip." retain={true} position={["right", "left", "bottom", "top", "fixed", "hidden"]} >'}</pre>
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
      NB: Unset preset positions will be used if no specified position works.
      <br />
      <br />
      Preset positons can be overwritten with css:
      <br />
      <br />
      <pre>.tooltip[data-position=left]</pre>
    </>
  ))
  .add("Display: none", () => (
    <Tooltip tooltip="It is me. The tooltip." displayNone>
      <span>Hover here</span>
    </Tooltip>
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
      {customPositionPriorities.map((customPositionPriority, i) => (
        <Tooltip tooltip="It is me. The tooltip." customPosition={customPositionPriority} tooltipAttributes={{ className: "tooltip-example-1" }} key={"customPositionTooltip" + i}>
          <div {...tooltipInnerProps}>{typeof customPositionPriority === "string" ? `"${customPositionPriority}"` : `[${customPositionPriority.map(position => `"${position}"`).join(", ")}]`}</div>
        </Tooltip>
      ))}
      <br />
      <br />
      NB: Final position can be used even if not fully within viewport.
      <br />
      <br />
      Custom positons can be created with css:
      <br />
      <br />
      <pre>.tooltip[data-position=farBelow]</pre>
      <br />
      <pre>.tooltip[data-position=bottomRight]</pre>
    </>
  ));
