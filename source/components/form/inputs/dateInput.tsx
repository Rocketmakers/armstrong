import * as React from "react";
import * as moment from "moment";
import { IDataBinder } from "../../form/formCore";
import { FormBinderBase } from "../../form/formBinders";
import { Grid, Row, Col } from "./../../layout/grid";
import { Form } from "../form";

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
    let activeMoment = this.state.date ? moment(this.state.date, "YYYY-MM-DD") : moment();
    if (this.state.month) {
      activeMoment.set("month", this.state.month - 1)
    }
    let daysInMonth = activeMoment.daysInMonth();
    let arrDays = [];

    for (var d = 1; d < daysInMonth + 1; d++) {
      arrDays.push(d.toString());
    }
    return arrDays;
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
      let d = moment(this.props.date);
      this.setState({ day: d.day(), month: d.month(), year: d.year() });
    }
  }
  componentWillReceiveProps(newProps: IDateInputProps){
    if(newProps.date){
      if (!this.state.date){
        let d = moment(newProps.date);
        this.setState({ day: d.day(), month: d.month(), year: d.year(), date: newProps.date })
      }else{
        let d = moment(this.state.date);
        let d2 = moment(newProps.date);
        if (!d.isSame(d2)){
          this.setState({ day: d2.day(), month: d2.month(), year: d2.year(), date: newProps.date })
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
    let s = this.state;
    let d;
    if (s.day && s.month && s.year) {
      d = moment().set("day", s.day).set("month", s.month-1).set("year", s.year).format("YYYY-MM-DD");
    }
    return d;
  }
  render() {
    let dayOptions = [<option value="" disabled={true}>Day</option>];
    this.getDaysArrayByMonth().forEach(d => {
      dayOptions.push(<option key={`${this.cId}_day_${d}`} value={d}>{parseInt(d) < 10 ? `0${d}` : d.toString() }</option>);
    })

    let monthOptions = [<option value="" disabled={true}>Month</option>];
    for (var i = 0; i < 12; i++) {
      var month = moment().month(i)
      monthOptions.push(<option key={`${this.cId}_month_${i}`} value={month.format("M") }>{month.format("MMMM") }</option>);
    }

    let yearOptions = [<option value="" disabled={true}>Year</option>];
    for (var i = 0; i < (this.props.yearsFromNow || 110); i++) {
      var year = this.props.futureDates ? moment().add(i, 'years').year() : moment().subtract(i, 'years').year();
      yearOptions.push(<option key={`${this.cId}_year_${year}`} value={year.toString() }>{year}</option>);
    }

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
