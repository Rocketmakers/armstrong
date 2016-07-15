import * as React from "react";
import * as ReactDOM from "react-dom";
import * as _ from "underscore";
import { Icon } from './../display/icon';
import { Grid, Row, Col } from './../layout/grid';
import { Button } from './../interaction/button';

export interface IDropdownOption {
  id: number;
  name: string;
  data?: any;
}

export interface IDropdownSelectProps extends React.Props<DropdownSelect> {
  className?: string;
  value?: IDropdownOption | IDropdownOption[];
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
  onSelected?: (selectedOption: IDropdownOption | IDropdownOption[]) => void;
  visibleItems?: number;
  canClear?: boolean;
  disabled?: boolean;
  multiSelect?: boolean;
}

export interface IDropdownSelectState {
  filteredOptions?: IDropdownOption[];
  query?: string;
  open?: boolean;
  selectedValue?: IDropdownOption | IDropdownOption[];
  selectedIndex?: number;
  remoteSearching?: boolean;
  offsetIndex?: number;
}

export class DropdownSelect extends React.Component<IDropdownSelectProps, IDropdownSelectState> {
  private timer: number;
  // drive this through css ideally. Currently fixed height plus border (50 + 2px)
  private itemHeight = 52;
  static defaultProps = {
    remoteThrottle: 500,
    minimumLength: 1
  }
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
    }, immediate ? 0 : this.props.remoteThrottle)

  }
  filter(query: string) {
    var q = query.toLowerCase();
    if (this.props.remoteQuery) {
      this.filterRemote(query);
    }
    else {
      if (query.length < this.props.minimumLength) {
        this.setState({ filteredOptions: this.props.options, query }, () => this.constrainIndex());
      } else {
        this.setState({ filteredOptions: _.reject(this.props.options, o => o.name.toLowerCase().indexOf(q) === -1), query }, () => this.constrainIndex());;
      }
    }

  }
  focusInput(e) {
    if (!this.state.open && !e.target.classList.contains("clear-selected")) {
      this.setState({ open: true }, () => {
        (ReactDOM.findDOMNode(this).querySelector("input") as any).focus()
        document.addEventListener("click", this, false);
        if (this.props.remoteQueryOnOpen) {
          this.filterRemote("", true);
        }
      })
    } else {
      // this.setState({ open: false, query: "", filteredOptions: this.props.options || [] })
      // document.removeEventListener("click", this, false);
    }
  }
  handleEvent(e) {
    // The second or check here is to allow for handling of deletion clicks on multi-select items after they have been removed from the dom
    if (ReactDOM.findDOMNode(this).contains(e.target) || (e.target as HTMLDivElement).classList.contains("multi-select-item-part")) {
      return;
    }
    this.setState({ open: false, query: "", filteredOptions: this.props.options || [] })
    document.removeEventListener("click", this, false);
  }
  componentWillMount() {
    let initialValue;
    if (this.props.value) {
      initialValue = this.props.value;
      if (this.props.multiSelect && !_.isArray(this.props.value)) {
        initialValue = [this.props.value];
      }
    } else {
      initialValue = this.props.multiSelect ? [] : null;
    }
    this.setState({ filteredOptions: this.props.options || [], selectedValue: initialValue })
  }
  componentWillReceiveProps(newProps: IDropdownSelectProps) {
    if (newProps.value) {
      this.handleSelection(newProps.value)
    }
  }
  checkKey(e) {
    var currentIndex = this.state.selectedIndex;
    if (e.keyCode === 27) {
      this.setState({ open: false, query: "", filteredOptions: this.props.options || [] });
    }
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
      this.handleSelection(selectedValue);
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
  handleSelection(options: IDropdownOption | IDropdownOption[]) {
    if (this.props.multiSelect) {
      // Handle multiple selection
      var newOptions = options;
      if (!_.isArray(options)) {
        newOptions = [options];
      }
      var ddOptions = (this.state.selectedValue as IDropdownOption[]);
      (newOptions as IDropdownOption[]).forEach(option => {
        if (ddOptions.length !== 0 && _.some(ddOptions, ddo => ddo.id === option.id)) {
          // Remove
          ddOptions = _.reject(ddOptions, ddo => ddo.id === option.id);
        }
        else {
          // Add
          ddOptions.push(option)
        }
      })

      this.setState({ selectedValue: ddOptions })
      if (this.props.onSelected) {
        this.props.onSelected(ddOptions);
      }
      (ReactDOM.findDOMNode(this).querySelector("input") as any).focus()
    } else {
      let option = options as IDropdownOption;
      // Handle single selection
      this.setState({ selectedValue: option, open: false, query: "", filteredOptions: this.props.options || [], offsetIndex: 0 });
      if (this.props.onSelected) {
        this.props.onSelected(option);
      }
      document.removeEventListener("click", this, false);
    }
  }
  buttonClick() {
    if (this.state.filteredOptions.length !== 0) {
      var selectedValue = this.state.filteredOptions[this.state.selectedIndex];
      if (selectedValue) {
        this.handleSelection(selectedValue);
      }
    }
  }
  render() {
    return (
      <Grid
        onClick={(e) => this.focusInput(e) }
        className={`dropdown-select${this.props.className ? ` ${this.props.className}` : ''}${this.props.disabled ? ' disabled' : ''}${this.props.hasGoButton && !this.props.multiSelect ? ' has-go-button' : ''}${this.props.multiSelect && (this.state.selectedValue as IDropdownOption[]).length !== 0 ? ' has-multiple-options' : ''}`}>
        <Row>
          <Col className="drop-down-controls">
            {(!this.state.open || this.props.multiSelect) && <Grid className="dropdown-value-display" >
              <Row>
                <Col>
                  {this.state.selectedValue &&
                    <div className="selected-value-wrapper">
                      {this.props.multiSelect ? (this.state.selectedValue as IDropdownOption[]).map(ddo =>
                        <div key={`multi-select-item-${ddo.id}`} className="multi-select-item multi-select-item-part" onClick={() => this.handleSelection(ddo) } >{ddo.name}<Icon className="multi-select-item-part" icon={Icon.Icomoon.cross}/></div>) : (this.state.selectedValue as IDropdownOption).name}
                    </div>
                  }
                  { (this.props.multiSelect && (this.state.selectedValue as IDropdownOption[]).length === 0) &&
                    <div className="placeholder">{this.props.placeholder || "start typing to filter results..."}</div>
                  }
                  { !this.props.multiSelect && this.state.selectedValue === null &&
                    <div className="placeholder">{this.props.placeholder || "start typing to filter results..."}</div>
                  }
                </Col>
                {!this.props.multiSelect && this.state.selectedValue && this.props.canClear &&
                  <Col fixed={true} className="clear-selected p-right-xsmall" onClick={() => this.setState({ selectedValue: this.props.multiSelect ? [] : null, open: false, query: "", filteredOptions: this.props.options || [] }) }>
                    <Icon icon={Icon.Icomoon.cross}/>
                  </Col>
                }
                {this.props.multiSelect && (this.state.selectedValue as IDropdownOption[]).length !== 0 && this.props.canClear &&
                  <Col fixed={true} className="clear-selected p-right-xsmall" onClick={() => this.setState({ selectedValue: this.props.multiSelect ? [] : null, open: false, query: "", filteredOptions: this.props.options || [] }) }>
                    <Icon icon={Icon.Icomoon.cross}/>
                  </Col>
                }
              </Row>
            </Grid>
            }
            {this.state.open &&
              <div className="dropdown-select-list-wrapper">
                <input type="text"
                  value={this.state.query}
                  onKeyUp={(e) => this.checkKey(e) }
                  onChange={(e) => this.setState({ query: (e.target as any).value }) }
                  placeholder={this.props.placeholder || "start typing to filter results..."} />
                {this.state.remoteSearching && <Icon className="spinner fg-info" icon={Icon.Icomoon.spinner2}/>}
                <div data-id="dropdown-select-list" className="dropdown-select-list" style={{ maxHeight: `${(this.props.visibleItems || 3) * this.itemHeight}px` }}>
                  {this.state.filteredOptions && this.state.filteredOptions.map((o, i) =>
                    <div data-index={i} key={`dd-item-${i}`} className={`dd-list-item${i === this.state.selectedIndex ? ' selected' : ''}${(this.props.multiSelect && _.some((this.state.selectedValue as IDropdownOption[]), ddo => ddo.id === o.id)) ? ' in-selected-list' : ''}`}
                      onClick={() => this.handleSelection(o) }>{o.name}</div>) }
                  {this.state.filteredOptions.length === 0 && this.state.query && <div className="dd-list-item-no-select">{this.props.noResultsMessage || "No results..."}</div>}
                </div>
              </div>
            }
          </Col>
          {this.props.hasGoButton && !this.props.multiSelect && <Col fixed={true}><Button text={this.props.goButtonContent || "Go"} className="bg-positive" onClick={() => this.buttonClick() }/></Col> }
        </Row>
      </Grid>)
  }
}