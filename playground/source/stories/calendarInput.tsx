import { storiesOf } from "../story-host";
import { CalendarInput, ICalendarInputProps, DateInput, IDateInputProps } from '../_symlink';
import * as React from 'react'

storiesOf("CalendarInput", CalendarInput)
  .add("Basic", () => {
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