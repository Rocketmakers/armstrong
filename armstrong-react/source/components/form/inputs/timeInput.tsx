import * as React from "react";
import * as _ from "underscore";
import { ClassHelpers } from "../../../utilities/classHelpers";
import { DateHelpers } from "../../../utilities/dateHelpers";
import { Formatting } from "../../../utilities/formatting";
import { useDidUpdateEffect } from "../../../utilities/hooks";
import { Col, Grid, Row } from "../../layout/grid";
import { IFormInputProps } from "../form";
import { DataValidationMessage } from "../formCore";
import { useForm } from "../formHooks";
import { ValidationLabel } from "../validationWrapper";
import { buildOptions } from "./options";

export interface ITimeInputProps extends IFormInputProps<typeof TimeInput> {
  /** (string) CSS className property */
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

const hoursRange = _.range(0, 24);

export const TimeInput: React.FC<ITimeInputProps> = props => {
  const { className, disabled, hourLabel, minuteLabel, minuteStep, onChange, tabIndex, time, validationMode, zeroMinutesOnHourSelected } = props

  const [timeState, setTimeState] = React.useState<ITimerInputState>({ hours: null, minutes: null })

  React.useEffect(() => {
    if (time) {
      const newTime = DateHelpers.getTimeParts(time);
      setTimeState({ hours: newTime.hours, minutes: newTime.minutes });
    }
  }, [])

  useDidUpdateEffect(() => {
    if (time) {
      const newTime = DateHelpers.getTimeParts(time);
      let needsUpdate;
      let { hours, minutes } = timeState
      if (newTime.hours !== hours) {
        hours = newTime.hours;
        needsUpdate = true;
      }
      if (newTime.minutes !== minutes) {
        minutes = newTime.minutes;
        needsUpdate = true;
      }
      if (needsUpdate) {
        setTimeState({ hours, minutes })
      }
    } else {
      setTimeState({ hours: null, minutes: null })
    }
  }, [time])

  const handleDataChanged = React.useCallback((d: ITimerInputState) => {
    setTimeState(d)
    if (!onChange || Formatting.isNullOrUndefined(d.hours)) {
      return;
    }

    if (Formatting.isNullOrUndefined(d.minutes)) {
      if (zeroMinutesOnHourSelected) {
        setTimeState({ hours: timeState.hours, minutes: 0 })
        onChange(`${Formatting.twoDigitNumber(d.hours)}:00`);
      }
    } else {
      onChange(`${Formatting.twoDigitNumber(d.hours)}:${Formatting.twoDigitNumber(d.minutes)}`);
    }
  }, [])

  const validationMessage = DataValidationMessage.get(props)
  const minutesRange = _.range(0, 60, minuteStep || 1);
  const hourOptions = buildOptions(hourLabel, hoursRange, v => v, v => Formatting.twoDigitNumber(v));
  const minuteOptions = buildOptions(minuteLabel, minutesRange, v => v, v => Formatting.twoDigitNumber(v));
  const { DataForm, bind } = useForm(timeState)
  return (
    <DataForm
      className={ClassHelpers.classNames("time-input", "armstrong-input", className, disabled ? "input-disabled" : null, { "show-validation": validationMode !== "none" && validationMessage })}
      onDataChanged={handleDataChanged}
      title={validationMessage}>
      <Grid>
        <Row>
          <Col>
            <select tabIndex={tabIndex} {...bind.selectNumeric("hours")} disabled={disabled} {...DataValidationMessage.spread(validationMessage)} >
              {hourOptions}
            </select>
          </Col>
          <Col>
            <select tabIndex={tabIndex} {...bind.selectNumeric("minutes")} disabled={disabled} {...DataValidationMessage.spread(validationMessage)} >
              {minuteOptions}
            </select>
          </Col>
        </Row>
        <ValidationLabel
          message={validationMessage}
          mode={validationMode}
          wrapper={p => (
            <Row height="auto">
              <Col {...p} />
            </Row>
          )}
        />
      </Grid>
    </DataForm>
  );
}

TimeInput.defaultProps = {
  time: "",
  hourLabel: "HH",
  minuteLabel: "MM",
  validationMode: "none",
}
