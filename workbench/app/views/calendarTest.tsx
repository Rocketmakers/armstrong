import * as React from 'react';
import { CalendarInput } from './../../../source/components/form/inputs/calendarInput';

export class CalendarTest extends React.Component<any, any> {
  constructor() {
    super();
    this.state = {
      date1: "2016-05-01",
      date2: "2017-05-01",
    };
  }

  render() {
    return (
      <div>
        <CalendarInput date={this.state.date1} min="2016-01-01" max="2016-12-31" onDateChanged={date => this.setState({date1: date})} />
        <CalendarInput date={this.state.date2} min="2017-05-01" max="2017-08-31" onDateChanged={date => this.setState({date2: date})} nativeInput />
      </div>
    );
  }
}
