import { storiesOf } from "../story-host";
import { TimeInput, ITimeInputProps } from '../_symlink';
import * as React from 'react'

storiesOf("TimeInput", TimeInput)
  .add("Basic", () => {
    return <TimeInputTest />
  })
  .add("Minute Step 5", () => {
    return <TimeInputTest minuteStep={5} />
  })
  .add("Minute Step 15", () => {
    return <TimeInputTest minuteStep={15} />
  })
  .add("Minute Step 30", () => {
    return <TimeInputTest minuteStep={30} />
  })
  .add("Set Time", () => {
    const [time, setTime] = React.useState("")
    return (
      <>
        <button onClick={() => setTime("11:25")}>11:25</button>
        <button onClick={() => setTime("17:05")}>17:05</button>
        <button onClick={() => setTime("")}>Empty</button>
        <TimeInputTest time={time} onChange={setTime} />
      </>
    )
  })


const TimeInputTest: React.FC<ITimeInputProps> = p => {
  const [times, setTimes] = React.useState<string[]>([])
  const onTimeChanged = React.useCallback((time: string) => {
    setTimes([...times, time])
    p.onChange && p.onChange(time)
  }, [times])
  return (
    <>
      {/* <input type="text" /> */}
      <TimeInput {...p} onChange={onTimeChanged} />
      <ul>
        {times.map((d, i) => <li key={i}>{d}</li>)}
      </ul>
    </>
  )
}