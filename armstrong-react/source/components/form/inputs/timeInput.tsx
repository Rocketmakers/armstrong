import * as React from "react";
import * as _ from "underscore";
import { ClassHelpers } from "../../../utilities/classHelpers";
import { DateHelpers } from "../../../utilities/dateHelpers";
import { Formatting } from "../../../utilities/formatting";
import { Col, Grid, Row } from "../../layout/grid";
import { IFormInputProps } from "../form";
import { Form } from "../form";
import { DataValidationMessage } from "../formCore";
import { ValidationLabel } from "../validationWrapper";
import { buildOptions } from "./options";

export interface ITimeInputProps extends IFormInputProps<TimeInput> {
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
  /** (boolean) If true, when you select any hour, the minutes will be automatically set to 0 */
  zeroMinutesOnHourSelected?: boolean;
}

export interface ITimerInputState {
  hours?: number;
  minutes?: number;
}

export class TimeInput extends React.Component<ITimeInputProps, ITimerInputState> {
  private static hours = _.range(0, 24);

  static defaultProps: Partial<ITimeInputProps> = {
    time: "",
    hourLabel: "HH",
    minuteLabel: "MM",
    validationMode: "none",
  };

  constructor(props: ITimeInputProps) {
    super(props);
    this.state = { hours: null, minutes: null };
  }

  componentWillMount() {
    if (this.props.time) {
      const time = DateHelpers.getTimeParts(this.props.time);
      this.setState({ hours: time.hours, minutes: time.minutes });
    }
  }

  componentWillReceiveProps(newProps: ITimeInputProps) {
    if (newProps.time) {
      const newTime = DateHelpers.getTimeParts(newProps.time);
      let { hours, minutes } = this.state;
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
        this.setState({ hours, minutes });
      }
    } else {
      this.setState({ hours: null, minutes: null });
    }
  }

  private handleDataChanged = (d: ITimerInputState) => {
    this.setState(d, () => {
      if (!this.props.onChange || Formatting.isNullOrUndefined(d.hours)) {
        return;
      }
      if (Formatting.isNullOrUndefined(d.minutes)) {
        if (this.props.zeroMinutesOnHourSelected) {
          this.setState({ minutes: 0 });
          this.props.onChange(`${Formatting.twoDigitNumber(d.hours)}:00`);
        }
      } else {
        this.props.onChange(`${Formatting.twoDigitNumber(d.hours)}:${Formatting.twoDigitNumber(d.minutes)}`);
      }
    });
  };

  render() {
    const validationMessage = DataValidationMessage.get(this.props)
    const minutes = _.range(0, 60, this.props.minuteStep || 1);
    const hourOptions = buildOptions(this.props.hourLabel, TimeInput.hours, v => v, v => Formatting.twoDigitNumber(v));
    const minuteOptions = buildOptions(this.props.minuteLabel, minutes, v => v, v => Formatting.twoDigitNumber(v));
    return (
      <Form
        className={ClassHelpers.classNames("time-input", "armstrong-input", this.props.className, this.props.disabled ? "input-disabled" : null, { "show-validation": this.props.validationMode !== "none" && validationMessage })}
        dataBinder={Form.jsonDataBinder(this.state)}
        onDataChanged={this.handleDataChanged}
        title={validationMessage}>
        <Grid>
          <Row>
            <Col>
              <select tabIndex={this.props.tabIndex} {...Form.Bind.selectNumeric("hours")} disabled={this.props.disabled} {...DataValidationMessage.spread(validationMessage)} >
                {hourOptions}
              </select>
            </Col>
            <Col>
              <select tabIndex={this.props.tabIndex} {...Form.Bind.selectNumeric("minutes")} disabled={this.props.disabled} {...DataValidationMessage.spread(validationMessage)} >
                {minuteOptions}
              </select>
            </Col>
          </Row>
          <ValidationLabel
            message={validationMessage}
            mode={this.props.validationMode}
            wrapper={p => (
              <Row height="auto">
                <Col {...p} />
              </Row>
            )}
          />
        </Grid>
      </Form>
    );
  }
}
