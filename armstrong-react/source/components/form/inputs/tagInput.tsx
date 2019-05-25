import * as React from "react";
import { useDidUpdateEffect } from "../../../hooks/useDidUpdateEffect";
import { ClassHelpers } from "../../../utilities/classHelpers";
import { utils } from "../../../utilities/utils";
import { DataValidationMessage, DataValidationMode } from "../formCore";
import { ValidationLabel } from "../validationWrapper";
import { Icon } from "./../../display/icon";

export interface ITagInput {
  focus: () => void
  blur: () => void
  select: () => void
}

export interface ITagInputProps extends React.HTMLAttributes<HTMLElement> {
  suggestions?: string[];
  onTagsChange?: (tags: string[]) => void;
  value?: string[];
};

function makeComparison(value: string) {
  return value ? value.trim().toLowerCase() : ""
}

const TagInputRef: React.RefForwardingComponent<ITagInput, ITagInputProps> = (props, ref) => {

  const { value, className, onTagsChange } = props

  const [suggestionIndex, setSuggestionIndex] = React.useState(-1)
  const [tags, setTags] = React.useState<string[]>(value || [])
  const [suggestions, setSuggestions] = React.useState<string[]>([])

  const input = React.useRef<HTMLInputElement>(undefined);
  const refCallback = React.useCallback<() => ITagInput>(() => {
    return {
      focus() {
        if (input.current) {
          input.current.focus()
        }
      },
      blur() {
        if (input.current) {
          input.current.blur()
        }
      },
      select() {
        if (input.current) {
          input.current.select()
        }
      },
    }
  }, [input.current])

  React.useImperativeHandle(ref, refCallback, [refCallback])

  useDidUpdateEffect(() => {
    const newTags = value || []
    if (utils.object.isEqual(tags, newTags)) {
      return
    }
    notifyTagsChange(newTags)
  }, [value])

  const filterSuggestions = React.useCallback((newValue: string) => {
    newValue = makeComparison(newValue)
    if (!newValue) {
      return []
    }

    const filteredSuggestions = utils.array.filter(props.suggestions, s => makeComparison(s).lastIndexOf(newValue, 0) === 0);
    return utils.array.filter(filteredSuggestions, s => tags.indexOf(s) === -1);
  }, [props.suggestions, tags])

  const notifyTagsChange = React.useCallback((newTags: string[]) => {
    setTags(newTags)
    setSuggestions([])
    onTagsChange(newTags)
  }, [onTagsChange])

  const notifySuggestionsChange = React.useCallback((newSuggestions: string[] = []) => {
    setSuggestions(newSuggestions)
    setSuggestionIndex(-1)
  }, [])

  const addTag = React.useCallback((tag: string) => {
    notifyTagsChange([...tags, tag])
    input.current.value = "";
    input.current.focus();
  }, [tags, notifyTagsChange, input])

  const addTagCallback = React.useCallback((tag: string) => () => addTag(tag), [addTag])

  const removeTag = React.useCallback((index: number) => () => {
    notifyTagsChange(utils.array.filter(tags, (__, idx) => idx !== index))
    input.current.focus();
  }, [tags, notifyTagsChange, input])

  const onKeyUp = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target;
    // tslint:disable-next-line:no-string-literal
    const targetValue = target["value"];
    switch (e.keyCode) {
      case 40: // ArrowDown
      case 38: // ArrowUp}
        return
      case 13:
        if (targetValue) {
          if (tags.indexOf(targetValue) === -1) {
            const newTags = [...tags, targetValue];
            notifyTagsChange(newTags)
          }
          // tslint:disable-next-line:no-string-literal
          target["value"] = "";
          return;
        }
        break;
    }

    if (targetValue) {
      notifySuggestionsChange(filterSuggestions(targetValue));
    } else {
      notifySuggestionsChange();
    }
  }, [tags, filterSuggestions, notifySuggestionsChange])

  const onKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // tslint:disable-next-line:no-string-literal
    const targetValue = e.target["value"];

    switch (e.keyCode) {
      case 8: // delete
        if (tags.length !== 0 && !targetValue) {
          const newTags = [...tags];
          newTags.splice(-1, 1);
          notifyTagsChange(newTags)
        }

        break;
      case 40: // ArrowDown
        if (suggestionIndex < suggestions.length - 1) {
          setSuggestionIndex(suggestionIndex + 1)
        }
        e.preventDefault()
        break
      case 38: // ArrowUp}
        if (suggestionIndex > -1) {
          setSuggestionIndex(suggestionIndex - 1)
        }
        e.preventDefault()
        break
      case 13:
        const suggestion = suggestions[suggestionIndex]
        if (suggestion) {
          addTag(suggestion)
        }
        break;
    }
  }, [tags, suggestionIndex, suggestions, notifyTagsChange, addTag])

  const renderSuggestions = React.useCallback((newSuggestions: string[]) => {
    if (!newSuggestions || !newSuggestions.length) {
      return null
    }
    return <div className="suggestions">{newSuggestions.map((s, i) => <div key={s} className={ClassHelpers.classNames({ selected: i === suggestionIndex })} onClick={addTagCallback(s)}>{s}</div>)}</div>
  }, [addTag, suggestionIndex])

  const validationMessage = DataValidationMessage.get(props)
  const validationMode = DataValidationMode.get(props)

  const classes = React.useMemo(() => {
    return ClassHelpers.classNames(
      "armstrong-input",
      "tag-input",
      className,
      {
        "show-validation": validationMode !== "none" && validationMessage,
      })
  }, [className, validationMode, validationMessage]);

  return (
    <div className={classes}>
      {tags.map((t, i) => (
        <div key={t} className="tag">
          {t}
          <Icon icon={Icon.Icomoon.cross} onClick={removeTag(i)} />
        </div>
      ))}
      <input onKeyDown={onKeyDown} ref={input} onKeyUp={onKeyUp} type="text" />
      {renderSuggestions(suggestions)}
      <ValidationLabel message={validationMessage} mode={validationMode} />
    </div>
  );
}

export const TagInput = React.forwardRef(TagInputRef)
