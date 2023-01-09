import * as React from "react";
import { isLocaleSet } from "../../../config/config";
import { IDay, useCalendar } from "../../../hooks/useCalendar";
import { useDidUpdateEffect } from "../../../hooks/lifecycle/useDidUpdateEffect";
import { ClassHelpers } from "../../../utilities/classHelpers";
import { utils } from "../../../utilities/utils";
import { Icon, IconOrJsx, getIconProps, getIconOrJsx } from "../../display/icon";
import { Col, Grid, Row } from "../../layout/grid";
import { DataValidationMessage, DataValidationMode } from "../formCore";
import { ValidationLabel } from "../validationWrapper";

export interface ICalendarInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** The current date */
  date?: string;
  /** The 'wire' format of the date */
  format?: string;
  /** The 'display' format of the date (to use in the UI) */
  displayFormat?: string;
  /** The minimum date */
  min?: string;
  /** The maximum date */
  max?: string;
  /** Always show the calendar inline (not as a popup) */
  alwaysShowCalendar?: boolean;
  /** The icon to display */
  icon?: IconOrJsx;
  /** Is the control disabled */
  disabled?: boolean;
  /** Disable the ability to clear the current date */
  disableClear?: boolean;
  /** Callback when the selected date has changed */
  onDateChanged?: (date: string) => void;
  /** Adds a label above the input */
  label?: string;
}

