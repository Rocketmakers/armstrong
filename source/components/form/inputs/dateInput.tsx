import * as React from "react";
import * as moment from "moment";
import { IDataBinder } from "../../form/formCore";
import { FormBinderBase } from "../../form/formBinders";
import { Grid, Row, Col } from "./../../layout/grid";
import { Form } from "../form";

interface IDateInputProps extends React.Props<DateInput> {
  date?: string;
  onChange?: (date: string) => void;
  yearsFromNow?: number;
  futureDates?: boolean;
}

interface IDateInputState {
  day?: number;
  month?: number;
  year?: number;
  date?: string;
}

export class DateInput extends React.Component<IDateInputProps, IDateInputState> {
  constructor() {
    super();
    this.state = { date: null };
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
  buildDate() {
    let d = this.createDate();
    this.setState({ date: d }, () => {
      if (this.props.onChange) {
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
      dayOptions.push(<option value={d}>{parseInt(d) < 10 ? `0${d}` : d.toString() }</option>);
    })

    let monthOptions = [<option value="" disabled={true}>Month</option>];
    for (var i = 0; i < 12; i++) {
      var month = moment().month(i)
      monthOptions.push(<option value={month.format("M") }>{month.format("MMMM") }</option>);
    }

    let yearOptions = [<option value="" disabled={true}>Year</option>];
    for (var i = 0; i < (this.props.yearsFromNow || 110); i++) {
      var year = this.props.futureDates ? moment().add(i, 'years').year() : moment().subtract(i, 'years').year();
      yearOptions.push(<option value={year.toString() }>{year}</option>);
    }

    return <Form dataBinder={Form.jsonDataBinder(this.props.date)} onDataChanged={(d) => this.props.onChange(d)}>
    <Grid>
      <Row>
        <Col>
          <select onChange={(e) => this.dayChanged((e.target as HTMLOptionElement).value) } defaultValue={this.props.date ? moment(this.props.date).format("DD") : ""}>
            {dayOptions}
          </select>
        </Col>
        <Col className="m-left-xsmall m-right-xsmall">
          <select onChange={(e) => this.monthChanged((e.target as HTMLOptionElement).value) } defaultValue={this.props.date ? moment(this.props.date).format("MM") : ""}>
            {monthOptions}
          </select>
        </Col>
        <Col>
          <select onChange={(e) => this.yearChanged((e.target as HTMLOptionElement).value) } defaultValue={this.props.date ? moment(this.props.date).format("YYYY") : ""}>
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
