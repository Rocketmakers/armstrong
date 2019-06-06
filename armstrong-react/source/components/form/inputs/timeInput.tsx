import * as React from "react";
import { useDidUpdateEffect } from "../../../hooks/useDidUpdateEffect";
import { calendarUtils } from "../../../utilities/calendarUtils";
import { ClassHelpers } from "../../../utilities/classHelpers";
import { Formatting } from "../../../utilities/formatting";
import { utils } from "../../../utilities/utils";
import { Col, Grid, Row } from "../../layout/grid";
import { DataValidationMessage, DataValidationMode } from "../formCore";
import { useForm } from "../formHooks";
import { ValidationLabel } from "../validationWrapper";
import { buildOptions } from "./options";

export interface ITimeInputProps extends React.Props<typeof TimeInput> {
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
  /** (Func) Filter the available minutes */
  minuteFilter?(minutes: number[]): number[];
  /** (string) The hour label - default to `HH` */
  hourLabel?: string;
  /** (Func) Filter the available hours */
  hourFilter?(hours: number[]): number[];
  /** (string) The minute label - default to `MM` */
  minuteLabel?: string;
  /** (boolean) If true, when you select any hour, the minutes will be automatically set to 0 */
  zeroMinutesOnHourSelected?: boolean;
}

export interface ITimerInputState {
  hours?: number;
  minutes?: number;
}

export const TimeInput: React.FC<ITimeInputProps> = props => {
  const { className, disabled, hourLabel, minuteLabel, minuteFilter, hourFilter, minuteStep, onChange, tabIndex, time, zeroMinutesOnHourSelected } = props

  const [timeState, setTimeState] = React.useState<ITimerInputState>({})

  const formatTime = React.useCallback((hour: number, minute: number) => `${Formatting.twoDigitNumber(hour)}:${Formatting.twoDigitNumber(minute)}`, [])

  React.useEffect(() => {
    if (time) {
      const newTime = calendarUtils.time.getParts(time);
      setTimeState({ hours: newTime.hours, minutes: newTime.minutes });
    }
  }, [])

  const handleDataChanged = React.useCallback((d: ITimerInputState) => {
    setTimeState(d)
    if (!onChange || utils.object.isNullOrUndefined(d.hours)) {
      return;
    }

    if (utils.object.isNullOrUndefined(d.minutes)) {
      if (zeroMinutesOnHourSelected) {
        setTimeState({ hours: timeState.hours, minutes: 0 })
        onChange(formatTime(d.hours, 0));
      }
    } else {
      onChange(formatTime(d.hours, d.minutes));
    }
  }, [onChange])

  useDidUpdateEffect(() => {
    if (time) {
      const newTime = calendarUtils.time.getParts(time);
      let needsUpdate: boolean;
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
        const newState: ITimerInputState = { hours, minutes }
        handleDataChanged(newState)
      }
    } else {
      setTimeState({ hours: null, minutes: null })
      onChange("")
    }
  }, [time])

  const validationMessage = DataValidationMessage.get(props)
  const validationMode = DataValidationMode.get(props)

  const hourOptions = React.useMemo(() => {
    const hoursRange = calendarUtils.time.getHours();
    return buildOptions(hourLabel, hourFilter ? hourFilter(hoursRange) : hoursRange, v => v, v => Formatting.twoDigitNumber(v))
  }, [hourLabel, hourFilter]);
  const minuteOptions = React.useMemo(() => {
    const minuteRange = calendarUtils.time.getMinutes(minuteStep || 1)
    return buildOptions(minuteLabel, minuteFilter ? minuteFilter(minuteRange) : minuteRange, v => v, v => Formatting.twoDigitNumber(v))
  }, [minuteLabel, minuteStep, minuteFilter]);

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
}
