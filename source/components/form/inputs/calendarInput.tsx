import * as React from "react";
import * as ReactDOM from "react-dom";
import * as _ from "underscore";
import * as moment from "moment";
import * as classNames from "classnames";
import { IDataBinder } from "../../form/formCore";
import { FormBinderBase } from "../../form/formBinders";
import { DateHelpers } from './../../../utilities/dateHelpers';
import { Grid, Row, Col } from "./../../layout/grid";
import { Icons } from './../../../utilities/icons';
import { Icon } from './../../display/icon';

export interface ICalendarInputProps extends React.Props<CalendarInput> {
  className?: string;
  locale?: string;
  date?: string;
  format?: string;
  min?: string;
  max?: string;
  onDateChanged?: (date: string) => void;
  alwaysShowCalendar?: boolean;
  nativeInput?: boolean;
  icon?: string;
  disabled?: boolean;
}

export interface ICalendarInputState {
  inputValue?: string;
  selectedMonthStart?: moment.Moment;
  pickerBodyVisible?: boolean;
  showOnTop?: boolean;
  calendarOffset?: number;
}

const isoFormat = "YYYY-MM-DD";

export class CalendarInput extends React.Component<ICalendarInputProps, ICalendarInputState> {
  static Icomoon = Icons.Icomoon;

  private format: string;

  private inputElement: HTMLInputElement;
  private bodyElement: HTMLDivElement;

  static defaultProps = {
    format: 'DD/MM/YYYY',
    date: moment().startOf('day').format(isoFormat),
    locale: 'en-gb'
  }

  constructor(props: ICalendarInputProps) {
    super(props);
    moment.locale(props.locale);
    const initialDate = moment(props.date, isoFormat, true);
    this.state = { inputValue: initialDate.format(props.format), pickerBodyVisible: false, showOnTop: false, calendarOffset: 0, selectedMonthStart: initialDate.clone().startOf('month') };
  }

  onDaySelected(date: moment.Moment) {
    if (!this.fallsWithinRange(date)) {
      return;
    }
    const newDate = date.clone();
    this.setState({ pickerBodyVisible: false });
    if (this.props.onDateChanged) {
      this.props.onDateChanged(newDate.format(isoFormat));
    }
  }

  isEndOfMonth(date: moment.Moment): boolean {
    const endOfMonth = date.clone().endOf('month');
    return endOfMonth.isSame(date, 'day');
  }

  fallsWithinRange(date: moment.Moment) {
    if (this.props.min && date.isBefore(moment(this.props.min, isoFormat, true), 'day')) {
      return false;
    }
    if (this.props.max && date.isAfter(moment(this.props.max, isoFormat, true), 'day')) {
      return false;
    }
    return true;
  }
  calcTop() {
    if (this.inputElement) {
      var bounds = this.inputElement.getBoundingClientRect();
      this.setState({ calendarOffset: bounds.bottom });
    }
  }

  getDaysInMonth() {
    const days = [];
    const a = this.state.selectedMonthStart.clone().startOf('month').startOf('day');
    const b = a.clone().endOf('month');
    let firstDay = false;

    for (const m = moment(a); m.isBefore(b); m.add(1, 'days')) {
      if (!firstDay) {
        firstDay = true;
        const firstDayIndex = m.weekday();
        for (let i = firstDayIndex; i > 0; i--) {
          days.push(this.getDayComponent(true, this.onDaySelected.bind(this), m.clone().subtract(i, 'days')));
        }
      }
      days.push(this.getDayComponent(false, this.onDaySelected.bind(this), m.clone()));
      if (this.isEndOfMonth(m)) {
        const lastDayIndex = m.weekday();
        for (let i = 1; i < 7 - lastDayIndex; i++) {
          days.push(this.getDayComponent(true, this.onDaySelected.bind(this), m.clone().add(i, 'days')));
        }
      }
    }
    return days;
  }

  getDayComponent(notInCurrentMonth: boolean, dayClicked: (d: moment.Moment) => void, date: moment.Moment) {
    const d = date.clone();
    const dateWithinRange = this.fallsWithinRange(d);
    const isSelected = d.format(isoFormat) === this.props.date;
    return <CalendarDay
      key={`Calendar_day_${date.format('DDMMYYYY')}`}
      selected={isSelected}
      withinRange={dateWithinRange}
      notInCurrentMonth={notInCurrentMonth}
      dayClicked={dayClicked}
      date={d}/>;
  }

  changeMonth(increment: number) {
    this.setState({ selectedMonthStart: this.state.selectedMonthStart.clone().add(increment, 'months') }, () => {
      this.shouldShowOnTop();
    });
  }

  checkDate(dateString: string) {
    const m = moment(dateString, this.format, false);
    if (m.isValid() && this.fallsWithinRange(m)) {
      const formattedDate = m.format(this.format);
      if (this.props.onDateChanged) {
        this.props.onDateChanged(m.format(isoFormat));
      }
    }
    // TODO: reset back to original date
  }

  componentWillMount() {
    this.format = this.props.nativeInput ? isoFormat : this.props.format;
  }

  componentWillUnmount() {
    if (!this.props.nativeInput) {
      window.removeEventListener('mousedown', this);
    }
  }

