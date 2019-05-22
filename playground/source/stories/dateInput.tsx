import { storiesOf } from "../story-host";
import { DateInput, IDateInputProps } from '../_symlink';
import * as React from 'react'

storiesOf("DateInput", DateInput)
  .add("Within Month", () => {
    return <DateInputTest minDate="2019-11-07" maxDate="2019-11-14" />
  })
  .add("Within Year", () => {
    return <DateInputTest minDate="2019-11-07" maxDate="2020-11-07" />
  })
  .add("Any", () => {
    return <DateInputTest />
  })
  .add("Set Date", () => {
    const [date, setDate] = React.useState("")
    return (
      <>
        <button onClick={() => setDate("2019-07-02")}>2019-07-02</button>
        <button onClick={() => setDate("2020-08-30")}>2020-08-30</button>
        <button onClick={() => setDate("")}>Empty</button>
        <DateInputTest date={date} onChange={setDate} />
      </>
    )
  })

const DateInputTest: React.FC<IDateInputProps> = p => {
  const [dates, setDates] = React.useState<string[]>([])
  const onDateChanged = React.useCallback((date: string) => {
    setDates([...dates, date])
    p.onChange && p.onChange(date)
  }, [dates])
  return (
    <>
      {/* <input type="text" /> */}
      <DateInput {...p} onChange={onDateChanged} />
      <ul>
        {dates.map((d, i) => <li key={i}>{d}</li>)}
      </ul>
    </>
  )
}