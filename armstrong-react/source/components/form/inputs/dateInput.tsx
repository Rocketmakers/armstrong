import * as React from "react";
import * as _ from "underscore";
import { ClassHelpers } from "../../../utilities/classHelpers";
import { DateHelpers } from "../../../utilities/dateHelpers";
import { Formatting } from "../../../utilities/formatting";
import { useDidUpdateEffect } from "../../../utilities/hooks";
import { Col, Grid, Row } from "../../layout/grid";
import { IFormInputProps } from "../form";
import { DataValidationMessage } from "../formCore";
import { useForm } from "../formHooks";
import { ValidationLabel } from "../validationWrapper";
import { buildOptions } from "./options";

export type DateParts = "day" | "month" | "year"

export interface IDateInputProps extends IFormInputProps<typeof DateInput> {
  /** (string) CSS className property */
  className?: string;
  /** (number) The tab index of the first select */
  tabIndex?: number;
  /** (string) Date string in YYYY-MM-DD format */
  date?: string;
  /** ((string) => void) Event which returns the date when it changes and is valid */
  onChange?: (date: string) => void;
  /** (number) How many years from the current year to display in the year dropdown */
  yearsFromNow?: number;
  /** (number) How many years to skip in the dropdown (useful for age and date limiting) */
  startYearCap?: number;
  /** (boolean) Should the picker let you choose years from the future rather than the past */
  futureDates?: boolean;
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
  const { dayLabel, monthLabel, yearLabel, futureDates, yearsFromNow, startYearCap, className, validationMode, disabled, datePartOrder, tabIndex, date, onChange } = props

  const [dateState, setDateState] = React.useState<IDateInputState>({ day: null, month: null, year: null, date: null })
  const daysArrayByMonth = React.useMemo(() => {
    return DateHelpers.getDaysArrayByMonth(dateState.month, dateState.year)
  }, [dateState.month, dateState.year]);

  React.useEffect(() => {
    validateProps()
    if (date) {
      setDateState(DateHelpers.getDateParts(date));
    }
  }, [])

  const validateProps = React.useCallback(() => {
    if (datePartOrder.indexOf("month") === -1) {
      // tslint:disable-next-line:no-console
      console.error("A DateInput must include `month` in the datePartOrder")
    }
  }, [datePartOrder])

  useDidUpdateEffect(() => {
    validateProps()
    if (date) {
      setDateState(DateHelpers.getDateParts(date, true))
    } else {
      setDateState({ day: null, month: null, year: null, date: null })
    }
  }, [date])

  const handleDataChanged = React.useCallback((d: IDateInputState) => {
    const newDate = DateHelpers.toDateFormat(d)
    const day = datePartOrder.indexOf("day") === -1 ? 1 : null
    const year = datePartOrder.indexOf("year") === -1 ? 2000 : null
    setDateState({ ...d, date: newDate, day, year })
    if (onChange && newDate) {
      onChange(newDate);
    }

  }, [datePartOrder, onChange])

  const validationMessage = DataValidationMessage.get(props)

  const options = React.useMemo(() => {
    return {
      day: buildOptions(dayLabel, daysArrayByMonth, v => v, v => Formatting.twoDigitNumber(parseInt(v, 10))),
      month: buildOptions(monthLabel, DateHelpers.getMonthValues(), v => v.value, v => v.label),
      year: buildOptions(yearLabel, DateHelpers.getYearValues(futureDates, yearsFromNow, startYearCap), v => v, v => v.toString()),
    }
  }, [dayLabel, monthLabel, yearLabel, daysArrayByMonth, futureDates, yearsFromNow, startYearCap])

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
  validationMode: "none",
}
