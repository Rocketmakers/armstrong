import * as React from "react";
import * as classNames from "classnames";

export type Responsiveness = "tablet" | "phone" | "both" | "none";
export type Size = "none" | "xxsmall" | "xsmall" | "small" | "medium" | "large" | "xlarge";
export type Side = "top" | "left" | "right" | "bottom" | "all";
export type CenterContentVertical = "top" | "center" | "bottom";
export type CenterContentHorizontal = "left" | "center" | "right";
export type CenterBoth = "both";

export type MarginClass = "m-none" | "m-xxsmall" | "m-xsmall" | "m-small" | "m-medium" | "m-large" | "m-xlarge";
export type PaddingClass = "p-none" | "p-xxsmall" | "p-xsmall" | "p-small" | "p-medium" | "p-large" | "p-xlarge";

export type Color = "positive" | "negative" | "warning" | "info" | "brand-primary" | "brand-secondary" | "gray-very-dark" | "gray-dark" | "gray-medium" | "gray-light" | "gray-very-light" | "white";
export type BgColorClass = "bg-positive" | "bg-negative" | "bg-warning" | "bg-info" | "bg-brand-primary" | "bg-gray-very-dark" | "bg-gray-dark" | "bg-gray-medium" | "bg-gray-light" | "bg-gray-very-light" | "bg-white";
export type FgColorClass = "fg-positive" | "fg-negative" | "fg-warning" | "fg-info" | "fg-brand-primary" | "fg-gray-very-dark" | "fg-gray-dark" | "fg-gray-medium" | "fg-gray-light" | "fg-gray-very-light" | "fg-white";

export interface CenterContent {
  vertical?: CenterContentVertical;
  horizontal?: CenterContentHorizontal;
}

export class LayoutHelpers {
  static GetAlignment(centerContent: CenterContent | CenterBoth) {
    if (!centerContent) {
      return null
    }

    if (this.isCenterBoth(centerContent)) {
      return "align-content-center-both";
    }
    else {
      return classNames({
        [`align-content-horizontal-${centerContent.horizontal}`]: !!centerContent.horizontal,
        [`align-content-horizontal-${centerContent.vertical}`]: !!centerContent.vertical
      });
    }
  }

  static isCenterBoth(center: CenterContent | CenterBoth): center is CenterBoth {
    return center === "both";
  }
}
