import * as React from "react";
import * as moment from "moment";
import * as classNames from "classnames";
import * as _ from "underscore";
import { IDataBinder } from "../../form/formCore";
import { FormBinderBase } from "../../form/formBinders";
import { Grid, Row, Col } from "./../../layout/grid";
import { Form } from "../form";
import { DateHelpers } from './../../../utilities/dateHelpers';
import { Binder, IFormBinding } from "./../binder"

export interface IDateInputProps extends React.HTMLProps<DateInput> {
  /** ((string) => void) Event which returns the date when it changes and is valid */
  yearsFromNow?: number;
  /** (boolean) Should the picker let you choose years from the future rather than the past */
  futureDates?: boolean;
}

export interface IDateInputState {
  day?: number;
  month?: number;
  year?: number;
  date?: string;
}

export class DateInput extends React.Component<IDateInputProps & IFormBinding, IDateInputState> {
  private cId = `di_${Math.random()}`;
  constructor() {
    super();
    this.state = { day: null, month: null, year: null, date: null };
  }
  getDaysArrayByMonth(): string[] {
    return DateHelpers.getDaysArrayByMonth(this.state.date, this.state.month)
  }
  dayChanged(day: string) {
    this.setState({ day: parseInt(day) }, () => {
      this.buildDate();
    });
  }
  monthChanged(month: string) {
    this.setState({ month: parseInt(month) }, () => {
      this.buildDate();
    });
  }
  yearChanged(year: string) {
    this.setState({ year: parseInt(year) }, () => {
      this.buildDate();
    });
  }
  componentWillMount() {
    let d = this.props.data[this.props.prop];
    if (d) {
      this.setState(DateHelpers.getDateParts(d));
    }
  }
  componentWillReceiveProps(newProps: IDateInputProps & IFormBinding){
    let d = newProps.data[this.props.prop];
    if(d){
      if (!this.state.date){
        this.setState(DateHelpers.getDateParts(d, true))
      }else{
        if (!DateHelpers.areSame(this.state.date, d)){
          this.setState(DateHelpers.getDateParts(d, true))
        }
      }
    }else{
        this.setState({ day: null, month: null, year: null, date: null })
    }
  }
  change() {
    Binder.handleChange(this.props.prop, this.state.date, "string", this.props.data);
    this.props.context.forceUpdate();
  }

  buildDate() {
    let d = this.createDate();
    this.setState({ date: d }, () => {
      if (d){
        this.change();
      }
    })
  }
  createDate(): string {
    return DateHelpers.toDateFormat(this.state);
  }
  render() {
    let dayOptions = [<option key={`${this.cId}_day_blank`} value="" disabled={true}>Day</option>];
    this.getDaysArrayByMonth().forEach(d => {
      dayOptions.push(<option key={`${this.cId}_day_${d}`} value={d}>{parseInt(d) < 10 ? `0${d}` : d.toString() }</option>);
    })

    let monthOptions = [<option key={`${this.cId}_month_blank`} value="" disabled={true}>Month</option>];
    monthOptions.push(...DateHelpers.getMonthValues().map((v, i) =>
    <option key={`${this.cId}_month_${i}`} value={v.value}>{v.label}</option>))

    let yearOptions = [<option key={`${this.cId}_year_blank`}  value="" disabled={true}>Year</option>];
    yearOptions.push(...DateHelpers.getYearValues(this.props.futureDates, this.props.yearsFromNow).map(year =>
    <option key={`${this.cId}_year_${year}`} value={year.toString() }>{year}</option>))
    return <Grid className={classNames("date-input", this.props.className)}>
      <Row>
        <Col>
          <select disabled={this.props.disabled} onChange={(e) => this.dayChanged((e.target as HTMLOptionElement).value) } value={this.state.day ? this.state.day.toString() : ""}>
            {dayOptions}
          </select>
        </Col>
        <Col>
          <select disabled={this.props.disabled} onChange={(e) => this.monthChanged((e.target as HTMLOptionElement).value) } value={this.state.month ? this.state.month.toString() : ""}>
            {monthOptions}
          </select>
        </Col>
        <Col>
          <select disabled={this.props.disabled} onChange={(e) => this.yearChanged((e.target as HTMLOptionElement).value) } value={this.state.year ? this.state.year.toString() : ""}>
            {yearOptions}
          </select>
        </Col>
      </Row>
    </Grid>
  }
}