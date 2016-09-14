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
    format: 'L',
    locale: 'en-gb'
  }

  constructor(props: ICalendarInputProps) {
    super(props);
    this.format = this.props.nativeInput ? isoFormat : props.format;
    const initialDate = props.date ? moment(props.date, isoFormat, true) : null;
    let inputValue = "";
    let selectedMonthStart = moment().startOf('month');
    if (initialDate) {
      inputValue = initialDate.format(this.format);
      selectedMonthStart = initialDate.clone().startOf('month');
    }
    this.state = { inputValue, pickerBodyVisible: false, showOnTop: false, calendarOffset: 0, selectedMonthStart };
  }

  onDaySelected(date: moment.Moment) {
    if (!this.fallsWithinRange(date)) {
      return;
    }
    const newDate = date.clone();
    this.setState({ pickerBodyVisible: false, inputValue: newDate.format(this.format) });
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
    if (dateString === this.state.inputValue){
      return;
    }
    const m = moment(dateString, this.format, false);
    if (m.isValid() && this.fallsWithinRange(m)) {
      const formattedDate = m.format(this.format);
      if (this.props.onDateChanged) {
        this.props.onDateChanged(m.format(isoFormat));
      }
    }
    else {
      this.resetState(this.props);
    }
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
    if (this.props.date !== nextProps.date) {
      this.resetState(nextProps);
    }
  }

  handleEvent(e) {
    const domNode = ReactDOM.findDOMNode(this);
    if (domNode.contains(e.target) && e.type !== "mousewheel" && e.type !== "keydown") {
      return;
    }
    if (e.type === "keydown" && e.keyCode !== 9){
      return;
    }
    document.removeEventListener("mousewheel", this, false);
    if (!this.state.inputValue){
      this.resetState(this.props);
    }
    else{
      this.setState({ pickerBodyVisible: false });
    }
  }

  resetState(props: ICalendarInputProps): void {
    const selectedDate = props.date ? moment(props.date, isoFormat, true) : null;
    if (selectedDate) {
      this.setState({
        pickerBodyVisible: false,
        inputValue: selectedDate.format(this.format),
        selectedMonthStart: selectedDate.clone().startOf('month')
      });
    } else {
      this.setState({
        pickerBodyVisible: false,
        inputValue: "",
        selectedMonthStart: moment().startOf('month')
      });
    }

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
            />
        </div>
      )
    }
    return (
      <div className={rootClasses}>
        <Icon icon={this.props.icon || Icons.Icomoon.calendar2}/>
        {!this.props.alwaysShowCalendar &&
          <input className="cal-input" ref={i => this.inputElement = i}
            disabled={this.props.disabled}
            type="text"
            value={this.state.inputValue}
            onKeyDown={e => this.handleEvent(e)}
            onFocus={e => this.onInputFocus() }/>
        }
        {!this.props.alwaysShowCalendar && this.props.date && !this.props.disableClear &&
          <div className="clear-date-button" onClick={()=> this.props.onDateChanged(null)}><Icon icon={Icon.Icomoon.cross}/></div>
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
