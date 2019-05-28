import * as React from "react";
import { useDidUpdateEffect } from "../../../hooks/useDidUpdateEffect";
import { calendarUtils } from "../../../utilities/calendarUtils";
import { ClassHelpers } from "../../../utilities/classHelpers";
import { Formatting } from "../../../utilities/formatting";
import { Col, Grid, Row } from "../../layout/grid";
import { DataValidationMessage, DataValidationMode } from "../formCore";
import { useForm } from "../formHooks";
import { ValidationLabel } from "../validationWrapper";
import { buildOptions } from "./options";

export type DateParts = "day" | "month" | "year"

export interface IDateInputProps extends React.Props<typeof DateInput> {
  /** (string) CSS className property */
  className?: string;
  /** (number) The tab index of the first select */
  tabIndex?: number;
  /** (string) Date string in YYYY-MM-DD format */
  date?: string;
  /** (string) Min Date string in YYYY-MM-DD format */
  minDate?: string;
  /** (string) Max Date string in YYYY-MM-DD format */
  maxDate?: string;
  /** ((string) => void) Event which returns the date when it changes and is valid */
  onChange?: (date: string) => void;
  /** (number) How many years from the current year to display in the year dropdown */
  yearsFromNow?: number;
  /** (boolean) Should the picker disallow user interaction */
  disabled?: boolean;
  /** (string) The year label - default to `Year` */
  yearLabel?: string;
  /** (string) The month label - default to `Month` */
  monthLabel?: string;
  /** (string) The day label - default to `Day` */
  dayLabel?: string;
  /** Control date part order (`day`, `month`, `year`) */
  datePartOrder?: DateParts[];
}

export interface IDateInputState {
  day?: number;
  month?: number;
  year?: number;
  date?: string;
}

export const DateInput: React.FC<IDateInputProps> = props => {
  const { dayLabel, monthLabel, yearLabel, yearsFromNow, className, disabled, datePartOrder, tabIndex, date, minDate, maxDate, onChange } = props

  const [dateState, setDateState] = React.useState<IDateInputState>({ day: null, month: null, year: null, date: null })

  React.useEffect(() => {
    validateProps()
    if (date) {
      setDateState(calendarUtils.datePart.parse(date));
    }
  }, [])

  const validateProps = React.useCallback(() => {
    if (datePartOrder.indexOf("month") === -1) {
      // tslint:disable-next-line:no-console
      console.error("A DateInput must include `month` in the datePartOrder")
    }
  }, [datePartOrder])

  useDidUpdateEffect(() => {
    const newState = date ? calendarUtils.datePart.parse(date, { includeDate: true }) : { day: null, month: null, year: null, date: null }
    if (calendarUtils.datePart.equals(newState, dateState)) {
      return
    }
    setDateState(newState)
    onChange(newState.date)
  }, [date])

  const hasDayPart = React.useMemo(() => {
    return datePartOrder.indexOf("day") > -1
  }, [datePartOrder])

  const hasYearPart = React.useMemo(() => {
    return datePartOrder.indexOf("year") > -1
  }, [datePartOrder])

  const validationMessage = DataValidationMessage.get(props)
  const validationMode = DataValidationMode.get(props)

  const dayArray = React.useMemo(() => {
    return calendarUtils.day.getMonthYear(dateState.month, dateState.year, { minDate, maxDate })
  }, [dateState.month, dateState.year, minDate, maxDate]);

  const monthArray = React.useMemo(() => {
    return calendarUtils.month.getMonthsInYear(dateState.year, minDate, maxDate)
  }, [dateState.year, minDate, maxDate]);

  const yearArray = React.useMemo(() => {
    return calendarUtils.year.generate({ minDate, maxDate, range: yearsFromNow })
  }, [minDate, maxDate, yearsFromNow]);

  const handleDataChanged = React.useCallback((d: IDateInputState) => {
    const newState: IDateInputState = {}
    newState.year = !hasYearPart ? 2000 : d.year

    newState.day = !hasDayPart ? 1 : d.day
    if (d.day) {
      const days = calendarUtils.day.getMonthYear(d.month, d.year, { minDate, maxDate })
      if (days.indexOf(newState.day) === -1) {
        delete newState.day
      }
    }

    newState.month = d.month
    if (d.month) {
      const monthsInYear = calendarUtils.month.getMonthsInYear(d.year, minDate, maxDate)
      if (monthsInYear.map(a => a.number).indexOf(newState.month) === -1) {
        delete newState.month
      }
    }

    newState.date = calendarUtils.datePart.format(newState)
    setDateState(newState)
    if (onChange && newState.date) {
      onChange(newState.date);
    }

  }, [hasDayPart, hasYearPart, onChange, minDate, maxDate])

  const options = React.useMemo(() => {
    return {
      day: buildOptions(dayLabel, dayArray, v => v, v => Formatting.twoDigitNumber(v)),
      month: buildOptions(monthLabel, monthArray, v => v.number, v => v.name),
      year: buildOptions(yearLabel, yearArray, v => v, v => v.toString()),
    }
  }, [dayLabel, monthLabel, yearLabel, dayArray, monthArray, yearArray])

  const classes = React.useMemo(() => ClassHelpers.classNames(
    "armstrong-input",
    "date-input",
    className,
    {
      "show-validation": (validationMode !== "none" && validationMessage),
      "input-disabled": disabled,
    },
  ), [className, validationMessage, validationMode, disabled]);

  const { DataForm, bind } = useForm(dateState)

  return (
    <DataForm
      className={classes}
      title={validationMessage}
      onDataChanged={handleDataChanged}>
      <Grid>
        <Row>
          {datePartOrder.map((key, idx) => {
            return (
              <Col key={idx}>
                <select tabIndex={tabIndex} {...bind.selectNumeric(key)} disabled={disabled}>
                  {options[key]}
                </select>
              </Col>
            )
          })}
        </Row>
        <ValidationLabel message={validationMessage} mode={validationMode} wrapper={p => <Row height="auto"><Col {...p} /></Row>} />
      </Grid>
    </DataForm>
  )
}

DateInput.defaultProps = {
  yearLabel: "Year",
  monthLabel: "Month",
  dayLabel: "Day",
  datePartOrder: ["day", "month", "year"],
}
