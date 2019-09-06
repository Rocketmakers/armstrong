// COMING SOON — actual toast with butter

import * as React from "react";
import { Icon } from "../../../../storybook/src/_symlink/components/display/icon";

type DispatchToast = (toast: IToastNotification) => void;

/** PROVIDER */

type ToastLocation = "top left" | "top right" | "bottom left" | "bottom right";

export interface IGlobalToastSettings {
  /** area of the screen for toasts to render in */
  location?: ToastLocation;

  /** jsx to render as a dismiss button - an icomoon cross by default */
  dismissButton?: JSX.Element;
}

const defaultGlobalToastSettings: IGlobalToastSettings = {
  location: "bottom right",
};

interface IToastProviderContext {
  dispatch: DispatchToast;
}

const ToastProviderContext = React.createContext<IToastProviderContext>(
  undefined,
);

interface IToastContainerProps {
  dismissToast: (index: number) => void;
  settings: IGlobalToastSettings;
  toasts: IToastNotification[];
}

const ToastContainer: React.FC<IToastContainerProps> = ({
  settings,
  dismissToast,
  toasts,
}) => {
  return (
    <div className="toast-container" data-location={settings.location}>
      {toasts.map((toast, i) => (
        <Toast
          {...toast}
          onDismiss={() => dismissToast(i)}
          settings={settings}
        />
      ))}
    </div>
  );
};

interface IToastProviderProps {
  settings: IGlobalToastSettings;
}

export const ToastProvider: React.FC<IToastProviderProps> = ({
  settings,
  children,
}) => {
  const [toasts, setToasts] = React.useState<IToastNotification[]>([]);

  const dispatch = React.useCallback(
    (newToast: IToastNotification) => {
      setToasts([...toasts, newToast]);
    },
    [toasts],
  );

  const dismiss = React.useCallback(
    (index: number) => {
      const newToasts = toasts;
      newToasts.splice(index);
      setToasts(newToasts);
    },
    [toasts],
  );

  return (
    <ToastProviderContext.Provider value={{ dispatch }}>
      <ToastContainer
        settings={settings}
        toasts={toasts}
        dismissToast={dismiss}
      />
      {children}
    </ToastProviderContext.Provider>
  );
};

ToastProvider.defaultProps = { settings: defaultGlobalToastSettings };

/** TOAST HOOK */

interface IUseToastReturn {
  /** dispatch a toast notification */
  dispatch: DispatchToast;
}

const useToast = (): IUseToastReturn => {
  const dispatch = React.useCallback((notification: IToastNotification) => {},
  []);

  return { dispatch };
};

/** NOTIFICATIONS */

export interface IToastNotification {
  title?: string;
  description: string;

  /** will be put into the toast notification as a data attribute, used to style different types of notifications IE alert / error */
  type: string;

  /** amount of time for the notification to autodismiss - will not autodismiss if left undefined */
  autodismiss?: number;
}

interface IToastProps extends IToastNotification {
  settings: IGlobalToastSettings;
  onDismiss: () => void;
}

const Toast: React.FC<IToastProps> = ({
  title,
  description,
  type,
  settings,
  onDismiss,
}) => (
  <div className="toast-notification" data-type={type}>
    <h3>{title}</h3>
    <p>{description}</p>
    <div className="toast-dismiss" onClick={onDismiss}>
      {settings.dismissButton || <Icon icon={Icon.Icomoon.cross} />}
    </div>
  </div>
);
