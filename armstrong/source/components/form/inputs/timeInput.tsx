import * as React from "react";
import * as _ from "underscore";
import { IDataBinder } from "../../form/formCore";
import { FormBinderBase } from "../../form/formBinders";
import { DateHelpers } from './../../../utilities/dateHelpers';
import { Grid, Row, Col } from "./../../layout/grid";

export interface ITimeInputProps extends React.Props<TimeInput> {
  /** ((string) => void) Returns the time value when changed */
  onChange?: (time: string) => void;
  /** (string) The time value in HH:mm format */
  time?: string;
  /** (boolean) Should the picker disallow user interaction */
  disabled?: boolean;
}

export interface ITimerInputState {
  hours?: number;
  minutes?: number;
}

export class TimeInput extends React.Component<ITimeInputProps, ITimerInputState> {
  constructor() {
    super();
    this.state = { hours: null, minutes: null };
  }
  componentWillMount() {
    if (this.props.time){
      var time = DateHelpers.getTimeParts(this.props.time)
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
  updateTime(){
    if (this.props.onChange){
      this.props.onChange(`${this.state.hours}:${this.state.minutes}`);
    }
  }
  componentWillReceiveProps(newProps: ITimeInputProps){
    if(newProps.time){
      let newTime = DateHelpers.getTimeParts(newProps.time);
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
    return <Grid>
      <Row>
        <Col>
          <select disabled={this.props.disabled} onChange={(e) => this.hourChanged((e.target as HTMLOptionElement).value) } value={this.state.hours ? this.state.hours.toString() : ""}>
            <option disabled={true} value="">HH</option>
            {hours.map(d => <option key={d.toString()} value={d.toString()}>{d < 10 ? `0${d}` : d}</option>) }
          </select>
        </Col>
        <Col>
          <select disabled={this.props.disabled} onChange={(e) => this.minuteChanged((e.target as HTMLOptionElement).value) } value={this.state.minutes ? this.state.minutes.toString() : ""}>
            <option disabled={true} value="">MM</option>
            {minutes.map(d => <option key={d.toString()} value={d.toString()}>{d < 10 ? `0${d}` : d}</option>) }
          </select>
        </Col>
      </Row>
    </Grid>
  }
}

export class TimeInputFormBinder extends FormBinderBase<ITimeInputProps, string, string>{
  static customValue(dataName: string){
    return new TimeInputFormBinder(dataName, "time");
  }

  handleValueChanged(props: ITimeInputProps, dataBinder:IDataBinder<any>, notifyChanged: () => void) {
    props.onChange = (e) => {
      this.onChanged(dataBinder, e, notifyChanged);
    };
  }
}