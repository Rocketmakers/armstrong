import * as React from "react";
import { usePrevious } from "../../../hooks/usePrevious";
import { ClassHelpers } from "../../../utilities/classHelpers";
import { KeyCodes } from "../../../utilities/keyCodes";
import { utils } from "../../../utilities/utils";
import { Icon } from "../../display/icon";
import { Col, Grid, Row } from "../../layout/grid";
import { DataValidationMessage, DataValidationMode, getEventTargetAs } from "../formCore";
import { ValidationLabel } from "../validationWrapper";
import { IAutoCompleteOption, IAutoCompleteProps } from "./autoCompleteOptionHooks";

type MessageComponent = React.ReactNode | ((value: string) => React.ReactNode)

// export interface IAutoCompleteOption {
//   id: number | string;
//   name: string;
//   data?: any;
//   className?: string;
//   style?: React.CSSProperties;
//   prefixElement?: React.ReactNode;
// }

export const AutoCompleteMultiInput: React.FunctionComponent<IAutoCompleteProps<IAutoCompleteOption[]>> = props => {
  const { filter, onFilterChange, options, value, onValueChange, visibleItems, className, hasGoButton, disabled, placeholder, canClear, isSearching, noResultsMessage } = props

  const autocompleteSelectList = React.useRef<HTMLDivElement>()
  const input = React.useRef<HTMLInputElement>()
  const root = React.useRef<HTMLDivElement>()

  const [open, setOpen] = React.useState(false)
  const [showOnTop, setShowOnTop] = React.useState(false)
  const [topOffset, setTopOffset] = React.useState(-35)
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [offsetIndex, setOffsetIndex] = React.useState(0)
  const itemHeight = 52

  const previousOpen = usePrevious(open)
  React.useEffect(() => {
    if (previousOpen !== open) {
      if (open) {
        if (input.current) {
          input.current.focus()
        }
      }
    }
  }, [open])

  function focusInput(e: React.MouseEvent<any>) {
    if (!e) {
      handleFocus();
    } else if (!open && !getEventTargetAs(e).classList.contains("clear-selected")) {
      handleFocus();
    }
  }

  function shouldShowOnTop(): boolean {
    const height = (itemHeight * 3) + 50;
    if (!root.current) {
      return
    }
    const inputRect = root.current.getBoundingClientRect();
    const remainingSpace = window.innerHeight - inputRect.bottom;
    let onTop = false;
    if (remainingSpace < height) {
      onTop = true;
    } else {
      onTop = false;
    }
    const offset = -inputRect.height * 2;
    setTopOffset(onTop ? offset : inputRect.height);
    return onTop;
  }

  function handleFocus() {
    setOpen(true)
    setShowOnTop(shouldShowOnTop())
    document.addEventListener("click", handleEvent, false);
  }

  function handleEvent(e: Event) {
    if ((e.target as HTMLDivElement).classList.contains("multi-select-item-part")) {
      return
    }

    if (root.current && root.current.contains(e.target as Node)) {
      return;
    }
    setOpen(false)
    onFilterChange("")
    document.removeEventListener("click", handleEvent, false);
  }

  function handleSelection(selected: IAutoCompleteOption) {
    if (onValueChange) {
      if (utils.array.some(value, ddo => ddo.id === selected.id)) {
        onValueChange(utils.array.reject(value, ddo => ddo.id === selected.id));
      } else {
        onValueChange([...value, selected])
      }
    }

    if (input.current) {
      input.current.focus()
    }
  }

  function checkKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.keyCode === KeyCodes.escape) {
      setOpen(false)
      onFilterChange("")
    }

    if (e.keyCode === KeyCodes.downArrow && options.length !== 0) {
      if (!autocompleteSelectList.current) {
        return
      }

      const offsetIdx = Math.min((visibleItems || 3) - 1, offsetIndex + 1);
      const selectedIdx = Math.min(selectedIndex + 1, options.length - 1);

      setOffsetIndex(offsetIdx);

      if (offsetIdx >= 2) {
        autocompleteSelectList.current.scrollTop = (selectedIdx - 2) * itemHeight;
      }

      const selectedItem = options[selectedIdx]
      setSelectedIndex(selectedIdx)
      onFilterChange(selectedItem.name)
      e.preventDefault();
      return false;
    }
    if (e.keyCode === KeyCodes.upArrow && options.length !== 0) {
      if (!autocompleteSelectList.current) {
        return
      }

      const offsetIdx = Math.max(offsetIndex - 1, 0);
      const selectedIdx = Math.max(selectedIndex - 1, 0);
      setOffsetIndex(offsetIdx);

      if (offsetIdx === 0) {
        autocompleteSelectList.current.scrollTop = (selectedIdx) * itemHeight;
      }

      const selectedItem = options[selectedIdx]
      setSelectedIndex(selectedIdx)
      onFilterChange(selectedItem.name)
      e.preventDefault();
      return false;
    }
    if (e.keyCode === KeyCodes.enter && options.length !== 0) {
      const selectedValue = options[selectedIndex];
      handleSelection(selectedValue);
      e.preventDefault();
      return false;
    }
  }

  function checkToFilter(query: string) {
    if (onFilterChange) {
      onFilterChange(query);
    }
  }

  function getNoResults(search: string, message: MessageComponent): React.ReactNode {
    if (!message) {
      return "No results..."
    }
    if (utils.object.isFunction(message)) {
      return message(search)
    }
    return message;
  }

  const validationMessage = DataValidationMessage.get(props)
  const validationMode = DataValidationMode.get(props)

  const classes = ClassHelpers.classNames(
    "armstrong-input",
    "autocomplete-select",
    className,
    {
      "has-multiple-options": value.length !== 0,
      "has-go-button": hasGoButton,
      "disabled": disabled,
      "show-validation": (validationMode !== "none" && validationMessage),
    },
  );

  return (
    <Grid
      ref={root}
      title={validationMessage}
      onClick={e => focusInput(e)}
      className={classes}>
      <Row>
        <Col className="drop-down-controls">
          <Grid className="autocomplete-value-display">
            <Row>
              <Col>
                {value &&
                  <div className="selected-value-wrapper">
                    {value.map(ddo => <div key={`multi-select-item-${ddo.id}`} className={`multi-select-item multi-select-item-part${ddo.className ? ` ${ddo.className}` : ""}`} onClick={() => handleSelection(ddo)} >{ddo.name}<Icon className="multi-select-item-part" icon={Icon.Icomoon.cross} /></div>)}
                  </div>
                }
                {value.length === 0 &&
                  <div className="placeholder">
                    &nbsp;
                      <div className="placeholder-value">{!open && placeholder}</div>
                  </div>
                }
              </Col>
              {value.length !== 0 && canClear &&
                <Col width="auto" className="clear-selected p-right-xsmall" onClick={() => {
                  onValueChange([]);
                  onFilterChange("");
                  setOpen(false);
                }}>
                  <Icon icon={Icon.Icomoon.cross} />
                </Col>
              }
            </Row>
          </Grid>

          {open &&
            <div className={ClassHelpers.classNames("autocomplete-select-list-wrapper", "multi-select")}>
              <input type="text"
                {...DataValidationMessage.spread(validationMessage)}
                ref={input}
                style={{ marginTop: `${showOnTop && `${topOffset}px`}` }}
                value={filter}
                onKeyUp={e => checkKey(e)}
                onChange={e => checkToFilter(getEventTargetAs<HTMLInputElement>(e).value)}
                placeholder={placeholder} />
              {isSearching && <Icon className="spinner fg-info" icon={Icon.Icomoon.spinner2} />}
              <div data-id="autocomplete-select-list"
                className={`autocomplete-select-list${showOnTop ? " on-top" : ""}`}
                style={{ maxHeight: `${(visibleItems || 3) * itemHeight}px`, marginTop: `${topOffset}px` }}>
                {options && options.map((o, i) =>
                  <div data-index={i} key={`dd-item-${i}`} style={o.style} className={`dd-list-item${o.className ? ` ${o.className}` : ""}${i === selectedIndex ? " selected" : ""}${(utils.array.some(value, ddo => ddo.id === o.id)) ? " in-selected-list" : ""}`}
                    onClick={() => handleSelection(o)}>{o.prefixElement}{o.name}</div>)}
                {options.length === 0 && filter && <div className="dd-list-item-no-select">{getNoResults(filter, noResultsMessage)}</div>}
              </div>
            </div>
          }
        </Col>
      </Row>
      <ValidationLabel message={validationMessage} mode={validationMode} wrapper={p => <Row height="auto"><Col {...p} /></Row>} />
    </Grid>)
}

AutoCompleteMultiInput.defaultProps = {
  placeholder: "start typing to filter results...",
}
