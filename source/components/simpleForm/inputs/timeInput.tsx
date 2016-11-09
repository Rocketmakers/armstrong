import * as React from "react";
import * as _ from "underscore";
import { IDataBinder } from "../../form/formCore";
import { FormBinderBase } from "../../form/formBinders";
import { DateHelpers } from './../../../utilities/dateHelpers';
import { Grid, Row, Col } from "./../../layout/grid";
import { Binder, IFormBinding } from "./../binder"
import * as classNames from "classnames";

export interface ITimeInputProps extends React.HTMLProps<TimeInput> {}

export interface ITimerInputState {
  hours?: number;
  minutes?: number;
}

export class TimeInput extends React.Component<ITimeInputProps & IFormBinding, ITimerInputState> {
  constructor() {
    super();
    this.state = { hours: null, minutes: null };
  }
  componentWillMount() {
    let t = this.props.data[this.props.prop];
    if (t){
      var time = DateHelpers.getTimeParts(t)
      this.setState({ hours: time.hours, minutes: time.minutes });
    }
  }
  hourChanged(hour: string) {
    let hours = parseInt(hour);
    this.setState({ hours }, ()=>{
      this.updateTime();
    });
  }
  minuteChanged(minute: string) {
    let minutes = parseInt(minute);
    this.setState({ minutes }, ()=>{
      this.updateTime();
    });
  }
  change() {
    Binder.handleChange(this.props.prop, `${this.state.hours}:${this.state.minutes}`, "string", this.props.data);
    this.props.context.forceUpdate();
  }
  updateTime(){
    this.change();
  }
  componentWillReceiveProps(newProps: ITimeInputProps & IFormBinding){
    let newT= newProps.data[this.props.prop];
    if(newT){
      let newTime = DateHelpers.getTimeParts(newT);
      let hours = this.state.hours;
      let minutes = this.state.minutes;
      let needsUpdate;
      if (newTime.hours !== hours){
        hours = newTime.hours;
        needsUpdate = true;
      }
      if (newTime.minutes !== minutes){
        minutes = newTime.minutes;
        needsUpdate = true;
      }
      if (needsUpdate){
        this.setState({ hours, minutes })
      }
    }else{
      this.setState({ hours: null, minutes: null })
    }
  }
  render() {
    var hours = _.range(0, 24, 1);
    var minutes = _.range(0, 60, 1);
    return <Grid className={classNames("time-input", this.props.className)}>
      <Row>
        <Col>
          <select disabled={this.props.disabled} onChange={(e) => this.hourChanged((e.target as HTMLOptionElement).value) } value={this.state.hours !== undefined ? this.state.hours.toString() : ""}>
            <option disabled={true} value="">HH</option>
            {hours.map(d => <option key={d.toString()} value={d.toString()}>{d < 10 ? `0${d}` : d}</option>) }
          </select>
        </Col>
        <Col>
          <select disabled={this.props.disabled} onChange={(e) => this.minuteChanged((e.target as HTMLOptionElement).value) } value={this.state.minutes !== undefined ? this.state.minutes.toString() : ""}>
            <option disabled={true} value="">MM</option>
            {minutes.map(d => <option key={d.toString()} value={d.toString()}>{d < 10 ? `0${d}` : d}</option>) }
          </select>
        </Col>
      </Row>
    </Grid>
  }
}