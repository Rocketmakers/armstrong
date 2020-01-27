import * as React from "react";
import { ClassHelpers } from "../../utilities/classHelpers";
import { ColorHelper } from "../../utilities/colorHelper";

interface IProgressBarProps {
  /** the progress of the bar from 0 to 100 */
  progress: number;

  /** the direction for the loading to increase */
  direction?: "left" | "right" | "down" | "up";

  /** the text to optionally display as a label */
  labelText?: string;

  /** the position to show the label - defaults to centre */
  labelVariant?: "centre" | "following";

  /** the thickness of the loading bar */
  thickness?: string;

  /** initial colour when progress is at 0 - will fade to endColour (both must be set) */
  startColor?: string;

  /** end colour as progress approaches 100 - will fade from startColour (both must be set) */
  endColor?: string;

  /** colour when the progress has hit 100 */
  completeColor?: string;

  className?: string;
}

/** A simple progress bar that takes a progress prop between 0 and 100 */

export const ProgressBar: React.FunctionComponent<IProgressBarProps> = ({
  progress,
  direction,
  thickness,
  labelText,
  labelVariant,
  className,
  startColor,
  endColor,
  completeColor
}) => {
  const outerStyle = React.useMemo<React.CSSProperties>(() => {
    switch (direction) {
      case "down":
      case "up":
        return { width: thickness };
      case "right":
      case "left":
        return { height: thickness };
    }
  }, [direction, thickness]);

  const clampedProgress = React.useMemo(
    () => Math.max(Math.min(progress, 100), 0),
    [progress]
  );

  const innerStyle = React.useMemo<React.CSSProperties>(() => {
    switch (direction) {
      case "down":
        return {
          top: 0,
          left: 0,
          right: 0,
          height: `${clampedProgress}%`
        };
      case "right":
        return {
          top: 0,
          left: 0,
          bottom: 0,
          width: `${clampedProgress}%`
        };
      case "up":
        return {
          bottom: 0,
          left: 0,
          right: 0,
          height: `${clampedProgress}%`
        };
      case "left":
        return {
          top: 0,
          right: 0,
          bottom: 0,
          width: `${clampedProgress}%`
        };
    }
  }, [clampedProgress, direction]);

  const labelStyle = React.useMemo<React.CSSProperties>(() => {
    switch (labelVariant) {
      case "following": {
        switch (direction) {
          case "down":
            return {
              top: `${clampedProgress}%`
            };
          case "right":
            return {
              left: `${clampedProgress}%`
            };
          case "up":
            return {
              bottom: `${clampedProgress}%`
            };
          case "left":
            return {
              right: `${clampedProgress}%`
            };
        }
      }
    }
  }, [clampedProgress, direction, labelVariant]);

  const startColorRGB = React.useMemo(
    () => startColor && ColorHelper.hexToRgb(startColor),
    [startColor]
  );

  const endColorRGB = React.useMemo(
    () => endColor && ColorHelper.hexToRgb(endColor),
    [endColor]
  );

  const getChannel = React.useCallback(
    (channel: "r" | "g" | "b") => {
      if (startColorRGB && endColorRGB) {
        const start = startColorRGB[channel];
        const end = endColorRGB[channel];

        const current = start + ((end - start) / 100) * clampedProgress;

        return current;
      }
    },
    [clampedProgress, startColorRGB, endColorRGB]
  );

  const currentColour = React.useMemo(() => {
    const r = getChannel("r");
    const g = getChannel("g");
    const b = getChannel("b");
    return { r, g, b };
  }, [getChannel]);

  const colourStyle = React.useMemo<React.CSSProperties>(
    () =>
      completeColor && clampedProgress >= 100
        ? {
            backgroundColor: completeColor
          }
        : startColor && endColor
        ? {
            backgroundColor: `rgb(${currentColour.r}, ${currentColour.g}, ${currentColour.b})`
          }
        : {},
    [startColor, endColor, currentColour, completeColor]
  );

  return (
    <div
      className={ClassHelpers.classNames("progress-bar", className)}
      style={outerStyle}
      data-direction={direction}
      data-complete={clampedProgress >= 100}
    >
      <div
        className="progress-bar-inner"
        style={{ ...innerStyle, ...colourStyle }}
      />

      {labelText && (
        <p className="label" data-variant={labelVariant} style={labelStyle}>
          {labelText}
        </p>
      )}
    </div>
  );
};

ProgressBar.defaultProps = {
  thickness: "19px",
  direction: "right",
  labelVariant: "centre"
};

interface IAutoProgressBarProps
  extends Omit<IProgressBarProps, "progress" | "labelText"> {
  /** */
  labelText?: (progress: number) => string;

  /** the time in ms to add to the remaining progress — defaults to 300 */
  increaseInterval?: number;

  /** the proportion of the remaining progress to add each time - defaults to 0.3 */
  increaseProportion?: number;

  /** the maximum the progress can be out of 100 if the content hasn't loaded yet (the asymptote of the progress / time curve function) - defaults to 90 */
  maxProgressBeforeLoaded?: number;

  /** will fill the loading bar */
  loaded?: boolean;

  /** should be filling the loading bar */
  loading?: boolean;
}

/**
 * A progress bar which wraps the Armstrong ProgressBar component, where the progress is faked.
 * Allows visual feedback for requests where progress isn't actually known. The progress increases by a defined proportion of the remaining progress, never reaching 100%, until the prop loaded is set
 */

export const AutoProgressBar: React.FunctionComponent<
  IAutoProgressBarProps
> = ({
  increaseInterval,
  increaseProportion,
  loaded,
  loading,
  maxProgressBeforeLoaded,
  labelText,
  ...props
}) => {
  const [progress, setProgress] = React.useState(0);
  const interval = React.useRef(null);

  const onInterval = React.useCallback(() => {
    if (loading) {
      setProgress(p => p + (maxProgressBeforeLoaded - p) * increaseProportion);
    }
  }, [increaseInterval, increaseProportion, maxProgressBeforeLoaded, loading]);

  React.useEffect(() => {
    if (loading && !loaded) {
      interval.current = setInterval(onInterval, increaseInterval);
    }
    return () => {
      clearInterval(interval.current);
    };
  }, [loading, increaseInterval, increaseProportion, maxProgressBeforeLoaded]);

  React.useEffect(() => {
    if (loaded) {
      clearInterval(interval.current);
      setProgress(100);
    }
  }, [loaded]);

  return (
    <ProgressBar
      progress={progress}
      labelText={labelText && labelText(Math.round(progress * 100) * 0.01)}
      {...props}
    />
  );
};

AutoProgressBar.defaultProps = {
  increaseInterval: 300,
  increaseProportion: 0.3,
  maxProgressBeforeLoaded: 90
};
