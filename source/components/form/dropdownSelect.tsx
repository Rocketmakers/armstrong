import * as React from "react";
import * as ReactDOM from "react-dom";
import * as _ from "underscore";
import { Icon } from './../display/icon';
import { Grid, Row, Col } from './../layout/grid';
import { Button } from './../interaction/button';

export interface IDropDownOption {
  id: number;
  label: string;
}

export interface IDropdownSelectProps extends React.Props<DropdownSelect> {
  value?: IDropDownOption;
  placeholder?: string;
  options: IDropDownOption[];
}

export interface IDropdownSelectState {
  filteredOptions?: IDropDownOption[];
  query?: string;
  open?: boolean;
  selectedValue?: IDropDownOption;
  selectedIndex?: number;
}

export class DropdownSelect extends React.Component<IDropdownSelectProps, IDropdownSelectState> {
  private id = `dropdown-select-${Math.random()}`;
  private minimumLength = 1;
  constructor() {
    super();
    this.state = { filteredOptions: [], query: "", open: false, selectedValue: null, selectedIndex: 0 };
  }
  filter(query: string) {
    var q = query.toLowerCase();
    if (query.length <= this.minimumLength) {
      this.setState({ filteredOptions: this.props.options, query }, () => this.constrainIndex());
    } else {
      this.setState({ filteredOptions: _.reject(this.props.options, o => o.label.toLowerCase().indexOf(q) === -1), query }, () => this.constrainIndex());;
    }
  }
  focusInput() {
    if (!this.state.open) {
      this.setState({ open: true }, () => {
        document.getElementById(this.id).focus()
        document.addEventListener("click", this, false)
      })
    } else {
      this.setState({ open: false, query: "", filteredOptions: this.props.options })
      document.removeEventListener("click", this, false);
    }
  }
  handleEvent(e) {
    if (ReactDOM.findDOMNode(this).contains(e.target)) {
      return;
    }
    this.setState({ open: false, query: "", filteredOptions: this.props.options })
    document.removeEventListener("click", this, false);
  }
  componentWillMount() {
    this.setState({ filteredOptions: this.props.options })
  }
  checkKey(e) {
    var currentIndex = this.state.selectedIndex;
    if (e.keyCode === 40) {
      // DOWN ARROW
      this.setState({ selectedIndex: Math.min(this.state.selectedIndex + 1, this.state.filteredOptions.length - 1) })
      e.preventDefault();
      return false;
    }
    if (e.keyCode === 38) {
      // UP ARROW
      this.setState({ selectedIndex: Math.max(this.state.selectedIndex - 1, 0) })
      e.preventDefault();
      return false;
    }
    if (e.keyCode === 13) {
      // ENTER
      this.setState({ selectedValue: this.state.filteredOptions[this.state.selectedIndex], open: false, query: "", filteredOptions: this.props.options });
      document.removeEventListener("click", this, false);
      e.preventDefault();
      return false;
    }
  }
  constrainIndex() {
    if (this.state.selectedIndex > this.state.filteredOptions.length - 1) {
      this.setState({ selectedIndex: Math.max(this.state.filteredOptions.length - 1, 0) })
    }
  }
  buttonClick() {
    this.setState({ selectedValue: this.state.filteredOptions[this.state.selectedIndex], open: false, query: "", filteredOptions: this.props.options });
    document.removeEventListener("click", this, false);
  }
  render() {
    return (
      <div className="dropdown-select">
        <Grid className="dropdown-value-display" >
          <Row>
            <Col onClick={() => this.focusInput() }>{this.state.selectedValue ? <div>{this.state.selectedValue.label}</div> : <div className="placeholder">{this.props.placeholder}</div>}</Col>
            <Col fixed={true} className="clear-selected p-right-xsmall" onClick={() => this.setState({ selectedValue: null, open: false, query: "", filteredOptions: this.props.options }) }><Icon icon={Icon.Icomoon.cross}/></Col>
            <Col fixed={true}><Button text="Go" className="bg-positive" onClick={() => this.buttonClick() }/></Col>
          </Row>
        </Grid>
        {this.state.open &&
          <div className="dropdown-select-list-wrapper">
            <input type="text"
              id={this.id}
              onKeyUp={(e) => this.checkKey(e) }
              defaultValue={this.props.value}
              onChange={(e) => this.filter((e.target as any).value) }
              placeholder="start typing to filter results..." />
            <div className="dropdown-select-list">
              {this.state.filteredOptions.map((o, i) => <div key={`dd-item-${i}`} className={`dd-list-item${i === this.state.selectedIndex ? ' selected' : ''}`} onClick={() => this.setState({ selectedValue: o, open: false, query: "", filteredOptions: this.props.options, selectedIndex: this.props.options.indexOf(o) }) }>{o.label}</div>) }
              {this.state.filteredOptions.length === 0 && <div>No results...</div>}
            </div>
          </div>
        }
      </div>)
  }
}