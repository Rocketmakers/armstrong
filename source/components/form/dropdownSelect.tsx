import * as React from "react";
import * as ReactDOM from "react-dom";
import * as _ from "underscore";
import { Icon } from './../display/icon';
import { Grid, Row, Col } from './../layout/grid';
import { Button } from './../interaction/button';

export interface IDropdownOption {
  id: number;
  name: string;
  data: any;
}

export interface IDropdownSelectProps extends React.Props<DropdownSelect> {
  className?: string;
  value?: IDropdownOption;
  minimumLength?: number;
  placeholder?: string;
  searchPlaceholder?: string;
  noResultsMessage?: string;
  options?: IDropdownOption[];
  remoteThrottle?: number;
  remoteQuery?: (query: string) => Promise<IDropdownOption[]>;
  remoteQueryOnOpen?: boolean;
  hasGoButton?: boolean;
  goButtonContent?: JSX.Element | string;
  onSelected?: (selectedOption: IDropdownOption) => void;
  visibleItems?: number;
  canClear?: boolean;
}

export interface IDropdownSelectState {
  filteredOptions?: IDropdownOption[];
  query?: string;
  open?: boolean;
  selectedValue?: IDropdownOption;
  selectedIndex?: number;
  remoteSearching?: boolean;
  offsetIndex?: number;
}

