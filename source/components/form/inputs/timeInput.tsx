import * as React from "react";
import * as _ from "underscore";
import * as classNames from "classnames";
import { IDataBinder, getEventTargetAs } from "../formCore";
import { FormBinderBase } from "../formBinderBase";
import { DateHelpers } from '../../../utilities/dateHelpers';
import { Form } from "../form";
import { Grid, Row, Col } from "../../layout/grid";
import { buildOptions } from "./options";
import { Formatting } from "../../../utilities/formatting";

export interface ITimeInputProps extends React.Props<TimeInput> {
  /** (string) CSS classname property */
  className?: string;
  /** (number) The tab index of the first select */
  tabIndex?: number;
  /** ((string) => void) Returns the time value when changed */
  onChange?: (time: string) => void;
  /** (string) The time value in HH:mm format */
  time?: string;
  /** (boolean) Should the picker disallow user interaction */
  disabled?: boolean;
  /** (number) Indicates the minute intervals to display */
  minuteStep?: number;
  /** (string) The hour label - default to `HH` */
  hourLabel?: string;
  /** (string) The minute label - default to `MM` */
  minuteLabel?: string;
}

export interface ITimerInputState {
  hours?: number;
  minutes?: number;
}

export class TimeInput extends React.Component<ITimeInputProps, ITimerInputState> {
  private static hours = _.range(0, 24);

  static defaultProps = {
    time: "",
    hourLabel: "HH",
    minuteLabel: "MM"
  }

  constructor() {
    super();
    this.state = { hours: null, minutes: null };
  }

  componentWillMount() {
    if (this.props.time) {
      var time = DateHelpers.getTimeParts(this.props.time)
      this.setState({ hours: time.hours, minutes: time.minutes });
    }
  }

  componentWillReceiveProps(newProps: ITimeInputProps) {
    if (newProps.time) {
      let newTime = DateHelpers.getTimeParts(newProps.time);
      let hours = this.state.hours;
      let minutes = this.state.minutes;
      let needsUpdate;
      if (newTime.hours !== hours) {
        hours = newTime.hours;
        needsUpdate = true;
      }
      if (newTime.minutes !== minutes) {
        minutes = newTime.minutes;
        needsUpdate = true;
      }
      if (needsUpdate) {
        this.setState({ hours, minutes })
      }
    } else {
      this.setState({ hours: null, minutes: null })
    }
  }

  private handleDataChanged = (d: ITimerInputState) => {
    this.setState(d, () => {
      if (!this.props.onChange || Formatting.isNullOrUndefined(d.hours) || Formatting.isNullOrUndefined(d.minutes)) {
        return
      }

      this.props.onChange(`${d.hours}:${d.minutes}`);
    })
  }

  render() {
    var minutes = _.range(0, 60, this.props.minuteStep || 1);
    const hourOptions = buildOptions(this.props.hourLabel, TimeInput.hours, v => v, v => Formatting.twoDigitNumber(v));
    const minuteOptions = buildOptions(this.props.minuteLabel, minutes, v => v, v => Formatting.twoDigitNumber(v));
    return (
      <Form className={classNames("time-input", this.props.className, this.props.disabled ? "input-disabled" : null)} dataBinder={Form.jsonDataBinder(this.state)} onDataChanged={this.handleDataChanged} data-validation-message={this.props["data-validation-message"]}>
        <Grid>
          <Row>
            <Col>
              <select tabIndex={this.props.tabIndex} {...Form.Bind.selectNumeric("hours") } disabled={this.props.disabled}>
                {hourOptions}
              </select>
            </Col>
            <Col>
              <select tabIndex={this.props.tabIndex} {...Form.Bind.selectNumeric("minutes") } disabled={this.props.disabled}>
                {minuteOptions}
              </select>
            </Col>
          </Row>
        </Grid>
      </Form>
    )
  }
}
