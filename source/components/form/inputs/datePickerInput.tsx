import * as React from "react";
import * as _ from "underscore";
import * as moment from "moment";
import { Grid, Row, Col } from "./../../layout/grid";
import { classNames, cd } from "./../../../utilities/classBuilder";
import { Icons } from './../../../utilities/icons';
import { Icon } from './../../display/icon';

export interface IDatePickerInputProps extends React.Props<DatePickerInput> {
  className?: string;
  locale?: string;
  date?: moment.Moment | string;
  format?: string;
  min?: moment.Moment;
  max?: moment.Moment;
  onDateChanged?: (date: moment.Moment) => void;
  alwaysShowCalendar?: boolean;
  nativeInput?: boolean;
  icon?: string;
  disabled?: boolean;
}

export interface IDatePickerInputState {
  displayedDate?: moment.Moment;
  selectedDate?: moment.Moment;
  pickerBodyVisible?: boolean;
  showOnTop?: boolean;
}

export class DatePickerInput extends React.Component<IDatePickerInputProps, IDatePickerInputState> {
  static Icomoon = Icons.Icomoon;

  private mouseDownOnCalendar = false;
  private inputElement;
  private bodyElement;

  private inputElementId;
  private bodyElementId;

  private format: string;

  static defaultProps = {
    format: 'DD/MM/YYYY',
    date: moment().startOf('day'),
    locale: 'en-gb'
  }
  constructor(props: IDatePickerInputProps) {
    super(props);
    var todaysDate = moment().startOf('day');
    this.state = { displayedDate: todaysDate.clone(), selectedDate: todaysDate, pickerBodyVisible: false, showOnTop: false };
    moment.locale(props.locale);
    const seed = Math.random().toFixed(4);
    this.inputElementId = "date-picker-text-input-" + seed;
    this.bodyElementId = "date-picker-body-" + seed;
  }
  onDaySelected(date: moment.Moment) {
    if (!this.fallsWithinRange(date)) {
      return;
    }
    var newDate = date.clone();
    if (this.inputElement) {
      this.inputElement.value = newDate.format(this.format);
    }
    this.setState({ selectedDate: newDate, displayedDate: newDate.clone(), pickerBodyVisible: false });
    if (this.props.onDateChanged) {
      this.props.onDateChanged(newDate.clone());
    }
  }
  isEndOfMonth(date: moment.Moment): boolean {
    var endOfMonth = date.clone().endOf('month');
    return endOfMonth.isSame(date, 'day');
  }
  fallsWithinRange(date: moment.Moment) {
    if (this.props.min && date.isBefore(this.props.min, 'day')) {
      return false;
    }
    if (this.props.max && date.isAfter(this.props.max, 'day')) {
      return false;
    }
    return true;
  }
  getDaysInMonth() {
    var days = [];
    var a = this.state.displayedDate.clone().startOf('month').startOf('day');
    var b = a.clone().endOf('month');
    var firstDay = false;

    for (var m = moment(a); m.isBefore(b); m.add(1, 'days')) {
      if (!firstDay) {
        firstDay = true;
        var firstDayIndex = m.weekday();
        for (var i = firstDayIndex; i > 0; i--) {
          days.push(this.getDayComponent(true, this.onDaySelected.bind(this), m.clone().subtract(i, 'days')));
        }
      }
      days.push(this.getDayComponent(false, this.onDaySelected.bind(this), m.clone()));
      if (this.isEndOfMonth(m)) {
        var lastDayIndex = m.weekday();
        for (var i2 = 1; i2 < 7 - lastDayIndex; i2++) {
          days.push(this.getDayComponent(true, this.onDaySelected.bind(this), m.clone().add(i2, 'days')));
        }
      }
    }
    return days;
  }
  getDayComponent(notInCurrentMonth: boolean, dayClicked: (d: moment.Moment) => void, date: moment.Moment) {
    var d = date.clone();
    var dateWithinRange = this.fallsWithinRange(d);
    var isSelected = d.isSame(this.state.selectedDate, 'day');
    return <DatePickerDay
      key={`datepicker_day_${date.format('DDMMYYYY')}`}
      selected={isSelected}
      withinRange={dateWithinRange}
      notInCurrentMonth={notInCurrentMonth}
      dayClicked={dayClicked}
      date={d}/>;
  }
  changeMonth(increment: number) {
    this.setState({ displayedDate: this.state.displayedDate.add(increment, 'months') }, () => {
      this.shouldShowOnTop();
    })
  }
  checkDate(dateString: string, ignoreFormat?: boolean) {
    var m = moment(dateString, ignoreFormat ? null : this.format, false);
    if (m.isValid() && this.fallsWithinRange(m)) {
      var formattedDate = m.format(this.format);
      if (this.inputElement) {
        this.inputElement.value = formattedDate;
      }
      this.setState({ selectedDate: m.clone(), displayedDate: m.clone() });
      if (this.props.onDateChanged) {
        this.props.onDateChanged(m.clone());
      }
    } else {
      if (this.inputElement) {
        this.inputElement.value = this.state.selectedDate.format(this.format);
      }
    }
  }
  componentWillMount() {
    this.format = this.props.nativeInput ? "YYYY-MM-DD" : this.props.format;
    if (this.props.date) {
      if (typeof this.props.date === "string") {
        var mDate = moment(this.props.date as string, this.format);
        this.setState({ selectedDate: mDate, displayedDate: mDate.clone() });
      }
      else {
        var pDate = moment((this.props.date as moment.Moment)).startOf('day');
        pDate.locale(this.props.locale);
        this.setState({ selectedDate: pDate, displayedDate: pDate.clone() });
      }
    }
  }
  componentWillUnmount() {
    if (!this.props.nativeInput) {
      window.removeEventListener('mousedown', this);
    }
  }
  componentDidMount() {
    this.inputElement = document.getElementById(this.inputElementId);
    this.bodyElement = document.getElementById(this.bodyElementId);
    if (!this.props.nativeInput) {
      window.addEventListener('mousedown', this);
    }

  }
  handleEvent(e) {
    if (this.mouseDownOnCalendar) {
      return;
    }
    this.setState({ pickerBodyVisible: false });
  }
  onInputFocus() {
    this.setState({ pickerBodyVisible: true }, () => {
      this.shouldShowOnTop();
    })
  }
  shouldShowOnTop() {
    if (this.props.nativeInput || !this.inputElement) {
      return;
    }
    var height = this.bodyElement.clientHeight + 50;
    var visibleBottom = (window.innerHeight + window.scrollY);
    var inputRect = this.inputElement.getBoundingClientRect();
    var remainingSpace = Math.abs(visibleBottom - inputRect.bottom);

    if (remainingSpace < height) {
      this.setState({ showOnTop: true })
    } else {
      this.setState({ showOnTop: false })
    }
  }
  render() {
    var weekdays = _.range(0, 7).map(n => <div className="date-picker-week-day" key={`day_name_${n}`}>{moment().startOf('week').add(n, 'days').format('dd') }</div>)
    var days = this.getDaysInMonth();
    var currentDisplayDate = this.state.displayedDate.format("MMMM - YYYY");
    var classes = classNames("date-picker-body",
      cd("date-picker-body-visible", this.state.pickerBodyVisible && !this.props.alwaysShowCalendar),
      cd("date-picker-top", this.state.showOnTop),
      cd("always-show-calendar", this.props.alwaysShowCalendar));
    var rootClasses = classNames("date-picker", this.props.className, cd('has-icon', this.props.icon !== null), cd('disabled', this.props.disabled));
    if (this.props.nativeInput) {
      return (
        <div className={rootClasses}>
        {this.props.icon && <Icon icon={this.props.icon}/>}
        <input id={this.inputElementId}
          type="date"
          min={this.props.min ? this.props.min.format("YYYY-MM-DD"): ''}
          max={this.props.max ? this.props.max.format("YYYY-MM-DD"): ''}
          onChange={e => this.checkDate((e.target as any).value) }
          defaultValue={this.state.selectedDate.format(this.format) }
          onBlur={e => this.checkDate((e.target as any).value) }
          />
          </div>
      )
    }
    return (
      <div className={rootClasses}
        onMouseDown={() => this.mouseDownOnCalendar = true}
        onMouseUp={() => this.mouseDownOnCalendar = false}>
        {this.props.icon && <Icon icon={this.props.icon}/>}
        {!this.props.alwaysShowCalendar &&
          <input id={this.inputElementId}
            type="text"
            defaultValue={this.state.selectedDate.format(this.format) }
            onBlur={e => this.checkDate((e.target as any).value) }
            onFocus={e => this.onInputFocus() }/>
        }
        <div id={this.bodyElementId} className={classes}>
          <div className="date-picker-body-wrapper">
            <Grid className="date-picker-header" dontFillContainer={true}>
              <Row>
                <Col onClick={() => this.changeMonth(-1) } fixed={true}>{`<`}</Col>
                <Col>{currentDisplayDate}</Col>
                <Col onClick={() => this.changeMonth(1) } fixed={true}>{`>`}</Col>
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

interface IDatePickerDayProps extends React.Props<DatePickerDay> {
  date: moment.Moment;
  dayClicked: (date: moment.Moment) => void;
  notInCurrentMonth?: boolean;
  selected?: boolean;
  withinRange?: boolean;
}

class DatePickerDay extends React.Component<IDatePickerDayProps, {}> {
  render() {
    var classes = classNames(cd('not-in-month', this.props.notInCurrentMonth), cd('selected-day', this.props.selected), cd("day-disabled", !this.props.withinRange));
    return <div className={classes} onClick={() => this.props.dayClicked(this.props.date) }>{this.props.date.format('DD') }</div>
  }
}
