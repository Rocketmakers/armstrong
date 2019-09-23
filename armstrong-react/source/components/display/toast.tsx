// TODO: Butter

import * as moment from "moment";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as _ from "underscore";
import { ClassHelpers, Icon } from "../../";

export type DispatchToast = (...toast: IToastNotification[]) => void;
export type DismissToast = (index: number) => void;
export type ToastLocation =
  | "top left"
  | "top right"
  | "bottom left"
  | "bottom right";
export type ToastType = "info" | "success" | "warning" | "error";

export interface IToastNotification {
  title?: string;
  message?: string;

  /** will be put into the toast notification as a data attribute, used to style different types of notifications IE alert / error */
  type: ToastType;

  /** amount of time for the notification to autodismiss - will not autodismiss if left undefined */
  autodismiss?: number;

  /** whether to allow the user to manually dismiss the toast with a close button rendered at the top right - defaults to true */
  allowManualDismiss?: boolean;

  /** jsx to render inside the toast notification - can optionally pass down a function to access the dismiss function and the timestamp */
  content?:
    | ((args: {
        /** method to dismiss this notification */
        dismiss?: () => void;

        /** unix timestamp at which the notification was dispatched */
        timestamp?: number;
      }) => JSX.Element)
    | JSX.Element;

  /** unix timestamp of when the notification is dispatched, will default to current time but can be overriden  */
  timestamp?: number;

  /** add an additionaly className to the toast notification, to allow for individual styling */
  className?: string;

  /** Area of the screen for this toast to render in - defaults to global settings value set in provider, or to top right if that's not set. */
  location?: ToastLocation;
}

export interface IGlobalToastSettings {
  /** Area of the screen for toasts to render in - can be overidden individually */
  location?: ToastLocation;

  /** jsx to render as a dismiss button on each toast - an icomoon cross by default */
  dismissButton?: JSX.Element;

  /** Amount of time in ms for a toast to dismiss - used to transition toasts out  */
  dismissTime?: number;

  /** If true, hovering over a notification will cancel autodismiss until the cursor leaves again - true by default */
  disableAutodismissOnHover?: boolean;

  /** Render notifications in the provider component, disable if you want to manually render notifications if you don't want the default Armstrong notifications and want to consume the toasts context yourself - true by default */
  renderInProvider?: boolean;

  /** Query selector for the element to portal the toast container into - if left undefined, will default to rendering where the Toast Provider is places in the tree without creating a portal */
  hostElement?: string;

  /** Location to render the timestamp of a notification, set to undefined to not render timestamp at all — can alternatively be accessed in the content prop on a notification - below title by default */
  renderTimestamp?: "below title" | "below content";

  /** Timestamp format as a moment format string — only relevant if renderTimestamp is not set to undefined */
  timestampFormat?: string;

  /** Whether to save all toast notifications to a history state that can be accessed from the hook - disabled by default (could be expanded to use localStorage at some point?) */
  saveHistory?: boolean;
}

/// PROVIDER

interface IToastContext {
  dispatch: DispatchToast;
  dismiss: DismissToast;
  dismissAll: () => void;
  toasts: IToastNotification[];
  toastsHistory: IToastNotification[];
  clearToastHistory: () => void;
}

const ToastContext = React.createContext<IToastContext>(undefined);

/** Provides all children with the ToastContext, allowing for use of the useToast hook, and also renders toast notifications */

interface IAddToastAction {
  type: "add";
  toasts: IToastNotification[];
}
interface IDismissToastAction {
  type: "dismiss";
  index: number;
}
interface IDismissAllToastAction {
  type: "dismiss-all";
}
type ToastActions =
  | IAddToastAction
  | IDismissToastAction
  | IDismissAllToastAction;

const toastReducer: React.Reducer<IToastNotification[], ToastActions> = (
  state,
  action,
) => {
  switch (action.type) {
    case "add":
      return [...state, ...action.toasts];

    case "dismiss":
      return [...state.filter((__, i) => i !== action.index)];

    case "dismiss-all":
      return [];

    default:
      return state;
  }
};

