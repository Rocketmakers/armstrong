import * as React from "react";
import { usePrevious } from "../../../hooks/usePrevious";
import { ClassHelpers } from "../../../utilities/classHelpers";
import { KeyCodes } from "../../../utilities/keyCodes";
import { utils } from "../../../utilities/utils";
import { Icon } from "../../display/icon";
import { Button } from "../../interaction/button";
import { Col, Grid, Row } from "../../layout/grid";
import { DataValidationMessage, DataValidationMode, getEventTargetAs } from "../formCore";
import { ValidationLabel } from "../validationWrapper";
import { IAutoCompleteOption, IAutoCompleteProps } from "./autoCompleteOptionHooks";

type MessageComponent = React.ReactNode | ((value: string) => React.ReactNode)

export const AutoCompleteSingleInput: React.FunctionComponent<IAutoCompleteProps<IAutoCompleteOption>> = props => {
  const { filter, onFilterChange, options, value, onValueChange, className, visibleItems, hasGoButton, disabled, placeholder, canClear, isSearching, noResultsMessage, goButtonContent } = props

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
    if ((!e) || (!open && !getEventTargetAs(e).classList.contains("clear-selected"))) {
      setOpen(true)
      setShowOnTop(shouldShowOnTop())
      document.addEventListener("click", handleEvent, false);
    }
  }

  function handleSelection(option: IAutoCompleteOption) {
    setOpen(false)
    onFilterChange("")
    setOffsetIndex(0)
    if (onValueChange) {
      onValueChange(option);
    }
    document.removeEventListener("click", handleEvent, false);
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
    const offset = -inputRect.height;
    setTopOffset(onTop ? offset : 0);
    return onTop;
  }

  function handleEvent(e: Event) {
    if (root.current && root.current.contains(e.target as Node)) {
      return;
    }
    setOpen(false)
    onFilterChange("")
    document.removeEventListener("click", handleEvent, false);
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

  function getNoResults(search: string, message: MessageComponent): React.ReactNode {
    if (!message) {
      return "No results..."
    }
    if (utils.object.isFunction(message)) {
      return message(search)
    }
    return message;
  }

  function checkToFilter(query: string) {
    if (onFilterChange) {
      onFilterChange(query);
    }
  }

  function buttonClick() {
    if (options.length !== 0) {
      const selectedValue = options[selectedIndex];
      if (selectedValue) {
        handleSelection(selectedValue);
      }
    }
  }

  const validationMessage = DataValidationMessage.get(props)
  const validationMode = DataValidationMode.get(props)

  const classes = ClassHelpers.classNames(
    "armstrong-input",
    "autocomplete-select",
    className,
    {
      "has-go-button": hasGoButton,
      "disabled": disabled,
      "show-validation": (validationMode !== "none" && validationMessage),
      "text-input-icon-left": props.leftIcon !== undefined
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
          {props.leftIcon && <Icon className="left-icon" icon={props.leftIcon} />}
          {!open &&
            <Grid className="autocomplete-value-display">
              <Row>
                <Col>
                  {utils.object.isNullOrUndefined(value) ?
                    <div className="placeholder">
                      &nbsp;
                      <div className="placeholder-value">{placeholder}</div>
                    </div> :
                    <div className="selected-value-wrapper">
                      {value && value.name}
                    </div>
                  }
                </Col>
                {value && canClear &&
                  <Col width="auto" className="clear-selected p-right-xsmall" onClick={() => {
                    onValueChange(null);
                    onFilterChange("");
                    setOpen(false);
                  }}>
                    <Icon icon={Icon.Icomoon.cross} />
                  </Col>
                }
              </Row>
            </Grid>
          }
          {open &&
            <div className={ClassHelpers.classNames("autocomplete-select-list-wrapper")}>
              <input type="text"
                ref={input}
                {...DataValidationMessage.spread(validationMessage)}
                value={filter}
                onKeyUp={e => checkKey(e)}
                onChange={e => checkToFilter(getEventTargetAs<HTMLInputElement>(e).value)}
                placeholder={placeholder} />
              {isSearching && <Icon className="spinner fg-info" icon={Icon.Icomoon.spinner2} />}
              <div ref={autocompleteSelectList} data-id="autocomplete-select-list"
                className={`autocomplete-select-list${showOnTop ? " on-top" : ""}`}
                style={{ maxHeight: `${(visibleItems || 3) * itemHeight}px`, marginTop: `${topOffset}px` }}>
                {options && options.map((o, i) =>
                  <div data-index={i} key={`dd-item-${i}`} style={o.style} className={`dd-list-item${o.className ? ` ${o.className}` : ""}${i === selectedIndex ? " selected" : ""}`}
                    onClick={() => handleSelection(o)}>{o.prefixElement}{o.name}</div>)}
                {options.length === 0 && filter && <div className="dd-list-item-no-select">{getNoResults(filter, noResultsMessage)}</div>}
              </div>
            </div>
          }
        </Col>
        {hasGoButton && <Col width="auto"><Button className="bg-positive" onClick={() => buttonClick()}>{goButtonContent || "Go"}</Button></Col>}
      </Row>
      <ValidationLabel message={validationMessage} mode={validationMode} wrapper={p => <Row height="auto"><Col {...p} /></Row>} />
    </Grid>
  )
}

AutoCompleteSingleInput.defaultProps = {
  placeholder: "start typing to filter results...",
}
