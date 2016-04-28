import * as React from "react";

export type Responsiveness = "tablet" | "phone" | "both" | "none";
export type Color = "positive" | "negative" | "warning" | "info" | "brand";
export type Size = "none" | "xxsmall" | "xsmall" | "small" | "medium" | "large" | "xlarge";
export type Side = "top" | "left" | "right" | "bottom" | "all";
export type CenterContentVertical = "top" | "center" | "bottom";
export type CenterContentHorizontal = "left" | "center" | "right";
export type CenterBoth = "both";

export interface CenterContent {
  vertical?: CenterContentVertical;
  horizontal?: CenterContentHorizontal;
}


export interface Spacing {
  top?: Size;
  bottom?: Size;
  left?: Size;
  right?: Size;
}

export interface Background {
  color?: Color;
  url?: string;
}

export interface Foreground {
  color?: Color;
  textAlignment?: string;
}

export enum SpacingType {
  Padding,
  Margin
}

export enum ColorType {
  Foreground,
  Background
}

export interface DisplayProps {
  background?: Background;
  foreground?: Foreground | string;
}

export interface LayoutProps {
  margin?: Spacing | Size;
  padding?: Spacing | Size;
  textAlignment?: CenterContentHorizontal;
}

export class LayoutHelpers {
  static GetBackgroundImage(background: Background): React.CSSProperties {
    if (!background) {
      return null;
    }
    var style: React.CSSProperties = {};
    if (background.url) {
      style.backgroundImage = `url(${background.url})`;
    }
    return style;
  }

  static HandleLayoutClasses(margins?: Spacing | Size, paddings?: Spacing | Size, contentCentering?: CenterContent | CenterBoth, textAlignment?: CenterContentHorizontal) {
    let ms = this.GetSpacings(margins, SpacingType.Margin);
    let ps = this.GetSpacings(paddings, SpacingType.Padding);
    let al = this.GetAlignment(contentCentering);
    let tAl = this.GetTextAlignment(textAlignment);
    return [ms, ps, al].filter(cl => cl != null).join(" ");
  }

  static HandleResponsivenessClasses(responsiveness?: Responsiveness) {
    if (responsiveness === "both") {
      return "responsive-phone responsive-tablet";
    }
    return `responsive-${responsiveness}`;
  }

  static HandleDisplayClasses(background?: Background, foreground?: Foreground) {
    let fgc = foreground ? this.GetColorClass(foreground.color, ColorType.Foreground) : null;
    let bgc = background ? this.GetColorClass(background.color, ColorType.Background) : null;
    return [bgc, fgc].filter(cl => cl != null).join(" ");
  }

  static HandleDisplayStyles(background?: Background, foreground?: Foreground): React.CSSProperties {
    let bg = this.GetBackgroundImage(background);
    return bg;
  }

  static GetMargin(margins: Spacing | Size) {
    return this.GetSpacings(margins, SpacingType.Margin);
  }
  static GetPadding(paddings: Spacing | Size) {
    return this.GetSpacings(paddings, SpacingType.Padding);
  }
  static GetTextAlignment(textAlignment: CenterContentHorizontal) {
    return `t-al-${textAlignment}`;
  }

  static GetAlignment(centerContent: CenterContent | CenterBoth) {
    if (!centerContent) {
      return null
    }
    if (typeof centerContent === "string") {
      return "align-content-center-both";
    }
    var classes = [];

    classes.push((centerContent as CenterContent).horizontal ? LayoutHelpers.GetHorizontalAlignment((centerContent as CenterContent).horizontal) : null);
    classes.push((centerContent as CenterContent).vertical ? LayoutHelpers.GetVerticalAlignment((centerContent as CenterContent).vertical) : null);
    return classes.filter(c => c != null).join(" ");
  }

  static GetHorizontalAlignment(alignment: CenterContentHorizontal) {
    return `align-content-horizontal-${alignment}`;
  }
  static GetVerticalAlignment(alignment: CenterContentVertical) {
    return `align-content-vertical-${alignment}`;
  }
  static GetSpacings(spacing: Spacing | Size, spacingType: SpacingType): string {
    if (typeof spacing === "string") {
      // this is a single spacing
      return this.GetSpacingClass(spacing as Size, "all", spacingType);
    } else {
      // this is an array of spacing
      var classes = [];
      if (!spacing) {
        return null;
      }
      classes.push(LayoutHelpers.GetSpacingClass(spacing.top, "top", spacingType));
      classes.push(LayoutHelpers.GetSpacingClass(spacing.bottom, "bottom", spacingType));
      classes.push(LayoutHelpers.GetSpacingClass(spacing.left, "left", spacingType));
      classes.push(LayoutHelpers.GetSpacingClass(spacing.right, "right", spacingType));
      return classes.filter(c => c != undefined).join(" ");
    }
  }

  static GetColorClass(color: Color, colorType: ColorType): string {
    if (colorType === ColorType.Foreground) {
      return `fg-${color}`;
    }
    else if (colorType === ColorType.Background) {
      return `bg-${color}`;
    }
    else {
      throw new Error("Invalid color type specified");
    }
  }

  static GetSpacingClass(size: Size, side: Side, type: SpacingType): string {
    if (!size) {
      return null;
    }
    if (side === "all") {
      return type === SpacingType.Margin ? `m-${size}` : `p-${size}`;
    }
    return type === SpacingType.Margin ? `m-${side}-${size}` : `p-${side}-${size}`;
  }
}