export const ToastProvider: React.FC<IGlobalToastSettings> = ({
  children,
  renderInProvider,
  saveHistory,
  ...settings
}) => {
  const [toasts, dispatchAction] = React.useReducer(toastReducer, []);
  const [toastsHistory, setToastsHistory] = React.useState<
    IToastNotification[]
  >([]);

  /** Dispatch a new toast notification */

  const dispatch = React.useCallback(
    (...newToasts: IToastNotification[]) => {
      dispatchAction({ type: "add", toasts: newToasts });
      // setToasts([...toasts, ...newToasts]);
      if (saveHistory) {
        setToastsHistory([...toastsHistory, ...newToasts]);
      }
    },
    [dispatchAction],
  );

  /** Dismiss a toast notification by index */

  const dismiss = React.useCallback(
    (index: number) => {
      dispatchAction({ type: "dismiss", index });
    },
    [dispatchAction],
  );

  /** Dismiss all toast notifications */

  const dismissAll = React.useCallback(
    () => dispatchAction({ type: "dismiss-all" }),
    [dispatchAction],
  );

  /** clear entire toast history */

  const clearToastHistory = React.useCallback(() => setToastsHistory([]), []);

  return (
    <ToastContext.Provider
      value={{
        dispatch,
        dismiss,
        dismissAll,
        toasts,
        toastsHistory,
        clearToastHistory,
      }}
    >
      {children}

      {renderInProvider && !!toasts.length && (
        <ToastContainer
          settings={settings}
          toasts={toasts}
          dismissToast={dismiss}
        />
      )}
    </ToastContext.Provider>
  );
};

ToastProvider.defaultProps = {
  location: "top right",
  dismissButton: <Icon icon={Icon.Icomoon.cross} />,
  dismissTime: 500,
  disableAutodismissOnHover: true,
  renderInProvider: true,
  renderTimestamp: "below title",
  timestampFormat: "HH:mm",
};

/// TOAST HOOK

interface IUseToastReturn {
  /** dispatch a toast notification */
  dispatch: DispatchToast;

  /** dimiss a toast notification by its index */
  dismiss: DismissToast;

  /** dimiss all toast notifications */
  dismissAll: () => void;

  /** all the current toast notifications - use if they are to be rendered elsewhere */
  toasts: IToastNotification[];

  /** all previous toasts this session */
  toastsHistory: IToastNotification[];

  /** clears entire toast history */
  clearToastHistory: () => void;
}

/** Use toast notifications — returns a method that dispatches a toast notification to the ToastContext, which renders it in the ToastProvider component, as well as methods to dismiss notifications */

export const useToast = (): IUseToastReturn => {
  const context = React.useContext(ToastContext);

  if (!context) {
    // tslint:disable-next-line: no-console
    console.error(
      "You are trying to use a useToast hook outside a ToastProvider, this will not work.",
    );

    return;
  }

  const {
    dismiss,
    dismissAll,
    toasts,
    toastsHistory,
    clearToastHistory,
  } = context;

  const dispatch = (...toasts: IToastNotification[]) =>
    context.dispatch(
      ...toasts.map(toast => ({ timestamp: +moment(), ...toast })),
    );

  return {
    dispatch,
    dismiss,
    dismissAll,
    toasts,
    toastsHistory,
    clearToastHistory,
  };
};

/// TOAST CONTAINER

interface IToastContainerProps {
  dismissToast: (index: number) => void;
  settings: IGlobalToastSettings;
  toasts: IToastNotification[];
}

interface IToastContainerInnerCornerProps extends IToastContainerProps {
  location: ToastLocation;
}

const ToastContainerInnerCorner: React.FC<IToastContainerInnerCornerProps> = ({
  toasts,
  dismissToast,
  settings,
  location,
}) => (
  <div className={`toasts toasts-${location.replace(/ /g, "-")}`}>
    {toasts.map((toast, i) => (
      <Toast
        {...toast}
        onDismiss={() => dismissToast(i)}
        settings={settings}
        key={JSON.stringify(toast)}
      />
    ))}
  </div>
);

const ToastContainerInner: React.FC<IToastContainerProps> = ({
  settings,
  dismissToast,
  toasts,
}) => {
  const seperatedToasts = React.useMemo(() => {
    const allToasts: {
      [key in ToastLocation]: IToastNotification[];
    } = {
      "top left": [],
      "top right": [],
      "bottom left": [],
      "bottom right": [],
    };

    toasts.forEach(toast => {
      allToasts[toast.location || settings.location].push(toast);
    });

    return allToasts;
  }, [toasts]);

  return (
    <div className="toast-container">
      {Object.keys(seperatedToasts).map(key => (
        <ToastContainerInnerCorner
          toasts={seperatedToasts[key]}
          location={key as ToastLocation}
          dismissToast={dismissToast}
          settings={settings}
          key={key}
        />
      ))}
    </div>
  );
};

/** Renders the toasts in a list in a fixed element overlaying everything */

const ToastContainer: React.FC<IToastContainerProps> = props => {
  if (typeof document === "undefined") {
    return null
  }

  if (props.settings.hostElement) {
    return ReactDOM.createPortal(
      <ToastContainerInner {...props} />,
      document.querySelector(props.settings.hostElement),
    );
  }
  return <ToastContainerInner {...props} />;
};

/// TOAST

interface IToastProps extends IToastNotification {
  settings: IGlobalToastSettings;
  onDismiss: () => void;
}

/** Renders a single dismissable toast — if you're happy with the default toast behaviour DONT USE THIS, the ToastProvider component will render all your toasts with animations and stuff like that. This is only if you're overriding that behaviour/layout but still want to use the Armstrong Toast component */

