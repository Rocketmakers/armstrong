import * as React from "react";
import * as _ from "underscore";
import { ClassHelpers } from "../../../utilities/classNames";
import { DateHelpers } from "../../../utilities/dateHelpers";
import { Formatting } from "../../../utilities/formatting";
import { Col, Grid, Row } from "../../layout/grid";
import { Form } from "../form";
import { generateUniqueId, IFormInputProps } from "../form";
import { DataValidationMessage } from "../formCore";
import { ValidationLabel } from "../validationWrapper";
import { buildOptions } from "./options";

export type DateParts = "day" | "month" | "year"

export interface IDateInputProps extends IFormInputProps<DateInput> {
  /** (string) CSS classname property */
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
  /** Autofocuses first input */
  autoFocus?: boolean;
}

export interface IDateInputState {
  day?: number;
  month?: number;
  year?: number;
  date?: string;
}

export class DateInput extends React.Component<IDateInputProps, IDateInputState> {
  static defaultProps: Partial<IDateInputProps> = {
    yearLabel: "Year",
    monthLabel: "Month",
    dayLabel: "Day",
    datePartOrder: ["day", "month", "year"],
    validationMode: "none",
  }

  private cId = generateUniqueId(u => `di_${u}`);
  constructor(props: IDateInputProps) {
    super(props);
    this.validateProps(props)
    this.state = { day: null, month: null, year: null, date: null };
  }
  getDaysArrayByMonth(): string[] {
    return DateHelpers.getDaysArrayByMonth(this.state.month, this.state.year)
  }

  componentWillMount() {
    if (this.props.date) {
      this.setState(DateHelpers.getDateParts(this.props.date));
    }
  }

  private validateProps(props: IDateInputProps) {
    if (props.datePartOrder.indexOf("month") === -1) {
      // tslint:disable-next-line:no-console
      console.error("A DateInput must include `month` in the datePartOrder")
    }
  }

  componentWillReceiveProps(newProps: IDateInputProps) {
    this.validateProps(newProps)
    if (newProps.date !== this.props.date) {
      if (newProps.date) {
        this.setState(DateHelpers.getDateParts(newProps.date, true))
      } else {
        this.setState({ day: null, month: null, year: null, date: null })
      }
    }
  }

  private handleDataChanged = (d: IDateInputState) => {
    const { datePartOrder, onChange } = this.props
    const date = DateHelpers.toDateFormat(d)
    const day = datePartOrder.indexOf("day") === -1 ? { day: 1 } : undefined
    const year = datePartOrder.indexOf("year") === -1 ? { year: 2000 } : undefined
    this.setState(_.extend({}, d, { date }, day, year), () => {
      if (onChange && date) {
        onChange(date);
      }
    })
  }

  render() {
    const validationMessage = DataValidationMessage.get(this.props)
    const { dayLabel, monthLabel, yearLabel, futureDates, yearsFromNow, startYearCap, className, validationMode, disabled, datePartOrder, tabIndex } = this.props
    const options = {
      day: buildOptions(dayLabel, this.getDaysArrayByMonth(), v => v, v => Formatting.twoDigitNumber(parseInt(v, 10))),
      month: buildOptions(monthLabel, DateHelpers.getMonthValues(), v => v.value, v => v.label),
      year: buildOptions(yearLabel, DateHelpers.getYearValues(futureDates, yearsFromNow, startYearCap), v => v, v => v.toString()),
    }
    const classes = ClassHelpers.classNames(
      "armstrong-input",
      "date-input",
      className,
      {
        "show-validation": (validationMode !== "none" && validationMessage),
        "input-disabled": disabled,
      },
    );
    return (
      <Form
        className={classes} title={validationMessage}
        onDataChanged={this.handleDataChanged}
        dataBinder={Form.jsonDataBinder(this.state)}>
        <Grid>
          <Row>
            {datePartOrder.map((key, idx) => {
              return (
                <Col key={idx}>
                  <select tabIndex={tabIndex} {...Form.Bind.selectNumeric(key)} disabled={disabled} autoFocus={this.props.autoFocus && idx === 0}>
                    {options[key]}
                  </select>
                </Col>
              )
            })}
          </Row>
          <ValidationLabel message={validationMessage} mode={validationMode} wrapper={p => <Row height="auto"><Col {...p} /></Row>} />
        </Grid>
      </Form>
    )
  }
}
