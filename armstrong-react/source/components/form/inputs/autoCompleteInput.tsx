import * as React from "react";
import * as ReactDOM from "react-dom";
import * as _ from "underscore";
import { IFormInputProps } from "../form";
import { Icon } from './../../display/icon';
import { Grid, Row, Col } from './../../layout/grid';
import { Button } from './../../interaction/button';
import { DiacriticsStripper } from '../../../utilities/diacriticsStripper';
import { IDataBinder, getEventTargetAs } from "../formCore";
import { ValidationLabel } from "../validationWrapper";
import { ClassHelpers } from "../../../utilities/classNames";

export interface IAutoCompleteOption {
  id: number | string;
  name: string;
  data?: any;
  className?: string;
}

export interface IAutoCompleteInputProps extends IFormInputProps<AutoCompleteInput> {
  /** (string) CSS classname property */
  className?: string;
  /** (IAutoCompleteOption | IAutoCompleteOption[]) The current/returned value or values if multi select */
  value?: IAutoCompleteOption | IAutoCompleteOption[];
  /** (number) No query will get executed until this is met. Defaults to 1 */
  minimumLength?: number;
  /** (string) The text to use a placeholder when no value is present */
  placeholder?: string;
  /** (string) The text show when no results were found */
  noResultsMessage?: string | JSX.Element | { (value: string): string | JSX.Element };
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
    minimumLength: 1,
    validationMode: "none"
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
      if (query.length > this.props.minimumLength) {
        this.filterRemote(query);
      }
    }
    else {
      if (query.length < this.props.minimumLength) {
        this.setState({ filteredOptions: this.props.options, query }, () => this.constrainIndex());
      } else {
        this.setState({ filteredOptions: _.reject(this.props.options, o => this.match(o.name, q)), query }, () => this.constrainIndex());;
      }
    }
  }
  match(value1: string, value2: string): boolean {
    value1 = value1.toLowerCase();
    value2 = value2.toLowerCase();

    if (this.props.ignoreDiacritics) {
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
  componentWillUnmount() {
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
    let { filteredOptions, offsetIndex, selectedIndex } = this.state
    if (e.keyCode === 27) {
      this.setState({ open: false, query: "", filteredOptions: this.props.options || [] });
    }
    if (e.keyCode === 40 && filteredOptions.length !== 0) {
      // DOWN ARROW
      offsetIndex = Math.min((this.props.visibleItems || 3) - 1, offsetIndex + 1);
      selectedIndex = Math.min(selectedIndex + 1, filteredOptions.length - 1);
      const listElement = ReactDOM.findDOMNode(this).querySelector(".autocomplete-select-list");
      this.setState({ offsetIndex });

      if (offsetIndex >= 2) {
        listElement.scrollTop = (selectedIndex - 2) * this.itemHeight;
      }

      var selectedItem = filteredOptions[selectedIndex]
      this.setState({ selectedIndex, query: selectedItem.name })
      e.preventDefault();
      return false;
    }
    if (e.keyCode === 38 && filteredOptions.length !== 0) {
      // UP ARROW
      offsetIndex = Math.max(offsetIndex - 1, 0);
      selectedIndex = Math.max(selectedIndex - 1, 0);
      const listElement = ReactDOM.findDOMNode(this).querySelector(".autocomplete-select-list");
      this.setState({ offsetIndex });

      if (offsetIndex === 0) {
        listElement.scrollTop = (selectedIndex) * this.itemHeight;
      }

      const selectedItem = filteredOptions[selectedIndex]
      this.setState({ selectedIndex, query: selectedItem.name })
      e.preventDefault();
      return false;
    }
    if (e.keyCode === 13 && filteredOptions.length !== 0) {
      // ENTER
      const selectedValue = filteredOptions[selectedIndex];
      this.handleSelection(selectedValue);
      e.preventDefault();
      return false;
    }
  }
  constrainIndex() {
    const { filteredOptions, selectedIndex } = this.state

    if (selectedIndex > filteredOptions.length - 1) {
      this.setState({ selectedIndex: Math.max(filteredOptions.length - 1, 0) })
    }
  }

  private isArray<T>(itemOrArray: T | T[]): itemOrArray is T[] {
    return _.isArray(itemOrArray)
  }
  handleSelection(options: IAutoCompleteOption | IAutoCompleteOption[]) {
    if (this.props.multiSelect) {
      // Handle multiple selection
      const items: IAutoCompleteOption[] = this.isArray(options) ? options : [options]
      let ddOptions = (this.state.selectedValue as IAutoCompleteOption[]);
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
    const { filteredOptions, selectedIndex } = this.state
    if (filteredOptions.length !== 0) {
      var selectedValue = filteredOptions[selectedIndex];
      if (selectedValue) {
        this.handleSelection(selectedValue);
      }
    }
  }

  private prevFilter: string;
  checkToFilter(q: string) {
    const { query } = this.state

    this.setState({ query: q }, () => {
      if (query !== this.prevFilter) {
        this.prevFilter = query;
        this.filter(query);
      }
    })
  }

  render() {
    const validationMessage = this.props["data-validation-message"]
    const { selectedValue, showOnTop, topOffset, query, remoteSearching, filteredOptions, selectedIndex } = this.state
    const { multiSelect, className, hasGoButton, disabled, validationMode, placeholder, canClear, options, visibleItems, noResultsMessage, goButtonContent } = this.props
    const classes = ClassHelpers.classNames(
      "armstrong-input",
      "autocomplete-select",
      `${multiSelect && (selectedValue as IAutoCompleteOption[]).length !== 0 ? ' has-multiple-options' : ''}`,
      className,
      {
        "has-go-button": hasGoButton,
        "disabled": disabled,
        "show-validation": (validationMode !== "none" && validationMessage)
      }
    );
    return (
      <Grid
        title={validationMessage}
        onClick={(e) => this.focusInput(e)}
        className={classes}>
        <Row>
          <Col className="drop-down-controls">
            {(!open || multiSelect) &&
              <Grid className="autocomplete-value-display">
                <Row>
                  <Col>
                    {selectedValue &&
                      <div className="selected-value-wrapper">
                        {selectedValue && multiSelect ? (selectedValue as IAutoCompleteOption[]).map(ddo =>
                          <div key={`multi-select-item-${ddo.id}`} className={`multi-select-item multi-select-item-part${ddo.className ? ` ${ddo.className}` : ''}`} onClick={() => this.handleSelection(ddo)} >{ddo.name}<Icon className="multi-select-item-part" icon={Icon.Icomoon.cross} /></div>) : (selectedValue as IAutoCompleteOption).name}
                      </div>
                    }
                    {(multiSelect && (selectedValue as IAutoCompleteOption[]).length === 0) &&
                      <div className="placeholder">
                        &nbsp;
                      <div className="placeholder-value">{!open && (placeholder || "start typing to filter results...")}</div>
                      </div>
                    }
                    {!multiSelect && selectedValue === null &&
                      <div className="placeholder">
                        &nbsp;
                      <div className="placeholder-value">{placeholder || "start typing to filter results..."}</div>
                      </div>
                    }
                  </Col>
                  {!multiSelect && selectedValue && canClear &&
                    <Col width="auto" className="clear-selected p-right-xsmall" onClick={() => this.setState({ selectedValue: multiSelect ? [] : null, open: false, query: "", filteredOptions: options || [] })}>
                      <Icon icon={Icon.Icomoon.cross} />
                    </Col>
                  }
                  {multiSelect && (selectedValue as IAutoCompleteOption[]).length !== 0 && canClear &&
                    <Col width="auto" className="clear-selected p-right-xsmall" onClick={() => this.setState({ selectedValue: multiSelect ? [] : null, open: false, query: "", filteredOptions: options || [] })}>
                      <Icon icon={Icon.Icomoon.cross} />
                    </Col>
                  }
                </Row>
              </Grid>
            }
            {open &&
              <div className={ClassHelpers.classNames("autocomplete-select-list-wrapper", multiSelect ? 'multi-select' : '')}>
                <input type="text"
                  data-validation-message={validationMessage}
                  style={{ marginTop: `${multiSelect && showOnTop && `${topOffset}px`}` }}
                  value={query}
                  onKeyUp={(e) => this.checkKey(e)}
                  onChange={(e) => this.checkToFilter(getEventTargetAs<HTMLInputElement>(e).value)}
                  placeholder={placeholder || "start typing to filter results..."} />
                {remoteSearching && <Icon className="spinner fg-info" icon={Icon.Icomoon.spinner2} />}
                <div data-id="autocomplete-select-list"
                  className={`autocomplete-select-list${showOnTop ? ' on-top' : ''}`}
                  style={{ maxHeight: `${(visibleItems || 3) * this.itemHeight}px`, marginTop: `${topOffset}px` }}>
                  {filteredOptions && filteredOptions.map((o, i) =>
                    <div data-index={i} key={`dd-item-${i}`} className={`dd-list-item${o.className ? ` ${o.className}` : ''}${i === selectedIndex ? ' selected' : ''}${(multiSelect && _.some((selectedValue as IAutoCompleteOption[]), ddo => ddo.id === o.id)) ? ' in-selected-list' : ''}`}
                      onClick={() => this.handleSelection(o)}>{o.name}</div>)}
                  {filteredOptions.length === 0 && query && <div className="dd-list-item-no-select">{getNoResults(query, noResultsMessage)}</div>}
                </div>
              </div>
            }
          </Col>
          {hasGoButton && !multiSelect && <Col width="auto"><Button className="bg-positive" onClick={() => this.buttonClick()}>{goButtonContent || "Go"}</Button></Col>}
        </Row>
        <ValidationLabel message={validationMessage} mode={validationMode} wrapper={p => <Row height="auto"><Col {...p} /></Row>} />
      </Grid>)
  }
}

function getNoResults(search: string, message: string | JSX.Element | { (value: string): string | JSX.Element }): string | JSX.Element {
  if (!message) {
    return "No results..."
  }
  if (_.isFunction(message)) {
    return message(search)
  }
  return message;
}