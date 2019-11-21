import * as React from "react";
import { useOptions, IAutoCompleteOption, useForm } from "../../_symlink";

import { storiesOf } from "@storybook/react";

import "../../theme/theme.scss";
import { CodeInput } from "../../_symlink/components/form/inputs/codeInput";
import { Form } from "../../_symlink/components/form/form";

storiesOf("Form/CodeInput", module)
  .addParameters({
    options: {
      showAddonPanel: true
    }
  })
  .add("Standard", () => {
    const { bind } = useForm({ value1: undefined, value2: undefined });

    return (
      <>
        <p>
          The <strong>CodeInput </strong>handles a single value, spread across multiple input
          elements.
        </p>
        <p>
          The number of boxes, and the length of each box is determined with the
          lengthPerBox prop.
        </p>
        <br />
        <pre>{`<CodeInput lengthPerBox={[1, 1, 1,]} />`}</pre>
        <br />
        <br />
        <CodeInput
          lengthPerBox={[1, 1, 1]}
          {...bind.codeInput('value1')}
        />
        <br />
        <p>
          The <strong>CodeInput </strong>component takes a number of customisation properties,
          including type and numberic
        </p>
        <pre>
          {`<CodeInput lengthPerBox={[3, 3, 3,]} placeholder="000" type="password" />`}
        </pre>
        <br />
        <br />
        <CodeInput
          lengthPerBox={[3, 3, 3]}
          type="password"
          placeholder="000"
          {...bind.codeInput("value2")}
        />
        <br />
        <br />
        <p>
          The callback passed in the prop onCodeChange is fired when the input
          is complete.
        </p>
        <p>Alternatively, the <strong>CodeInput</strong> can be attached to a form binder using the bind object returned from <strong>useForm</strong></p>
        <pre>
            {`const { bind } = useForm({ value: '' })`}
            <br/>
            <br/>
            {`<CodeInput {...bind.codeInput("value")} />`}
        </pre>
      </>
    );
  });
