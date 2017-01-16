import * as React from "react";
import * as moment from "moment";
import * as classNames from "classnames";
import * as _ from "underscore";
import {Form} from "../form";
import { Grid, Row, Col } from "../../layout/grid";
import { DateHelpers } from '../../../utilities/dateHelpers';
import {buildOptions} from "./options";
import {Formatting} from "../../../utilities/formatting";

export type DateParts = "day" | "month" | "year"

export interface IDateInputProps extends React.Props<DateInput> {
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
  /** Control date part order (`day`, `month`, `year`)*/
  datePartOrder?: DateParts[];
}

export interface IDateInputState {
  day?: number;
  month?: number;
  year?: number;
  date?: string;
}

export class DateInput extends React.Component<IDateInputProps, IDateInputState> {
  static defaultProps = {
    yearLabel:"Year",
    monthLabel:"Month",
    dayLabel:"Day",
    datePartOrder:["day", "month", "year"]
  }

  private cId = `di_${Math.random()}`;
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

  private validateProps(props: IDateInputProps){
    if (props.datePartOrder.indexOf("month") === -1) {
      console.error("A DateInput must include `month` in the datePartOrder")
    }
  }

  componentWillReceiveProps(newProps: IDateInputProps){
    this.validateProps(newProps)
    if (newProps.date !== this.props.date){
      if (newProps.date) {
        this.setState(DateHelpers.getDateParts(newProps.date, true))
      } else{
        this.setState({ day: null, month: null, year: null, date: null })
      }
    }
  }

  private handleDataChanged = (d: IDateInputState) => {
    const date = DateHelpers.toDateFormat(d)
    const day = this.props.datePartOrder.indexOf("day") === -1 ? {day:1} : undefined
    const year = this.props.datePartOrder.indexOf("year") === -1 ? {year:2000} : undefined
    this.setState(_.extend({}, d, {date}, day, year), () => {
      if (this.props.onChange && date) {
        this.props.onChange(date);
      }
    })
  }

  render() {
    const options = {
      "day": buildOptions(this.props.dayLabel, this.getDaysArrayByMonth(), v => v, v => Formatting.twoDigitNumber(parseInt(v))),
      "month": buildOptions(this.props.monthLabel, DateHelpers.getMonthValues(), v => v.value, v => v.label),
      "year": buildOptions(this.props.yearLabel, DateHelpers.getYearValues(this.props.futureDates, this.props.yearsFromNow), v => v, v => v.toString())
    }
    return (
      <Form
        className={classNames("date-input", this.props.className, this.props.disabled? "input-disabled" : null)}
        onDataChanged={this.handleDataChanged}
        dataBinder={Form.jsonDataBinder(this.state)}>
       <Grid>
          <Row>
            {this.props.datePartOrder.map((key, idx) => {
              return (
                <Col key={idx}>
                  <select tabIndex={this.props.tabIndex} {...Form.Bind.selectNumeric(key)} disabled={this.props.disabled}>
                    {options[key]}
                  </select>
                </Col>
              )
            })}
          </Row>
        </Grid>
      </Form>
    )
  }
}
