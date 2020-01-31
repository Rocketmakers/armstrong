export {
  IInputValueConverter,
  IValueConverter
} from "./components/form/formValueConverters";
/***********************************************************************************
  ARMSTRONG TSX COMPONENT EXPORTS
  all components (and appropriate interfaces) to be consumed must be exported here
************************************************************************************/

// Display
export {
  Icon,
  IcomoonIcon,
  LinearIcon,
  IIconProps,
  getIconProps,
  IconOrJsx,
  useIconOrJsx,
  getIconOrJsx as getIcon,
  IconSet,
  IconName
} from "./components/display/icon";
export {
  IImageProps,
  Image,
  useDummyImageSrc,
  useRandomUserImageSrc
} from "./components/display/image";
export {
  IDialogProps,
  Dialog,
  useDialog,
  IUseDialogProps,
  DialogLayer
} from "./components/display/dialog";
export {
  DialogProvider,
  IDialogProviderProps,
  useDialogProvider
} from "./components/display/dialogProvider";
export { IDataListProps, DataList } from "./components/display/dataList";
export {
  ITooltipPosition,
  ITooltipPositions,
  ITooltipPositionPriority,
  ITooltipCustomPositions,
  ITooltipProps,
  Tooltip
} from "./components/display/tooltip";

// Form
export {
  ICheckboxInputProps,
  CheckboxInput,
  ICheckboxInput
} from "./components/form/inputs/checkboxInput";
export {
  ISwitchInputProps,
  SwitchInput,
  ISwitchInput
} from "./components/form/inputs/switchInput";
export {
  IRadioInputProps,
  RadioInput,
  IRadioInput
} from "./components/form/inputs/radioInput";
export {
  IRadioListInputProps,
  RadioListInput,
  IRadioListInputOption,
  IRadioListInput
} from "./components/form/inputs/radioListInput";
export {
  ISelectInputProps,
  SelectInput,
  ISelectInputOption,
  ISelectInput
} from "./components/form/inputs/selectInput";
export { DateInput, IDateInputProps } from "./components/form/inputs/dateInput";
export { TimeInput, ITimeInputProps } from "./components/form/inputs/timeInput";
export {
  CalendarInput,
  ICalendarInputProps
} from "./components/form/inputs/calendarInput";
export { TagInput, ITagInputProps } from "./components/form/inputs/tagInput";
export { CodeInput, ICodeInputProps } from "./components/form/inputs/codeInput";
export {
  ITextInputProps,
  TextInput,
  ITextInput
} from "./components/form/inputs/textInput";
export {
  IAutoCompleteSelectProps,
  AutoCompleteInput
} from "./components/form/inputs/autoCompleteInput";
export { AutoCompleteMultiInput } from "./components/form/inputs/autoCompleteMultiInput";
export { AutoCompleteSingleInput } from "./components/form/inputs/autoCompleteSingleInput";
export {
  IAutoCompleteOption,
  IAutoCompleteProps,
  useOptions,
  useRemoteOptions
} from "./components/form/inputs/autoCompleteOptionHooks";
export {
  IDataBinder,
  IFormBinder,
  IFormValidationResult
} from "./components/form/formCore";
export { FormBinderBase } from "./components/form/formBinderBase";
export { FormBinder, InputFormBinder } from "./components/form/formBinders";
export {
  IFormProps,
  Form,
  ParentFormContext,
  IFormContext,
  FormDataClone,
  generateUniqueId,
  extractChildValidationResults
} from "./components/form/form";
export {
  useForm,
  createFormContext,
  UseFormContext,
  IUseFormProps
} from "./components/form/formHooks";

// Interaction
export {
  IButtonProps,
  Button,
  IButton as IButtonRef,
  ButtonConfirmDialog,
  IButtonConfirmDialog,
  useButtonConfirmDialog
} from "./components/interaction/button";

// Layout
export {
  IGridProps,
  Grid,
  IRowProps,
  Row,
  IColProps,
  Col
} from "./components/layout/grid";
export { Repeater } from "./components/layout/repeater";

// UI Helpers
export {
  Color,
  Size,
  Side,
  HorizontalAlignment,
  VerticalAlignment,
  LayoutHelpers
} from "./utilities/layoutHelpers";
export { utils } from "./utilities/utils";
export { calendarUtils } from "./utilities/calendarUtils";
export { ClassHelpers } from "./utilities/classHelpers";

// Icons
export { Icons } from "./utilities/icons";

// Navigation
export {
  ISidebarProps,
  Sidebar,
  useSidebar
} from "./components/navigation/sidebar";
export {
  IBurgerMenuProps,
  BurgerMenu,
  useBurgerMenu
} from "./components/navigation/burgerMenu";
export {
  TabControl,
  TabItem,
  ITabItemProps,
  ITabControlProps
} from "./components/navigation/tabControl";
import * as ArmstrongConfig from "./config/config";

export {
  ValidationLabel,
  ValidationWrapper
} from "./components/form/validationWrapper";
export { ArmstrongConfig };

// Progress bar
export { AutoProgressBar, ProgressBar } from "./components/display/progressBar";

// Toast
export {
  useToast,
  ToastProvider,
  IToastNotification,
  IGlobalToastSettings,
  DispatchToast,
  DismissToast,
  ToastLocation,
  ToastType,
  Toast
} from "./components/display/toast";

// Spinner
export { Spinner } from "./components/display/spinner";

// Table
export { Table, ITableProps } from "./components/tables";
export { useDataTable } from "./hooks/useDataTable";

// Hooks
export {
  useInfinitePaging,
  IInfinitePagingResult,
  IUseInfinitePagingSettings
} from "./hooks/useInfinitePaging";
export {
  usePaging,
  IPagingResult,
  IUsePagingSettings
} from "./hooks/usePaging";
export {
  useCalendar,
  IDay,
  IMonth,
  IUseCalendar,
  IUseCalendarSettings,
  IWeek
} from "./hooks/useCalendar";
export { useDidUpdateEffect } from "./hooks/lifecycle/useDidUpdateEffect";
export { useDidMountEffect } from "./hooks/lifecycle/useDidMountEffect";
export { useWillUnmountEffect } from "./hooks/lifecycle/useWillUnmountEffect";
export { useTimeout } from "./hooks/timing/useTimeout";
export { useInterval } from "./hooks/timing/useInterval";
export { useThrottle } from "./hooks/timing/useThrottle";
export { useEventListener } from "./hooks/useEventListener";
export { usePrevious } from "./hooks/usePrevious";
export { useIntersectionObserver } from "./hooks/observers/useIntersectionObserver";
export { useMutationObserver } from "./hooks/observers/useMutationObserver";
export { useMedia } from "./hooks/useMedia";
export { useStepper } from "./hooks/useStepper";
export { useTemporaryState } from "./hooks/timing/useTemporaryState";
