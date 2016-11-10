/***********************************************************************************
  ARMSTRONG TSX COMPONENT EXPORTS
  all components (and appropriate interfaces) to be consumed must be exported here
************************************************************************************/

// Display
export { IIconProps, Icon } from "./components/display/icon";
export { IImageProps, Image } from "./components/display/image";
export { IDialogProps, Dialog } from "./components/display/dialog";

// Form
export { ICheckboxInputProps, CheckboxInput } from "./components/form/inputs/checkboxInput";
export { IRadioInputProps, RadioInput } from "./components/form/inputs/radioInput";
export { ISelectInputProps, SelectInput } from "./components/form/inputs/selectInput";
export { DateInput, IDateInputProps } from "./components/form/inputs/dateInput";
export { TimeInput, ITimeInputProps } from "./components/form/inputs/timeInput";
export { CalendarInput, ICalendarInputProps } from "./components/form/inputs/calendarInput";
export { ITextInputProps, TextInput } from "./components/form/inputs/textInput";
export { IAutoCompleteInputProps, AutoCompleteInput, IAutoCompleteOption } from "./components/form/inputs/autoCompleteInput";
export { IFormProps, Form } from "./components/form/form";

// Interaction
export { IButtonProps, Button } from "./components/interaction/button";

// Layout
export { IGrid, Grid, IRow, Row, ICol, Col } from "./components/layout/grid";

// UI Helpers
export { Color, Size, Side, HorizontalAlignment, VerticalAlignment, LayoutHelpers } from "./utilities/uiHelpers";

// Icons
export { Icons } from "./utilities/icons";

// Navigation
export { BurgerMenu, IBurgerMenuProps, BurgerMenuItem, IBurgerMenuItemProps } from "./components/navigation/burgerMenu";
export { TabControl, TabItem, ITabItemProps, ITabControlProps, ITabControlState } from "./components/navigation/tabControl";

// Utility
export { Sample, ISampleProps, IPropInfo } from "./components/utility/sample";

import * as ArmstrongConfig from "./config/config"
export { ArmstrongConfig };


