/***********************************************************************************
  ARMSTRONG TSX COMPONENT EXPORTS
  all components (and appropriate interfaces) to be consumed must be exported here
************************************************************************************/

// display
export { IIconProps, Icon } from "./components/display/icon";
export { IImageProps, Image } from "./components/display/image";
export { IDialogProps, Dialog } from "./components/display/dialog";

// form
export { ICheckboxInputProps, CheckboxInput } from "./components/form/inputs/checkboxInput";
export { IRadioInputProps, RadioInput } from "./components/form/inputs/radioInput";
export { ISelectInputProps, SelectInput } from "./components/form/inputs/selectInput";
export { DateInput, IDateInputProps } from "./components/form/inputs/dateInput";
export { TimeInput, ITimeInputProps } from "./components/form/inputs/timeInput";
export { CalendarInput, ICalendarInputProps } from "./components/form/inputs/calendarInput";
export { ITextInputProps, TextInput } from "./components/form/inputs/textInput";
export { IAutoCompleteInputProps, AutoCompleteInput, IAutoCompleteOption } from "./components/form/inputs/autoCompleteInput";
export { IFormProps, Form } from "./components/form/form";

// interaction
export { IButtonProps, Button } from "./components/interaction/button";

// layout
export { IGrid, Grid, IRow, Row, ICol, Col } from "./components/layout/grid";

// ui helpers
export { Color, Size, Side, HorizontalAlignment, VerticalAlignment, LayoutHelpers } from "./utilities/uiHelpers";

// icons
export { Icons } from "./utilities/icons";

// navigation
export { BurgerMenu, IBurgerMenuProps, BurgerMenuItem, IBurgerMenuItemProps } from "./components/navigation/burgerMenu";

import * as ArmstrongConfig from "./config/config"
export { ArmstrongConfig };
