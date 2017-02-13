import * as React from "react";
import * as ReactDOM from "react-dom";
import * as _ from "underscore";
import * as classNames from "classnames";
import { Icon } from './../../display/icon';
import { Grid, Row, Col } from './../../layout/grid';
import { Button } from './../../interaction/button';
import { DiacriticsStripper } from '../../../utilities/diacriticsStripper';
import {IDataBinder,getEventTargetAs} from "../formCore";
//import {Promise} from "es6-promise";

export interface IAutoCompleteOption {
  id: number | string;
  name: string;
  data?: any;
  className?: string;
}

export interface IAutoCompleteInputProps extends React.Props<AutoCompleteInput> {
  /** (string) CSS classname property */
  className?: string;
  /** (IAutoCompleteOption | IAutoCompleteOption[]) The current/returned value or values if multi select */
  value?: IAutoCompleteOption | IAutoCompleteOption[];
  /** (number) No query will get executed until this is met. Defaults to 1 */
  minimumLength?: number;
  /** (string) The text to use a placeholder when no value is present */
  placeholder?: string;
  /** (string) The text show when no results were found */
  noResultsMessage?: string;
  /** (IAutoCompleteOption[]) If you are using local rather than remote options, specify them here */
  options?: IAutoCompleteOption[];
  /** (number) How long to wait after every key press before executing a remote query */
  remoteThrottle?: number;
  /** ((string) => Promise<IAutoCompleteOption[]>) A promise and mapping to IAutoCompleteOption to handle querying remote data */
  remoteQuery?: (query: string) => Promise<IAutoCompleteOption[]>;
  /** (boolean) If set to true, a blank query will be executed as soon as the control is focused */
  remoteQueryOnOpen?: boolean;
  /** (boolean) If set to true, a button will appear along side the box which selects the currently hilighted option on click */
  hasGoButton?: boolean;
  /** (React.ReactElement<any> | string) The content of the go button. Can be text or any element */
  goButtonContent?: React.ReactElement<any> | string;
  /** ((IAutoCompleteOption | IAutoCompleteOption[]) => void) Fires when the selection is changed. Returns a single value or an array dependent on multiselect */
  onSelected?: (selectedOption: IAutoCompleteOption | IAutoCompleteOption[]) => void;
  /** (number) How many items to show before scrolling. Defaults to 3 */
  visibleItems?: number;
  /** (boolean) If true, shows an X icon to clear selection */
  canClear?: boolean;
  /** (boolean) Wether the control is disabled */
  disabled?: boolean;
  /** (boolean) Wether the control should function like a tagging control, returning an array of options or a single select, returning one option */
  multiSelect?: boolean;
  /** (boolean) wether or not to strip diacritical marks */
  ignoreDiacritics?: boolean;
}

export interface IAutoCompleteInputState {
  filteredOptions?: IAutoCompleteOption[];
  query?: string;
  open?: boolean;
  selectedValue?: IAutoCompleteOption | IAutoCompleteOption[];
  selectedIndex?: number;
  remoteSearching?: boolean;
  offsetIndex?: number;
  showOnTop?: boolean;
  topOffset?: number;
}