const ToastDate: React.FC<{
  timestamp: number;
  settings: IGlobalToastSettings;
}> = ({ timestamp, settings }) =>
  settings.renderTimestamp ? (
    <p className="toast-timestamp">
      {moment.unix(timestamp / 1000).format(settings.timestampFormat)}
    </p>
  ) : null;

export const Toast: React.FC<IToastProps> = ({
  title,
  message: description,
  type,
  settings,
  autodismiss,
  content,
  onDismiss,
  timestamp,
  className,
  allowManualDismiss,
}) => {
  const autoDismissTimeout = React.useRef(null);
  const dismissingTimeout = React.useRef(null);

  const ref = React.useRef<HTMLDivElement>(null);

  const [dismissing, setDismissing] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);

  /** start dismiss of notification, set state to play animation and set up timeout for the actual removal from the toast array */

  const dismiss = React.useCallback(() => {
    setDismissing(true);

    dismissingTimeout.current = setTimeout(() => {
      setDismissed(true);
    }, settings.dismissTime);
  }, [settings.dismissTime, dismissingTimeout.current]);

  /** start timeout to autodismiss */

  const initialiseAutodismiss = React.useCallback(() => {
    if (autodismiss !== undefined) {
      autoDismissTimeout.current = setTimeout(dismiss, autodismiss);
    }
  }, [autodismiss, autoDismissTimeout.current, dismiss]);

  /** if set to, stop the autodismiss timeout on mouse enter */

  const mouseEnter = React.useCallback(
    () =>
      settings.disableAutodismissOnHover &&
      clearTimeout(autoDismissTimeout.current),
    [autoDismissTimeout.current, settings.disableAutodismissOnHover],
  );

  /** if set to, retrigger the autodismiss timeout on mouse leave */

  const mouseLeave = React.useCallback(
    () => settings.disableAutodismissOnHover && initialiseAutodismiss(),
    [initialiseAutodismiss, settings.disableAutodismissOnHover],
  );

  // set up autodismiss, and clear timeouts on cleanup

  React.useEffect(() => {
    initialiseAutodismiss();

    return () => {
      clearTimeout(autoDismissTimeout.current);
      clearTimeout(dismissingTimeout.current);
    };
  }, []);

  // Effect to listen to dismissed state, and call passed in dismiss method - needs to work like this, as the callback passed into
  // dismiss timeout doesn't update from the timeout being fired, but it needs to know the current index of the notification

  React.useEffect(() => {
    if (dismissed) {
      onDismiss();
    }
  }, [dismissed]);

  /** time for a step of the transition - one step is the time to disappear or reappear, the other is to expand or unexpand the space it's in */

  const transitionStep = React.useMemo(() => settings.dismissTime / 2 + "ms", [
    settings.dismissTime,
  ]);

  /** shhh */

  const actuallyToastStyles = React.useMemo<React.CSSProperties>(
    () =>
      (settings as any).butItsActuallyToast
        ? {
            backgroundImage:
              (settings as any).butItsActuallyToast &&
              "url(https://pngriver.com/wp-content/uploads/2018/04/Download-Toast-PNG-Photos.png)",
            backgroundSize:
              (settings as any).butItsActuallyToast && "100% 100%",
            backgroundColor: "transparent",
            boxShadow: "none",
          }
        : {},
    [(settings as any).butItsActuallyToast],
  );

  return (
    <div
      className={ClassHelpers.classNames("toast-notification", className)}
      data-type={type}
      data-dismissing={dismissing}
      ref={ref}
      onMouseEnter={mouseEnter}
      onMouseLeave={mouseLeave}
      style={{
        transitionDelay: transitionStep,
        transitionDuration: transitionStep,
        animationDuration: transitionStep,
      }}
    >
      <div
        className="toast-notification-inner"
        style={{
          transitionDuration: transitionStep,
          animationDelay: transitionStep,
          animationDuration: transitionStep,
          ...actuallyToastStyles,
        }}
      >
        {(allowManualDismiss || settings.renderTimestamp || title) && (
          <div className="toast-notification-top">
            <div>
              <h3>{title}</h3>

              {settings.renderTimestamp === "below title" && (
                <ToastDate timestamp={timestamp} settings={settings} />
              )}
            </div>

            {allowManualDismiss && (
              <div className="toast-dismiss" onClick={dismiss}>
                {settings.dismissButton}
              </div>
            )}
          </div>
        )}

        <p>{description}</p>

        {typeof content === "function"
          ? content({ dismiss, timestamp })
          : content}

        {settings.renderTimestamp === "below content" && (
          <ToastDate timestamp={timestamp} settings={settings} />
        )}
      </div>
    </div>
  );
};

Toast.defaultProps = {
  allowManualDismiss: true,
};
