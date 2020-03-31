import * as React from "react";
import { useForm, CodeInput, Button, TagInput } from "../../_symlink";

import { storiesOf } from "@storybook/react";

import "../../theme/theme.scss";

storiesOf("Form/TagInput", module)
  .addParameters({
    options: {
      showAddonPanel: true
    }
  })
  .add("Standard", () => {
    const [tags, setTags] = React.useState(["apple", "pear"]);
    const [lastTag, setLastTag] = React.useState("");
    const [lastTagEventType, setLastTagEventType] = React.useState("");

    const tagUpdate = (tags: string[], updatedTag: string, eventType: string) => {
      setLastTag(updatedTag);
      setTags(tags);
      setLastTagEventType(eventType);
    }

    return (
      <div>
        <TagInput value={tags} onTagsChange={tagUpdate}/>
        <b>Tags:</b> {tags.join(', ')}<br/>
        <b>Last updated:</b> {lastTag} ({lastTagEventType})
      </div>
    );
  });
