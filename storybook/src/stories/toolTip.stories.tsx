import * as React from "react"

import { storiesOf } from '@storybook/react';
import { ITooltipPositions, Tooltip, ITooltipCustomPositions } from "../_symlink";

import "../theme/theme.scss";

const positionPriorities: ITooltipPositions[] = [
  ["left", "top"],
  ["top", "bottom", "right"],
  ["top", "hidden"],
  "fixed"
]

const customPositionPriorities: ITooltipCustomPositions[] = [
  "top",
  ["farBelow", "bottomRight"],
  ["farBelow", "bottom", "hidden"]
]

storiesOf('Tooltip', module)
  .add('Retain', () =>
    <Tooltip tooltip="It is me. The tooltip." retain={true}>
      <span>Hover here</span>
    </Tooltip>
  )
  .add('Disable', () =>
    <Tooltip tooltip="It is me. The tooltip.  I am forever hidden." disable={true}>
      <span>Hover here</span>
    </Tooltip>
  )
  .add('Manually set aria-label', () =>
    <Tooltip tooltip="It is me. The tooltip." ariaLabel="The tooltip I am.">
      <span>Hover here</span>
    </Tooltip>
  )
  .add('Position priority', () => <>
    {positionPriorities.map((positionPrioritity, i) => 
      <Tooltip tooltip="It is me. The tooltip." position={positionPrioritity} key={"tooltip" + i}>
        <span>{
          typeof positionPrioritity ==="string" ?
            `"${positionPrioritity}"`
          :
            `[${positionPrioritity.map(position => `"${position}"`).join(", ")}]`
        }</span>
      </Tooltip>
      
    )}
    <Tooltip tooltip="It is me. The tooltip." position={["right", "left", "bottom", "top", "fixed", "hidden"]}>
      <span>All preset positions in default order: ["right", "left", "bottom", "top", "fixed", "hidden"]</span>
    </Tooltip>
    <br/><br/>
    NB: Unset preset positions will be used if no specified position works.
    <br/><br/>
    Preset positons can be overwritten with css:<br/>
    e.g. .tooltip[data-position=left]
  </>)
  .add('Custom position priority', () => <>
    <style dangerouslySetInnerHTML={{ __html: `
      .tooltip-example-1.tooltip[data-position=farBelow] {
        top: 1000%;
        left: 0;
      }
      
      .tooltip-example-1.tooltip[data-position=bottomRight] {
        top: 100%;
        left: 100%;
      }
    `}} />
    {customPositionPriorities.map((customPositionPriority, i) => 
      <Tooltip tooltip="It is me. The tooltip." customPosition={customPositionPriority} tooltipClass="tooltip-example-1" key={"customPositionTooltip" + i}>
        <span>{
          typeof customPositionPriority ==="string" ?
            `"${customPositionPriority}"`
          :
            `[${customPositionPriority.map(position => `"${position}"`).join(", ")}]`
        }</span>
      </Tooltip>
    )}
    <br/><br/>
    NB: Final position can be used even if not fully within viewport.
    <br/><br/>
    Custom positons can be created with css:<br/>
    .tooltip[data-position=farBelow]<br/>
    .tooltip[data-position=bottomRight]
  </>)
