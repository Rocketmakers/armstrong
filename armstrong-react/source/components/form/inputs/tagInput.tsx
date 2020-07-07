import * as React from "react";
import { useDidUpdateEffect } from "../../../hooks/lifecycle/useDidUpdateEffect";
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
  /** Preset list of tags to pick from */
  suggestions?: string[];
  /** Event that fires when tag collection changes */
  onTagsChange?: (tags: string[], changedTag: string, changeType: "add" | "remove" | "set") => void;
  /** The current array of tags */
  value?: string[];
  /** Adds a label above the input */
  label?: string;
};

function makeComparison(value: string) {
  return value ? value.trim().toLowerCase() : ""
}

const TagInputRef: React.RefForwardingComponent<ITagInput, ITagInputProps> = (props, ref) => {

  const { value, className, onTagsChange, label } = props

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
    notifyTagsChange(newTags, "", "set")
  }, [value])

  const filterSuggestions = React.useCallback((newValue: string) => {
    newValue = makeComparison(newValue)
    if (!newValue) {
      return []
    }

    const filteredSuggestions = utils.array.filter(props.suggestions, s => makeComparison(s).lastIndexOf(newValue, 0) === 0);
    return utils.array.filter(filteredSuggestions, s => tags.indexOf(s) === -1);
  }, [props.suggestions, tags])

  const notifyTagsChange = React.useCallback((newTags: string[], newTag: string, change: "add" | "remove" | "set") => {
    setTags(newTags)
    setSuggestions([])
    if (onTagsChange){
      onTagsChange(newTags, newTag, change)
    }
  }, [onTagsChange])

  const notifySuggestionsChange = React.useCallback((newSuggestions: string[] = []) => {
    setSuggestions(newSuggestions)
    setSuggestionIndex(-1)
  }, [])

  const addTag = React.useCallback((tag: string) => {
    notifyTagsChange([...tags, tag], tag, "add")
    input.current.value = "";
    input.current.focus();
  }, [tags, notifyTagsChange, input])

  const addTagCallback = React.useCallback((tag: string) => () => addTag(tag), [addTag])

  const removeTag = React.useCallback((index: number) => () => {
    const tagToRemove = tags[index];
    notifyTagsChange(utils.array.filter(tags, (__, idx) => idx !== index), tagToRemove, "remove")
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
      case 9:
      case 13:
        if (targetValue) {
          if (tags.indexOf(targetValue) === -1) {
            const newTags = [...tags, targetValue];
            notifyTagsChange(newTags, targetValue, "add")
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

  const addSuggestion = React.useCallback(() => {
    const suggestion = suggestions[suggestionIndex]
        if (suggestion) {
          addTag(suggestion)
        }
  }, [addTag, suggestionIndex, suggestions]) 

  const onKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // tslint:disable-next-line:no-string-literal
    const targetValue = e.target["value"];

    switch (e.keyCode) {
      case 8: // delete
        if (tags.length !== 0 && !targetValue) {
          const newTags = [...tags];
          const deletedTag = newTags.pop();
          //newTags.splice(-1, 1);
          notifyTagsChange(newTags, deletedTag, "remove")
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
      case 9:
          if (targetValue) {
              e.preventDefault()
          }
          addSuggestion()
          break
      case 13:
        addSuggestion()
        break;
    }
  }, [tags, suggestionIndex, suggestions, notifyTagsChange, addTag, addSuggestion])

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
      {label && <label className="armstrong-label">{label}</label>}
      <div className="armstrong-tags">
      {tags.map((t, i) => (
        <div key={t} className="tag">
          {t}
          <Icon icon={Icon.Icomoon.cross} onClick={removeTag(i)} />
        </div>
      ))}
      <input onKeyDown={onKeyDown} ref={input} onKeyUp={onKeyUp} type="text" />
      {renderSuggestions(suggestions)}
      </div>
      <ValidationLabel message={validationMessage} mode={validationMode} />
    </div>
  );
}

export const TagInput = React.forwardRef(TagInputRef)
