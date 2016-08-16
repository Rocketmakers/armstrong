import * as React from "react";
import * as moment from "moment";
import { IDataBinder } from "../../form/formCore";
import { FormBinderBase } from "../../form/formBinders";
import { Grid, Row, Col } from "./../../layout/grid";
import { Form } from "../form";
import * as _ from "underscore";
import { DateHelpers } from './../../../utilities/dateHelpers';

export interface IDateInputProps extends React.Props<DateInput> {
  date?: string;
  onChange?: (date: string) => void;
  yearsFromNow?: number;
  futureDates?: boolean;
}

export interface IDateInputState {
  day?: number;
  month?: number;
  year?: number;
  date?: string;
}

export class DateInput extends React.Component<IDateInputProps, IDateInputState> {
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
    if (this.props.date) {
      this.setState(DateHelpers.getDateParts(this.props.date));
    }
  }
  componentWillReceiveProps(newProps: IDateInputProps){
    if(newProps.date){
      if (!this.state.date){
        this.setState(DateHelpers.getDateParts(newProps.date, true))
      }else{
        if (!DateHelpers.areSame(this.state.date, newProps.date)){
          this.setState(DateHelpers.getDateParts(newProps.date, true))
        }
      }
    }else{
        this.setState({ day: null, month: null, year: null, date: null })
    }
  }
  buildDate() {
    let d = this.createDate();
    this.setState({ date: d }, () => {
      if (this.props.onChange && d) {
        this.props.onChange(this.state.date);
      }
    })
  }
  createDate(): string {
    return DateHelpers.toDateFormat(this.state);
  }
  render() {
    let dayOptions = [<option value="" disabled={true}>Day</option>];
    this.getDaysArrayByMonth().forEach(d => {
      dayOptions.push(<option key={`${this.cId}_day_${d}`} value={d}>{parseInt(d) < 10 ? `0${d}` : d.toString() }</option>);
    })

    let monthOptions = [<option value="" disabled={true}>Month</option>];
    monthOptions.push(...DateHelpers.getMonthValues().map((v, i) => <option key={`${this.cId}_month_${i}`} value={v.value}>{v.label}</option>))

    let yearOptions = [<option value="" disabled={true}>Year</option>];
    yearOptions.push(...DateHelpers.getYearValues(this.props.futureDates, this.props.yearsFromNow).map(year => <option key={`${this.cId}_year_${year}`} value={year.toString() }>{year}</option>))
    return <Form dataBinder={Form.jsonDataBinder(this.props.date)} onDataChanged={(d) => this.props.onChange(d)}>
   <Grid>
      <Row>
        <Col>
          <select onChange={(e) => this.dayChanged((e.target as HTMLOptionElement).value) } value={this.state.day ? this.state.day.toString() : ""}>
            {dayOptions}
          </select>
        </Col>
        <Col>
          <select onChange={(e) => this.monthChanged((e.target as HTMLOptionElement).value) } value={this.state.month ? this.state.month.toString() : ""}>
            {monthOptions}
          </select>
        </Col>
        <Col>
          <select onChange={(e) => this.yearChanged((e.target as HTMLOptionElement).value) } value={this.state.year ? this.state.year.toString() : ""}>
            {yearOptions}
          </select>
        </Col>
      </Row>
    </Grid>
    </Form>
  }
}

export class DateInputFormBinder extends FormBinderBase<IDateInputProps, string, string>{
  static customValue(dataName: string){
    return new DateInputFormBinder(dataName, "date");
  }

  handleValueChanged(props: IDateInputProps, dataBinder:IDataBinder<any>, notifyChanged: () => void) {
    props.onChange = (e) => {
      this.onChanged(dataBinder, e, notifyChanged);
    };
  }
}