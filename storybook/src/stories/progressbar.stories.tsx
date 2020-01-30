import * as React from "react";

import { storiesOf } from "@storybook/react";

import "../theme/theme.scss";
import {
  ProgressBar,
  AutoProgressBar
} from "../_symlink/components/display/progressBar";
import { Button } from "../_symlink";
import { useTemporaryState } from "../_symlink/hooks/timing/useTemporaryState";

storiesOf("Progress Bar", module)
  .addParameters({
    options: {
      showAddonPanel: true
    }
  })
  .add("Simple Progress Bar", () => {
    const [progress, setProgress] = React.useState(0);
    const timeout = React.useRef(null);

    React.useEffect(() => {
      timeout.current = setTimeout(() => {
        if (progress < 100) {
          setProgress(progress + 1);
        } else {
          setProgress(0);
        }
      }, 10);
    });

    return (
      <>
        <p>
          The progress bar renders a simple progress bar with some additional
          props, taking a % value
        </p>
        <pre>
          {"<ProgressBar progress={progress} labelText={`${progress}%`} />"}
        </pre>
        <br />
        <br />
        <ProgressBar progress={progress} labelText={`${progress}%`} />
      </>
    );
  })
  .add("Vertical Progress Bar", () => {
    const [progress, setProgress] = React.useState(0);
    const timeout = React.useRef(null);

    React.useEffect(() => {
      timeout.current = setTimeout(() => {
        if (progress < 100) {
          setProgress(progress + 1);
        } else {
          setProgress(0);
        }
      }, 10);
    });

    return (
      <>
        <p>
          There is a vertical variant of the progress bar, if it is given a
          vertical direction prop
        </p>
        <pre>{"<ProgressBar progress={progress} direction='up' />"}</pre>
        <br />
        <br />
        <ProgressBar
          progress={progress}
          direction="up"
          thickness="9px"
          className="vertical-dude"
          labelText={`${progress}%`}
          labelVariant="following"
        />
      </>
    );
  })
  .add("Colour Fading Progress Bar", () => {
    const [progress, setProgress] = React.useState(0);
    const timeout = React.useRef(null);

    React.useEffect(() => {
      timeout.current = setTimeout(() => {
        if (progress < 100) {
          setProgress(progress + 1);
        } else {
          setProgress(0);
        }
      }, 1);
    });

    return (
      <>
        <p>
          The progress bar also takes a set of colour props, allowing for a fade
          in colour to take place while the progress increases
        </p>
        <pre>{"<ProgressBar startColor='#FF0000' endColor='#00FF00' />"}</pre>
        <br />
        <br />
        <ProgressBar
          startColor="#FF0000"
          endColor="#00FF00"
          progress={progress}
          direction="right"
          thickness="4px"
          className="vertical-dude"
        />
      </>
    );
  })
  .add("Fake Progress Bar", () => {
    const [loaded, setLoaded] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const [resetting, setResetting] = useTemporaryState(false, 100);

    return (
      <>
        <p>
          There is an additional autoProgress bar prop that, if loading is set
          to true, will slowly increase to a defined percent, until a loaded
          prop is provided.
        </p>
        <pre>{"<AutoProgressBar loading={isLoading} loaded={isLoaded} />"}</pre>
        <br />
        <br />
        {!resetting && (
          <AutoProgressBar
            loading={loading}
            startColor="red"
            endColor="yellowgreen"
            completeColor="green"
            thickness={"4px"}
            loaded={loaded}
            labelVariant="following"
          />
        )}

        <div style={{ height: " 40px" }} />

        <Button style={{ margin: "10px" }} onClick={() => setLoading(!loading)}>
          Set {loading && "not"} Loading
        </Button>

        <Button style={{ margin: "10px" }} onClick={() => setLoaded(true)}>
          Set Loaded
        </Button>

        <Button
          style={{ margin: "10px" }}
          onClick={() => {
            setResetting(true);
            setLoaded(false);
          }}
        >
          reset
        </Button>
      </>
    );
  });
