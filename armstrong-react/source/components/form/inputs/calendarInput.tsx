import * as moment from "moment";
import * as React from "react";
import * as _ from "underscore";
import { isLocaleSet } from "../../../config/config"
import { ClassHelpers } from "../../../utilities/classHelpers";
import { useDidUpdateEffect } from "../../../utilities/hooks";
import { Icon } from "../../display/icon";
import { Col, Grid, Row } from "../../layout/grid";
import { IFormInputHTMLProps } from "../form";
import { DataValidationMessage } from "../formCore";
import { ValidationLabel } from "../validationWrapper";

export interface ICalendarInputProps extends IFormInputHTMLProps<React.InputHTMLAttributes<HTMLInputElement>> {
  date?: string;
  format?: string;
  min?: string;
  max?: string;
  onDateChanged?: (date: string) => void;
  alwaysShowCalendar?: boolean;
  nativeInput?: boolean;
  icon?: string;
  disabled?: boolean;
  disableClear?: boolean;
}

const isoFormat = "YYYY-MM-DD";

export const CalendarInput: React.FC<ICalendarInputProps> = props => {

  const { icon, placeholder, alwaysShowCalendar, disableClear, onDateChanged, className, disabled, validationMode, nativeInput, min, max, date } = props

  const format = React.useRef<string>(nativeInput ? isoFormat : props.format);
  const inputElement = React.useRef<HTMLInputElement>();
  const bodyElement = React.useRef<HTMLDivElement>();
  const rootElement = React.useRef<HTMLDivElement>();

  const initialDate = React.useMemo(() => date ? moment(date, isoFormat, true) : null, []);

  const [inputValue, setInputValue] = React.useState<string>(initialDate ? initialDate.format(format.current) : "")
  const [selectedMonthStart, setSelectedMonthStart] = React.useState<moment.Moment>(initialDate ? initialDate.clone().startOf("month") : moment().startOf("month"))
  const [pickerBodyVisible, setPickerBodyVisible] = React.useState<boolean>(false)
  const [showOnTop, setShowOnTop] = React.useState<boolean>(false)
  const [calendarOffset, setCalendarOffset] = React.useState<number>(0)

  const resetState = React.useCallback((newDate: string) => {
    const selectedDate = newDate ? moment(newDate, isoFormat, true) : null;
    setPickerBodyVisible(false);
    if (selectedDate) {
      setInputValue(selectedDate.format(format.current))
      setSelectedMonthStart(selectedDate.clone().startOf("month"))
    } else {
      setInputValue("")
      setSelectedMonthStart(moment().startOf("month"))
    }
  }, [format])

  const isEndOfMonth = React.useCallback((mom: moment.Moment) => {
    const endOfMonth = mom.clone().endOf("month");
    return endOfMonth.isSame(mom, "day");
  }, [])

  const fallsWithinRange = React.useCallback((mom: moment.Moment) => {
    if (min && mom.isBefore(moment(min, isoFormat, true), "day")) {
      return false;
    }
    if (max && mom.isAfter(moment(max, isoFormat, true), "day")) {
      return false;
    }
    return true;
  }, [min, max])

  const calcTop = React.useCallback(() => {
    if (inputElement.current) {
      const bounds = inputElement.current.getBoundingClientRect();
      setCalendarOffset(bounds.bottom);
    }
  }, [inputElement])

  const onDaySelected = React.useCallback((mom: moment.Moment) => {
    if (!fallsWithinRange(mom)) {
      return;
    }
    const newDate = mom.clone();
    setPickerBodyVisible(false)
    setInputValue(newDate.format(format.current))
    if (onDateChanged) {
      onDateChanged(newDate.format(isoFormat));
    }
  }, [onDateChanged, fallsWithinRange])

  const getDayComponent = React.useCallback((notInCurrentMonth: boolean, dayClicked: (d: moment.Moment) => void, mom: moment.Moment) => {
    const d = mom.clone();
    const dateWithinRange = fallsWithinRange(d);
    const isSelected = d.format(isoFormat) === date;
    const isToday = d.clone().startOf("day").isSame(moment().startOf("day"));
    return <CalendarDay
      key={`Calendar_day_${mom.format("DDMMYYYY")}`}
      selected={isSelected}
      isToday={isToday}
      withinRange={dateWithinRange}
      notInCurrentMonth={notInCurrentMonth}
      dayClicked={dayClicked}
      date={d} />;
  }, [fallsWithinRange])

  const getDaysInMonth = React.useCallback(() => {
    const daysInMonth: JSX.Element[] = [];
    const starting = selectedMonthStart.clone().startOf("month").startOf("day");
    const ending = starting.clone().endOf("month");
    let firstDay = false;

    for (const m = moment(starting); m.isBefore(ending); m.add(1, "days")) {
      if (!firstDay) {
        firstDay = true;
        const firstDayIndex = m.weekday();
        for (let i = firstDayIndex; i > 0; i--) {
          daysInMonth.push(getDayComponent(true, onDaySelected, m.clone().subtract(i, "days")));
        }
      }
      daysInMonth.push(getDayComponent(false, onDaySelected, m.clone()));
      if (isEndOfMonth(m)) {
        const lastDayIndex = m.weekday();
        for (let i = 1; i < 7 - lastDayIndex; i++) {
          daysInMonth.push(getDayComponent(true, onDaySelected, m.clone().add(i, "days")));
        }
      }
    }
    return daysInMonth;
  }, [selectedMonthStart, getDayComponent, isEndOfMonth, onDaySelected])

  const checkDate = React.useCallback((dateString: string) => {
    if (dateString === inputValue) {
      return;
    }
    const m = moment(dateString, format.current, false);
    if (m.isValid() && fallsWithinRange(m)) {
      // const formattedDate = m.format(format.current);
      if (onDateChanged) {
        onDateChanged(m.format(isoFormat));
      }
    } else {
      resetState(date);
    }
  }, [date, inputValue, format, fallsWithinRange, onDateChanged, resetState])

  React.useEffect(() => {
    if (!isLocaleSet()) {
      // tslint:disable-next-line:no-console
      console.warn("Using CalendarInput without setting the global Armstrong locale is not recommended. See https://github.com/Rocketmakers/armstrong-react#form---calendar--datepickers")
    }

    if (!nativeInput) {
      window.removeEventListener("mousedown", handleEvent);
      return () => window.addEventListener("mousedown", handleEvent);
    }
  }, [])

  useDidUpdateEffect(() => {
    resetState(date);
  }, [date])

  const handleEvent = React.useCallback((e: Event) => {
    const domNode = rootElement.current;
    if (domNode.contains(e.target as Node) && e.type !== "mousewheel" && e.type !== "keydown") {
      return;
    }
    // tslint:disable-next-line:no-string-literal
    if (e.type === "keydown" && e["keyCode"] !== 9) {
      return;
    }
    document.removeEventListener("mousewheel", handleEvent, false);
    if (!inputValue) {
      resetState(date);
    } else {
      setPickerBodyVisible(false);
    }
  }, [date, rootElement, inputValue, resetState, setPickerBodyVisible])

  const shouldShowOnTop = React.useCallback(() => {
    if (nativeInput || !inputElement.current) {
      return;
    }
    const height = bodyElement.current.clientHeight + 50;
    // const visibleBottom = (window.innerHeight + window.scrollY);
    const inputRect = inputElement.current.getBoundingClientRect();
    const remainingSpace = window.innerHeight - inputRect.bottom;
    if (remainingSpace < height) {
      setShowOnTop(true)
      return true;
    }

    setShowOnTop(false)
    return false;
  }, [nativeInput, inputElement, bodyElement, setShowOnTop])

  const onInputFocus = React.useCallback(() => {
    document.addEventListener("mousewheel", handleEvent, false);
    calcTop();
    setPickerBodyVisible(true)
    shouldShowOnTop();
  }, [calcTop, shouldShowOnTop])

  const changeMonth = React.useCallback((increment: number) => {
    setSelectedMonthStart(selectedMonthStart.clone().add(increment, "months"))
    shouldShowOnTop();
  }, [selectedMonthStart, shouldShowOnTop])

  const propsDateAsMoment = React.useCallback(() => {
    return moment(date, isoFormat, true);
  }, [date])

  const validationMessage = DataValidationMessage.get(props)

  const weekdays = React.useMemo(() => _.range(0, 7).map(n => <div className="date-picker-week-day" key={`day_name_${n}`}>{moment().startOf("week").add(n, "days").format("dd")}</div>), [])
  const days = getDaysInMonth();
  const currentDisplayDate = selectedMonthStart.format("MMMM - YYYY");

  const classes = React.useMemo(() => ClassHelpers.classNames(
    "date-picker-body",
    {
      "date-picker-body-visible": pickerBodyVisible && !alwaysShowCalendar,
      "date-picker-top": showOnTop,
      "always-show-calendar": alwaysShowCalendar,
    },
  ), [pickerBodyVisible, alwaysShowCalendar, showOnTop, alwaysShowCalendar]);

  const rootClasses = React.useMemo(() => ClassHelpers.classNames(
    "date-picker",
    "armstrong-input",
    className,
    {
      "has-icon": icon !== null,
      "disabled": disabled,
      "show-validation": (validationMode !== "none" && validationMessage),
    },
  ), [className, icon, disabled, validationMode, validationMessage]);

  if (nativeInput) {
    return (
      <div ref={rootElement} className={rootClasses}>
        {icon && <Icon icon={icon} />}
        <input ref={inputElement}
          {...DataValidationMessage.spread(validationMessage)}
          type="date"
          min={min || ""}
          max={max || ""}
          onChange={e => checkDate(e.target.value)}
          value={propsDateAsMoment().format(format.current)}
          placeholder={placeholder}
        />
      </div>
    )
  }
  return (
    <div ref={rootElement} className={rootClasses}>
      <Icon icon={icon || Icon.Icomoon.calendar2} />
      {!alwaysShowCalendar &&
        <input className="cal-input" ref={inputElement}
          {...DataValidationMessage.spread(validationMessage)}
          disabled={disabled}
          type="text"
          value={inputValue}
          onKeyDown={e => handleEvent(e.nativeEvent)}
          onFocus={onInputFocus}
          onChange={e => { /* This noop handler is here to stop react complaining! */ }}
          placeholder={placeholder}
        />
      }
      {!alwaysShowCalendar && date && !disableClear &&
        <div className="clear-date-button" onClick={() => onDateChanged(null)}><Icon icon={Icon.Icomoon.cross} /></div>
      }
      <div ref={bodyElement} className={classes} style={{ top: `${calendarOffset}px` }}>
        <div className="date-picker-body-wrapper">
          <Grid className="date-picker-header">
            <Row>
              <Col onClick={() => changeMonth(-1)} width="auto">{`<`}</Col>
              <Col>{currentDisplayDate}</Col>
              <Col onClick={() => changeMonth(1)} width="auto">{`>`}</Col>
            </Row>
          </Grid>
          <div className="date-picker-days">
            {weekdays}
            {days}
          </div>
        </div>
      </div>
      <ValidationLabel message={validationMessage} mode={validationMode} />
    </div>
  )

}

CalendarInput.defaultProps = {
  format: "L",
  validationMode: "none",
}

interface ICalendarDayProps extends React.Props<typeof CalendarDay> {
  date: moment.Moment;
  dayClicked: (date: moment.Moment) => void;
  notInCurrentMonth?: boolean;
  selected?: boolean;
  withinRange?: boolean;
  isToday?: boolean;
}

const CalendarDay: React.FC<ICalendarDayProps> = props => {
  const { notInCurrentMonth, selected, isToday, withinRange, date, dayClicked } = props
  const classes = React.useMemo(() => ClassHelpers.classNames(
    {
      "not-in-month": notInCurrentMonth,
      "selected-day": selected,
      "is-today": isToday,
      "day-disabled": !withinRange,
    },
  ), [notInCurrentMonth, selected, isToday, withinRange]);

  const onClick = React.useCallback(() => dayClicked(date), [date])

  const format = React.useMemo(() => date.format("DD"), [date])

  return <div className={classes} onClick={onClick}>{format}</div>
}