export class DropdownSelect extends React.Component<IDropdownSelectProps, IDropdownSelectState> {
  private timer: number;
  private itemHeight = 50;
  constructor() {
    super();
    this.state = { filteredOptions: [], query: "", open: false, selectedValue: null, selectedIndex: 0, remoteSearching: false, offsetIndex: 0 };
  }
  filterRemote(query: string, immediate?: boolean) {
    if (this.timer) {
      window.clearTimeout(this.timer);
    }
    this.timer = window.setTimeout(() => {
      this.setState({ remoteSearching: true })
      this.props.remoteQuery(query).then((filteredOptions) => {
        this.setState({ filteredOptions, remoteSearching: false })
      })
    }, immediate ? 0 : this.props.remoteThrottle || 500)

  }
  filter(query: string) {
    var q = query.toLowerCase();
    if (this.props.remoteQuery) {
      this.filterRemote(query);
    }
    else {
      if (query.length <= this.props.minimumLength || 1) {
        this.setState({ filteredOptions: this.props.options, query }, () => this.constrainIndex());
      } else {
        this.setState({ filteredOptions: _.reject(this.props.options, o => o.name.toLowerCase().indexOf(q) === -1), query }, () => this.constrainIndex());;
      }
    }

  }
  focusInput() {
    if (!this.state.open) {
      this.setState({ open: true }, () => {
        (ReactDOM.findDOMNode(this).querySelector("input") as any).focus()
        document.addEventListener("click", this, false);
        if (this.props.remoteQueryOnOpen) {
          this.filterRemote("", true);
        }
      })
    } else {
      this.setState({ open: false, query: "", filteredOptions: this.props.options || [] })
      document.removeEventListener("click", this, false);
    }
  }
  handleEvent(e) {
    if (ReactDOM.findDOMNode(this).contains(e.target)) {
      return;
    }
    this.setState({ open: false, query: "", filteredOptions: this.props.options || [] })
    document.removeEventListener("click", this, false);
  }
  componentWillMount() {
    this.setState({ filteredOptions: this.props.options || [] })
  }
  checkKey(e) {
    var currentIndex = this.state.selectedIndex;
    if (e.keyCode === 40 && this.state.filteredOptions.length !== 0) {
      // DOWN ARROW
      var offsetIndex = Math.min((this.props.visibleItems || 3) - 1, this.state.offsetIndex + 1);
      var selectedIndex = Math.min(this.state.selectedIndex + 1, this.state.filteredOptions.length - 1);
      var listElement = ReactDOM.findDOMNode(this).querySelector(".dropdown-select-list");
      this.setState({ offsetIndex });

      if (offsetIndex >= 2) {
        listElement.scrollTop = (selectedIndex - 2) * this.itemHeight;
      }

      var selectedItem = this.state.filteredOptions[selectedIndex]
      this.setState({ selectedIndex, query: selectedItem.name })
      e.preventDefault();
      return false;
    }
    if (e.keyCode === 38 && this.state.filteredOptions.length !== 0) {
      // UP ARROW
      var offsetIndex = Math.max(this.state.offsetIndex - 1, 0);
      var selectedIndex = Math.max(this.state.selectedIndex - 1, 0);
      var listElement = ReactDOM.findDOMNode(this).querySelector(".dropdown-select-list");
      this.setState({ offsetIndex });

      if (offsetIndex === 0) {
        listElement.scrollTop = (selectedIndex) * this.itemHeight;
      }

      var selectedItem = this.state.filteredOptions[selectedIndex]
      this.setState({ selectedIndex, query: selectedItem.name })
      e.preventDefault();
      return false;
    }
    if (e.keyCode === 13 && this.state.filteredOptions.length !== 0) {
      // ENTER
      var selectedValue = this.state.filteredOptions[this.state.selectedIndex];
      this.selectItem(selectedValue);
      e.preventDefault();
      return false;
    }
    this.filter((e.target as any).value)
  }
  constrainIndex() {
    if (this.state.selectedIndex > this.state.filteredOptions.length - 1) {
      this.setState({ selectedIndex: Math.max(this.state.filteredOptions.length - 1, 0) })
    }
  }
  buttonClick() {
    if (this.state.filteredOptions.length !== 0) {
      var selectedValue = this.state.filteredOptions[this.state.selectedIndex];
      if (selectedValue) {
        this.selectItem(selectedValue);
      }
    }
  }
  selectItem(selectedValue: IDropdownOption) {
    this.setState({ selectedValue, open: false, query: "", filteredOptions: this.props.options || [], offsetIndex: 0 });
    document.removeEventListener("click", this, false);
    if (this.props.onSelected) {
      this.props.onSelected(selectedValue);
    }
  }
  render() {
    return (
      <div className={`dropdown-select${this.props.className ? ` ${this.props.className}` : ''}`}>
        <Grid className="dropdown-value-display" >
          <Row>
            <Col onClick={() => this.focusInput() }>{this.state.selectedValue ? <div>{this.state.selectedValue.name}</div> : <div className="placeholder">{this.props.placeholder}</div>}</Col>
            {this.state.selectedValue && this.props.canClear && <Col fixed={true} className="clear-selected p-right-xsmall" onClick={() => this.setState({ selectedValue: null, open: false, query: "", filteredOptions: this.props.options || [] }) }><Icon icon={Icon.Icomoon.cross}/></Col> }
            {this.props.hasGoButton && <Col fixed={true}><Button text={this.props.goButtonContent || "Go"} className="bg-positive" onClick={() => this.buttonClick() }/></Col> }
          </Row>
        </Grid>
        {this.state.open &&
          <div className="dropdown-select-list-wrapper">
            <input type="text"
              value={this.state.query}
              onKeyUp={(e) => this.checkKey(e) }
              onChange={(e) => this.setState({ query: (e.target as any).value }) }
              placeholder={this.props.searchPlaceholder || "start typing to filter results..."} />
            {this.state.remoteSearching && <Icon className="spinner fg-info" icon={Icon.Icomoon.spinner2}/>}
            <div data-id="dropdown-select-list" className="dropdown-select-list" style={{ maxHeight: `${(this.props.visibleItems || 3) * this.itemHeight}` }}>
              {this.state.filteredOptions && this.state.filteredOptions.map((o, i) =>
                <div data-index={i} key={`dd-item-${i}`} className={`dd-list-item${i === this.state.selectedIndex ? ' selected' : ''}`}
                  onClick={() => this.selectItem(o) }>{o.name}</div>) }
              {this.state.filteredOptions.length === 0 && <div className="dd-list-item-no-select">{this.props.noResultsMessage || "No results..."}</div>}
            </div>
          </div>
        }
      </div>)
  }
}