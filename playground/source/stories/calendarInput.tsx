import { storiesOf } from "../story-host";
import { CalendarInput, ICalendarInputProps, DateInput, IDateInputProps } from '../_symlink';
import * as React from 'react'

storiesOf("CalendarInput", CalendarInput)
  .add("Simple", () => {
    return <CalendarInputTest />
  })
  .add("Always Show", () => {
    return <CalendarInputTest alwaysShowCalendar />
  })

const CalendarInputTest: React.FC<ICalendarInputProps> = p => {
  const [dates, setDates] = React.useState<string[]>([])
  const onDateChanged = React.useCallback((date: string) => {
    setDates([...dates, date])
  }, [dates])
  return (
    <>
      {/* <input type="text" /> */}
      <CalendarInput {...p} onDateChanged={onDateChanged} />
      <ul>
        {dates.map((d, i) => <li key={i}>{d}</li>)}
      </ul>
    </>
  )
}

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


const DateInputTest: React.FC<IDateInputProps> = p => {
  const [dates, setDates] = React.useState<string[]>([])
  const onDateChanged = React.useCallback((date: string) => {
    setDates([...dates, date])
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