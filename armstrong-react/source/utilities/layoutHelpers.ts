import { ClassHelpers } from "./classHelpers";

export type Size = "none" | "xxsmall" | "xsmall" | "small" | "medium" | "large" | "xlarge";
export type Side = "top" | "left" | "right" | "bottom" | "all";
export type VerticalAlignment = "top" | "center" | "bottom";
export type HorizontalAlignment = "left" | "center" | "right";

export type MarginClass = "m-none" | "m-xxsmall" | "m-xsmall" | "m-small" | "m-medium" | "m-large" | "m-xlarge";
export type PaddingClass = "p-none" | "p-xxsmall" | "p-xsmall" | "p-small" | "p-medium" | "p-large" | "p-xlarge";

export type Color = "positive" | "negative" | "warning" | "info" | "brand-primary" | "brand-secondary" | "gray-very-dark" | "gray-dark" | "gray-medium" | "gray-light" | "gray-very-light" | "white";
export type BgColorClass = "bg-positive" | "bg-negative" | "bg-warning" | "bg-info" | "bg-brand-primary" | "bg-gray-very-dark" | "bg-gray-dark" | "bg-gray-medium" | "bg-gray-light" | "bg-gray-very-light" | "bg-white";
export type FgColorClass = "fg-positive" | "fg-negative" | "fg-warning" | "fg-info" | "fg-brand-primary" | "fg-gray-very-dark" | "fg-gray-dark" | "fg-gray-medium" | "fg-gray-light" | "fg-gray-very-light" | "fg-white";

export class LayoutHelpers {
  static GetAlignmentClasses(vertical: VerticalAlignment, horizontal: HorizontalAlignment): string {
    const classes = [];
    if (vertical) {
      classes.push(`align-con-v-${vertical}`)
    }
    if (horizontal) {
      classes.push(`align-con-h-${horizontal}`)
    }
    return ClassHelpers.classNames(classes);
  }
}