export const CalendarInput: React.FC<ICalendarInputProps> = props => {
  const { icon, placeholder, alwaysShowCalendar, disableClear, className, disabled, min, max, date, label } = props;

  const mouseWheelDispose = React.useRef<() => void>(undefined);

  const inputElement = React.useRef<HTMLInputElement>();
  const bodyElement = React.useRef<HTMLDivElement>();
  const rootElement = React.useRef<HTMLDivElement>();

  const [pickerBodyVisible, setPickerBodyVisible] = React.useState<boolean>(false);
  const [showOnTop, setShowOnTop] = React.useState<boolean>(false);
  const [calendarOffset, setCalendarOffset] = React.useState<number>(0);

  const onDateChanged = React.useCallback(
    (d: string) => {
      setPickerBodyVisible(false);
      if (props.onDateChanged) {
        props.onDateChanged(d);
      }
    },
    [props.onDateChanged, setPickerBodyVisible]
  );

  const { month, clearSelectedDate, nextMonth, previousMonth, selectDate, selectedDate, selectedDateDisplay } = useCalendar({
    format: props.format,
    displayFormat: props.displayFormat,
    minDate: min,
    maxDate: max,
    selectedDate: date,
    onDateChanged
  });
  const calcTop = React.useCallback(() => {
    if (inputElement.current) {
      const bounds = inputElement.current.getBoundingClientRect();
      setCalendarOffset(bounds.bottom);
    }
  }, [inputElement]);

  const disposal = React.useCallback((newCurrent: () => void = undefined) => {
    if (mouseWheelDispose.current) {
      try {
        mouseWheelDispose.current();
      } catch (error) {
        // noop
      }
      mouseWheelDispose.current = newCurrent;
    }
  }, []);

  React.useEffect(() => {
    if (!isLocaleSet()) {
      // tslint:disable-next-line:no-console
      console.warn(
        "Using CalendarInput without setting the global Armstrong locale is not recommended. See https://github.com/Rocketmakers/armstrong-react#form---calendar--datepickers"
      );
    }

    window.removeEventListener("mousedown", handleEvent);
    return () => {
      window.addEventListener("mousedown", handleEvent);
      disposal();
    };
  }, []);

  useDidUpdateEffect(() => {
    selectDate(date);
  }, [date]);

  const handleEvent = React.useCallback(
    (e: Event) => {
      const domNode = rootElement.current;
      if (!domNode) {
        return;
      }

      if (domNode.contains(e.target as Node) && e.type !== "mousewheel" && e.type !== "keydown") {
        return;
      }
      // tslint:disable-next-line:no-string-literal
      if (e.type === "keydown" && e["keyCode"] !== 9) {
        return;
      }

      disposal();

      if(document.activeElement instanceof HTMLElement){
        document.activeElement.blur();
      }
      setPickerBodyVisible(false);
    },
    [rootElement, setPickerBodyVisible]
  );

  const shouldShowOnTop = React.useCallback(() => {
    if (!inputElement.current) {
      return;
    }
    const height = bodyElement.current.clientHeight + 50;
    const inputRect = inputElement.current.getBoundingClientRect();
    const remainingSpace = window.innerHeight - inputRect.bottom;
    if (remainingSpace < height) {
      setShowOnTop(true);
      return true;
    }

    setShowOnTop(false);
    return false;
  }, [inputElement, bodyElement, setShowOnTop]);

  const onInputFocus = React.useCallback(() => {
    disposal(() => document.removeEventListener("wheel", handleEvent, false));
    disposal(() => document.removeEventListener("mousedown", handleEvent, false));
    document.addEventListener("wheel", handleEvent, false);
    document.addEventListener("mousedown", handleEvent, false);
    calcTop();
    setPickerBodyVisible(true);
    shouldShowOnTop();
  }, [calcTop, shouldShowOnTop]);

  const validationMessage = DataValidationMessage.get(props);
  const validationMode = DataValidationMode.get(props);

  const weekdays = React.useMemo(
    () =>
      month.daysOfWeek.map(n => (
        <div className="date-picker-week-day" key={`day_name_${n}`}>
          {n}
        </div>
      )),
    [month.daysOfWeek]
  );
  const currentDisplayDate = month.shortName + " - " + month.year;

  const classes = React.useMemo(
    () =>
      ClassHelpers.classNames("date-picker-body", {
        "date-picker-body-visible": pickerBodyVisible && !alwaysShowCalendar,
        "date-picker-top": showOnTop,
        "always-show-calendar": alwaysShowCalendar
      }),
    [pickerBodyVisible, alwaysShowCalendar, showOnTop, alwaysShowCalendar]
  );

  const rootClasses = React.useMemo(
    () =>
      ClassHelpers.classNames("date-picker", "armstrong-input", className, {
        "has-icon": icon !== null,
        disabled,
        "show-validation": validationMode !== "none" && validationMessage
      }),
    [className, icon, disabled, validationMode, validationMessage]
  );

  const days = utils.array.reduce(
    month.weeks,
    (w, c) => {
      w.push(...c.days);
      return w;
    },
    [] as IDay[]
  );
  return (
    <div ref={rootElement} className={rootClasses}>
      {label && <label className="armstrong-label">{label}</label>}
      {!alwaysShowCalendar && getIconOrJsx(icon)}

      {!alwaysShowCalendar && (
        <input
          className="cal-input"
          ref={inputElement}
          {...DataValidationMessage.spread(validationMessage)}
          disabled={disabled}
          type="text"
          value={selectedDateDisplay}
          onKeyDown={e => handleEvent(e.nativeEvent)}
          onFocus={onInputFocus}
          onChange={e => {
            /* This noop handler is here to stop react complaining! */
          }}
          placeholder={placeholder}
        />
      )}

      {!alwaysShowCalendar && selectedDate && !disableClear && (
        <div className="clear-date-button" onClick={clearSelectedDate}>
          <Icon icon={Icon.Icomoon.cross} />
        </div>
      )}
      <div ref={bodyElement} className={classes} style={{ top: `${calendarOffset}px` }}>
        <div className="date-picker-body-wrapper">
          <Grid className="date-picker-header">
            <Row>
              <Col tagName="button" onClick={previousMonth} width="auto">{`<`}</Col>
              <Col>{currentDisplayDate}</Col>
              <Col tagName="button" onClick={nextMonth} width="auto">{`>`}</Col>
            </Row>
          </Grid>
          <div className="date-picker-days">
            {weekdays}
            {days.map(day => (
              <CalendarDay key={day.date} day={day} dayClicked={selectDate} />
            ))}
          </div>
        </div>
      </div>
      <ValidationLabel className={!!selectedDateDisplay && !disableClear && 'with-clear'} message={validationMessage} mode={validationMode} />
    </div>
  );
};

CalendarInput.defaultProps = {
  displayFormat: "P",
  icon: getIconProps("Icomoon", "calendar")
};

interface ICalendarDayProps {
  day: IDay;
  dayClicked: (date: string) => void;
}

const CalendarDay: React.FC<ICalendarDayProps> = props => {
  const { day, dayClicked } = props;
  const classes = React.useMemo(
    () =>
      ClassHelpers.classNames({
        "not-in-month": !day.isCurrentMonth,
        "selected-day": day.isCurrentDate,
        "is-today": day.isToday,
        "day-disabled": day.outOfRange
      }),
    [day.isCurrentMonth, day.isCurrentDate, day.isToday, day.outOfRange]
  );

  const onClick = React.useCallback(() => dayClicked(day.date), [day]);

  return (
    <button className={classes} disabled={day.outOfRange} onClick={onClick}>
      {day.dayNumber}
    </button>
  );
};
