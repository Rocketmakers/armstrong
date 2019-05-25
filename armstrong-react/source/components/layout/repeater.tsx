import * as React from "react";
import { utils } from "../../utilities/utils";

export function Repeater(props: { count: number, render: React.FC<{ position: number }> }) {
  const { count, render: Render } = props
  return (
    <>
      {utils.array.range(1, count + 1).map(position => <Render key={position} position={position} />)}
    </>
  )
}