export class AutoCompleteInput extends React.Component<IAutoCompleteInputProps, IAutoCompleteInputState> {
  private timer: number;
  private diacriticsStripper: DiacriticsStripper;
  // drive this through css ideally. Currently fixed height plus border (50 + 2px)
  private itemHeight = 52;
  static defaultProps = {
    remoteThrottle: 500,
    minimumLength: 1
  }
  constructor(props: IAutoCompleteInputProps) {
    super(props);
    this.state = {
      filteredOptions: [],
      query: "",
      open: false,
      selectedValue: props.multiSelect ? [] : null,
      selectedIndex: 0,
      remoteSearching: false,
      offsetIndex: 0,
      showOnTop: false,
      topOffset: -35
    };
    this.diacriticsStripper = new DiacriticsStripper();
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
        this.setState({ filteredOptions: _.reject(this.props.options, o => this.match(o.name, q)), query }, () => this.constrainIndex());;
      }
    }
  }
  match(value1: string, value2: string) : boolean{
    value1 = value1.toLowerCase();
    value2 = value2.toLowerCase();

    if (this.props.ignoreDiacritics){
      value1 = this.diacriticsStripper.removeDiacritics(value1);
    }

    return value1.toLowerCase().indexOf(value2) === -1;
    // if (this.props.stripDiacritics){
    // }

  }
  focusInput(e: React.MouseEvent<any>) {
    if (!this.state.open && !getEventTargetAs(e).classList.contains("clear-selected")) {
      this.setState({ open: true, showOnTop: this.shouldShowOnTop() }, () => {
        (ReactDOM.findDOMNode(this).querySelector("input") as any).focus()
        document.addEventListener("click", this, false);
        if (this.props.remoteQueryOnOpen) {
          this.filterRemote("", true);
        }
      })
    }
  }

  handleEvent(e: Event) {
    // The second or check here is to allow for handling of deletion clicks on multi-select items after they have been removed from the dom
    if (ReactDOM.findDOMNode(this).contains(e.target as Node) || (e.target as HTMLDivElement).classList.contains("multi-select-item-part")) {
      return;
    }
    this.setState({ open: false, query: "", filteredOptions: this.props.options || [] })
    document.removeEventListener("click", this, false);
  }
  componentWillUnmount(){
     document.removeEventListener("click", this, false);
  }

  componentWillMount() {
    let selectedValue: any = this.props.multiSelect ? [] : null;
    if (this.props.value) {
      if (this.props.multiSelect) {
        if (_.isArray(this.props.value)) {
          selectedValue = this.props.value;
        } else {
          selectedValue = [this.props.value];
        }
      } else {
        selectedValue = this.props.value;
      }
    }
    this.setState({ filteredOptions: this.props.options || [], selectedValue })
  }
  componentWillReceiveProps(newProps: IAutoCompleteInputProps) {
    if (this.props.multiSelect) {
      var newMultiValue = newProps.value as IAutoCompleteOption[];
      var oldMultiValue = this.state.selectedValue as IAutoCompleteOption[];

      if (oldMultiValue.length === 0 || !_.isEqual(newMultiValue.map(v => v.id), oldMultiValue.map(v => v.id))) {
        this.setState({ selectedValue: newMultiValue || [] })
      }
    } else {
      var newSingleValue = newProps.value as IAutoCompleteOption;
      var oldSingleValue = this.state.selectedValue as IAutoCompleteOption;
      if (!newSingleValue) {
        if (oldSingleValue != newSingleValue) {
          this.setState({ selectedValue: null })
        }
      }
      else if (!oldSingleValue || newSingleValue.id !== oldSingleValue.id) {
        this.setState({ selectedValue: newSingleValue })
      }
    }
  }

  shouldShowOnTop(): boolean {
    const height = (this.itemHeight * 3) + 50;
    const inputRect = ReactDOM.findDOMNode(this).getBoundingClientRect();
    const remainingSpace = window.innerHeight - inputRect.bottom;
    let shouldShowOnTop = false;
    if (remainingSpace < height) {
      shouldShowOnTop = true;
    } else {
      shouldShowOnTop = false;
    }
    let offset = this.props.multiSelect ? -inputRect.height * 2 : -inputRect.height;
    let additionalOffset = 0;
    if (this.props.multiSelect && !shouldShowOnTop) {
      additionalOffset = inputRect.height;
    }
    this.setState({ topOffset: shouldShowOnTop ? offset : additionalOffset });

    return shouldShowOnTop;
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
      var listElement = ReactDOM.findDOMNode(this).querySelector(".autocomplete-select-list");
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
      var listElement = ReactDOM.findDOMNode(this).querySelector(".autocomplete-select-list");
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
  }
  constrainIndex() {
    if (this.state.selectedIndex > this.state.filteredOptions.length - 1) {
      this.setState({ selectedIndex: Math.max(this.state.filteredOptions.length - 1, 0) })
    }
  }

  private isArray<T>(itemOrArray: T | T[]): itemOrArray is T[] {
    return _.isArray(itemOrArray)
  }
  handleSelection(options: IAutoCompleteOption | IAutoCompleteOption[]) {
    if (this.props.multiSelect) {
      // Handle multiple selection
      const items: IAutoCompleteOption[] = this.isArray(options) ? options : [options]
      var ddOptions = (this.state.selectedValue as IAutoCompleteOption[]);
      items.forEach(option => {
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
      let input = ReactDOM.findDOMNode(this).querySelector("input") as HTMLInputElement;
      if (input) {
        input.focus()
      }
    } else {
      let option = options as IAutoCompleteOption;
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

  private prevFilter: string;
  checkToFilter(query: string) {
    this.setState({ query }, () => {
      if (this.state.query !== this.prevFilter) {
        this.prevFilter = this.state.query;
        this.filter(this.state.query);
      }
    })
  }
  render() {
    return (
      <Grid
        data-validation-message={this.props["data-validation-message"]}
        onClick={(e) => this.focusInput(e)}
        className={`autocomplete-select${this.props.className ? ` ${this.props.className}` : ''}${this.props.disabled ? ' disabled' : ''}${this.props.hasGoButton && !this.props.multiSelect ? ' has-go-button' : ''}${this.props.multiSelect && (this.state.selectedValue as IAutoCompleteOption[]).length !== 0 ? ' has-multiple-options' : ''}`}>
        <Row>
          <Col className="drop-down-controls">
            {(!this.state.open || this.props.multiSelect) && <Grid className="autocomplete-value-display" >
              <Row>
                <Col>
                  {this.state.selectedValue &&
                    <div className="selected-value-wrapper">
                      {this.state.selectedValue && this.props.multiSelect ? (this.state.selectedValue as IAutoCompleteOption[]).map(ddo =>
                        <div key={`multi-select-item-${ddo.id}`} className={`multi-select-item multi-select-item-part${ddo.className ? ` ${ddo.className}` : ''}`} onClick={() => this.handleSelection(ddo)} >{ddo.name}<Icon className="multi-select-item-part" icon={Icon.Icomoon.cross} /></div>) : (this.state.selectedValue as IAutoCompleteOption).name}
                    </div>
                  }
                  {(this.props.multiSelect && (this.state.selectedValue as IAutoCompleteOption[]).length === 0) &&
                    <div className="placeholder">
                      &nbsp;
                      <div className="placeholder-value">{!this.state.open && (this.props.placeholder || "start typing to filter results...")}</div>
                    </div>
                  }
                  {!this.props.multiSelect && this.state.selectedValue === null &&
                    <div className="placeholder">
                      &nbsp;
                      <div className="placeholder-value">{this.props.placeholder || "start typing to filter results..."}</div>
                    </div>
                  }
                </Col>
                {!this.props.multiSelect && this.state.selectedValue && this.props.canClear &&
                  <Col width="auto" className="clear-selected p-right-xsmall" onClick={() => this.setState({ selectedValue: this.props.multiSelect ? [] : null, open: false, query: "", filteredOptions: this.props.options || [] })}>
                    <Icon icon={Icon.Icomoon.cross} />
                  </Col>
                }
                {this.props.multiSelect && (this.state.selectedValue as IAutoCompleteOption[]).length !== 0 && this.props.canClear &&
                  <Col width="auto" className="clear-selected p-right-xsmall" onClick={() => this.setState({ selectedValue: this.props.multiSelect ? [] : null, open: false, query: "", filteredOptions: this.props.options || [] })}>
                    <Icon icon={Icon.Icomoon.cross} />
                  </Col>
                }
              </Row>
            </Grid>
            }
            {this.state.open &&
              <div className={classNames("autocomplete-select-list-wrapper", this.props.multiSelect ? 'multi-select' : '')}>
                <input type="text"
                  style={{ marginTop: `${this.props.multiSelect && this.state.showOnTop && `${this.state.topOffset}px`}` }}
                  value={this.state.query}
                  onKeyUp={(e) => this.checkKey(e)}
                  onChange={(e) => this.checkToFilter(getEventTargetAs<HTMLInputElement>(e).value)}
                  placeholder={this.props.placeholder || "start typing to filter results..."} />
                {this.state.remoteSearching && <Icon className="spinner fg-info" icon={Icon.Icomoon.spinner2} />}
                <div data-id="autocomplete-select-list"
                  className={`autocomplete-select-list${this.state.showOnTop ? ' on-top' : ''}`}
                  style={{ maxHeight: `${(this.props.visibleItems || 3) * this.itemHeight}px`, marginTop: `${this.state.topOffset}px` }}>
                  {this.state.filteredOptions && this.state.filteredOptions.map((o, i) =>
                    <div data-index={i} key={`dd-item-${i}`} className={`dd-list-item${i === this.state.selectedIndex ? ' selected' : ''}${(this.props.multiSelect && _.some((this.state.selectedValue as IAutoCompleteOption[]), ddo => ddo.id === o.id)) ? ' in-selected-list' : ''}`}
                      onClick={() => this.handleSelection(o)}>{o.name}</div>)}
                  {this.state.filteredOptions.length === 0 && this.state.query && <div className="dd-list-item-no-select">{this.props.noResultsMessage || "No results..."}</div>}
                </div>
              </div>
            }
          </Col>
          {this.props.hasGoButton && !this.props.multiSelect && <Col width="auto"><Button className="bg-positive" onClick={() => this.buttonClick()}>{this.props.goButtonContent || "Go"}</Button></Col>}
        </Row>
      </Grid>)
  }
}
