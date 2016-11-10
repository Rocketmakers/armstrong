/***********************************************************************************
  ARMSTRONG TSX COMPONENT EXPORTS
  all components (and appropriate interfaces) to be consumed must be exported here
************************************************************************************/

// Display
export { IIconProps, Icon } from "./components/display/icon";
export { IImageProps, Image } from "./components/display/image";
export { IDialogProps, Dialog } from "./components/display/dialog";

// Immutable form
export { ICheckboxInputProps, CheckboxInput } from "./components/form/inputs/checkboxInput";
export { IRadioInputProps, RadioInput } from "./components/form/inputs/radioInput";
export { ISelectInputProps, SelectInput } from "./components/form/inputs/selectInput";
export { DateInput, IDateInputProps } from "./components/form/inputs/dateInput";
export { TimeInput, ITimeInputProps } from "./components/form/inputs/timeInput";
export { CalendarInput, ICalendarInputProps } from "./components/form/inputs/calendarInput";
export { ITextInputProps, TextInput } from "./components/form/inputs/textInput";
export { IAutoCompleteInputProps, AutoCompleteInput, IAutoCompleteOption } from "./components/form/inputs/autoCompleteInput";
export { IFormProps, Form } from "./components/form/form";

// Simple form
export { IToggleInputProps as ISimpleToggleInputProps, ToggleInput as SimpleToggleInput } from "./components/simpleForm/inputs/toggleInput";
export { ICheckboxInputProps as  ISimpleCheckboxInputProps, CheckboxInput as SimpleCheckboxInput } from "./components/simpleForm/inputs/checkboxInput";
export { IRadioInputProps as ISimpleRadioInputProps, RadioInput as SimpleRadioInput } from "./components/simpleForm/inputs/radioInput";
export { ISelectInputProps as ISimpleSelectInputProps, SelectInput as SimpleSelectInput  } from "./components/simpleForm/inputs/selectInput";
export { IDateInputProps as ISimpleDateInputProps, DateInput as SimpleDateInput } from "./components/simpleForm/inputs/dateInput";
export { ITimeInputProps as ISimpleTimeInputProps, TimeInput as SimpleTimeInput } from "./components/simpleForm/inputs/timeInput";
export { ICalendarInputProps as ISimpleCalendarInputProps, CalendarInput as SimpleCalendarInput } from "./components/simpleForm/inputs/calendarInput";
export { ITextInputProps as ISimpleTextInputProps, TextInput as SimpleTextInput } from "./components/simpleForm/inputs/textInput";
export { IAutoCompleteInputProps as ISimpleAutoCompleteInputProps, IAutoCompleteOption as ISimpleAutoCompleteOption, AutoCompleteInput as SimpleAutoCompleteInput } from "./components/simpleForm/inputs/autoCompleteInput";
export { IFormProps as ISimpleFormProps, Form as SimpleForm } from "./components/simpleForm/form";

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


