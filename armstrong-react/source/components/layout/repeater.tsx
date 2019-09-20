import * as React from "react";
import { utils } from "../../utilities/utils";

export function Repeater(props: { count: number, render: React.FC<{ index: number }> }) {
  const { count, render: Render } = props
  return (
    <>
      {utils.array.range(1, count + 1).map(index => <Render key={index} index={index} />)}
    </>
  )
}
