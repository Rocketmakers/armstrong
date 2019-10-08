import * as React from "react";
import { ClassHelpers } from "../../utilities/classHelpers";

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

  className?: string;
}

export const ProgressBar: React.FunctionComponent<IProgressBarProps> = ({
  progress,
  direction,
  thickness,
  labelText,
  labelVariant,
  className
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

  const innerStyle = React.useMemo<React.CSSProperties>(() => {
    switch (direction) {
      case "down":
        return {
          top: 0,
          left: 0,
          right: 0,
          height: `${progress}%`
        };
      case "right":
        return {
          top: 0,
          left: 0,
          bottom: 0,
          width: `${progress}%`
        };
      case "up":
        return {
          bottom: 0,
          left: 0,
          right: 0,
          height: `${progress}%`
        };
      case "left":
        return {
          top: 0,
          right: 0,
          bottom: 0,
          width: `${progress}%`
        };
    }
  }, [progress, direction]);

  const labelStyle = React.useMemo<React.CSSProperties>(() => {
    switch (labelVariant) {
      case "following": {
        switch (direction) {
          case "down":
            return {
              top: `${progress}%`
            };
          case "right":
            return {
              left: `${progress}%`
            };
          case "up":
            return {
              bottom: `${progress}%`
            };
          case "left":
            return {
              right: `${progress}%`
            };
        }
      }
    }
  }, [progress, direction, labelVariant]);

  return (
    <div
      className={ClassHelpers.classNames("progress-bar", className)}
      style={outerStyle}
      data-direction={direction}
    >
      <div className="progress-bar-inner" style={innerStyle} />

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