  componentDidMount() {
    if (!this.props.nativeInput) {
      window.addEventListener('mousedown', this);
    }
  }

  componentWillReceiveProps(nextProps: ICalendarInputProps): void {
    if (this.props.date === nextProps.date) {
      return;
    }

    const selectedDate = moment(nextProps.date, isoFormat, true);
    this.setState({
      pickerBodyVisible: false,
      inputValue: selectedDate.format(nextProps.format),
      selectedMonthStart: selectedDate.clone().startOf('month')
    });
  }

  handleEvent(e) {
    const domNode = ReactDOM.findDOMNode(this);
    if (domNode.contains(e.target) && e.type !== "mousewheel") {
      return;
    }
    document.removeEventListener("mousewheel", this, false);

    const selectedDate = moment(this.props.date, isoFormat, true);
    this.setState({
      pickerBodyVisible: false,
      inputValue: selectedDate.format(this.props.format),
      selectedMonthStart: selectedDate.clone().startOf('month')
    });
  }

  onInputFocus() {
    document.addEventListener("mousewheel", this, false);
    this.calcTop();
    this.setState({ pickerBodyVisible: true }, () => {
      this.shouldShowOnTop();
    })
  }

  shouldShowOnTop(): boolean {
    if (this.props.nativeInput || !this.inputElement) {
      return;
    }
    const height = this.bodyElement.clientHeight + 50;
    const visibleBottom = (window.innerHeight + window.scrollY);
    const inputRect = this.inputElement.getBoundingClientRect();
    const remainingSpace = window.innerHeight - inputRect.bottom;
    if (remainingSpace < height) {
      this.setState({ showOnTop: true });
      return true;
    } else {
      this.setState({ showOnTop: false })
      return false;
    }
  }

  propsDateAsMoment(): moment.Moment {
    return moment(this.props.date, isoFormat, true);
  }

  render() {
    const weekdays = _.range(0, 7).map(n => <div className="date-picker-week-day" key={`day_name_${n}`}>{moment().startOf('week').add(n, 'days').format('dd') }</div>)
    const days = this.getDaysInMonth();
    const currentDisplayDate = this.state.selectedMonthStart.format("MMMM - YYYY");
    const classes = classNames(
      "date-picker-body",
      {
        "date-picker-body-visible": this.state.pickerBodyVisible && !this.props.alwaysShowCalendar,
        "date-picker-top": this.state.showOnTop,
        "always-show-calendar": this.props.alwaysShowCalendar
      }
    );
    const rootClasses = classNames(
      "date-picker",
      this.props.className,
      {
        "has-icon": this.props.icon !== null,
        "disabled": this.props.disabled
      }
    );
    if (this.props.nativeInput) {
      return (
        <div className={rootClasses}>
          {this.props.icon && <Icon icon={this.props.icon}/>}
          <input ref={i => this.inputElement = i}
            type="date"
            min={this.props.min || ''}
            max={this.props.max || ''}
            onChange={e => this.checkDate(e.target["value"]) }
            value={this.propsDateAsMoment().format(this.format) }
            onBlur={e => this.checkDate(e.target["value"]) }
            />
        </div>
      )
    }
    return (
      <div className={rootClasses}>
        <Icon icon={this.props.icon || Icons.Icomoon.calendar2}/>
        {!this.props.alwaysShowCalendar &&
          <input ref={i => this.inputElement = i}
            disabled={this.props.disabled}
            type="text"
            value={this.state.inputValue}
            onChange={e => this.setState({ inputValue: e.target["value"] })}
            onBlur={e => this.checkDate(e.target["value"]) }
            onFocus={e => this.onInputFocus() }/>
        }
        <div ref={b => this.bodyElement = b} className={classes} style={{ top: `${this.state.calendarOffset}px` }}>
          <div className="date-picker-body-wrapper">
            <Grid className="date-picker-header">
              <Row>
                <Col onClick={() => this.changeMonth(-1) } width="auto">{`<`}</Col>
                <Col>{currentDisplayDate}</Col>
                <Col onClick={() => this.changeMonth(1) } width="auto">{`>`}</Col>
              </Row>
            </Grid>
            <div className="date-picker-days">
              {weekdays}
              {days}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

interface ICalendarDayProps extends React.Props<CalendarDay> {
  date: moment.Moment;
  dayClicked: (date: moment.Moment) => void;
  notInCurrentMonth?: boolean;
  selected?: boolean;
  withinRange?: boolean;
}

class CalendarDay extends React.Component<ICalendarDayProps, {}> {
  render() {
    const classes = classNames(
      {
        "not-in-month": this.props.notInCurrentMonth,
        "selected-day": this.props.selected,
        "day-disabled": !this.props.withinRange
      }
    );
    return <div className={classes} onClick={() => this.props.dayClicked(this.props.date) }>{this.props.date.format('DD') }</div>
  }
}

export class CalendarInputFormBinder extends FormBinderBase<ICalendarInputProps, string, string>{
  static customValue(dataName: string) {
    return new CalendarInputFormBinder(dataName, "date");
  }

  handleValueChanged(props: ICalendarInputProps, dataBinder: IDataBinder<any>, notifyChanged: () => void) {
    props.onDateChanged = (e) => this.onChanged(dataBinder, e, notifyChanged);
  }
}
