import * as React from 'react';

import { storiesOf } from '@storybook/react';
import { ToastProvider, useToast, Button, TextInput, Icon } from '../_symlink';

import '../theme/theme.scss';

const BasicInner = () => {
  const { dispatch } = useToast();

  return (
    <Button
      onClick={() =>
        dispatch({
          title: 'TOAST',
          message: "I'm a toast",
          type: 'info',
          autodismiss: 6000
        })
      }
    >
      Dispatch a Toast Notification
    </Button>
  );
};

storiesOf('Toasts', module).add('Simple Toast', () => (
  <ToastProvider>
    <p>
      Armstrong toasts, dispatched by the useToast hook, and handled by the
      ToastProvider component by default.
    </p>

    <BasicInner />
  </ToastProvider>
));

const ComplexInner = () => {
  const { dispatch } = useToast();

  return (
    <Button
      onClick={() =>
        dispatch({
          title: 'TOAST',
          type: 'warning',
          allowManualDismiss: false,
          content: dismiss => (
            <>
              <p>Look at this here</p>
              <TextInput />
              <Button onClick={dismiss}>Dismiss</Button>
            </>
          )
        })
      }
    >
      Dispatch a Toast Notification
    </Button>
  );
};

storiesOf('Toasts', module).add('Toast with custom JSX content', () => (
  <ToastProvider location='bottom left'>
    <p>
      Custom JSX content can be rendered on a per toast basis, passed into the
      dispatch function returned by useToast
    </p>

    <ComplexInner />
  </ToastProvider>
));

storiesOf('Toasts', module).add('Customised dismiss button', () => (
  <ToastProvider
    location='top right'
    dismissButton={<Icon icon={Icon.Icomoon.arrowRight3} />}
  >
    <p>The dismiss button has been changed to an arrow</p>

    <BasicInner />
  </ToastProvider>
));

const CustomInner = () => {
  const { dispatch, toasts, dismiss, dismissAll } = useToast();

  return (
    <div>
      <Button
        onClick={() =>
          dispatch({
            title: 'TOAST',
            type: 'warning',
            content: <p>This is a good toast</p>
          })
        }
      >
        Dispatch a Toast Notification
      </Button>

      <Button onClick={dismissAll}>Clear all Toasts</Button>

      <div className='toasts'>
        {toasts.map((toast, i) => (
          <div
            style={{
              border: '1px solid black',
              margin: '15px',
              padding: '10px'
            }}
          >
            <h3>{toast.title}</h3>
            <p>{toast.message}</p>
            {typeof toast.content === 'function'
              ? toast.content(() => dismiss(i))
              : toast.content}
          </div>
        ))}
      </div>
    </div>
  );
};

storiesOf('Toasts', module).add('Custom toasts', () => (
  <ToastProvider
    location='top right'
    dismissButton={<Icon icon={Icon.Icomoon.arrowRight3} />}
    renderInProvider={false}
  >
    <p>
      Default rendering has been disabled for these toasts and they are rendered
      manually using the useToast hook.
    </p>

    <CustomInner />
  </ToastProvider>
));

storiesOf('Toasts', module).add('Portaled toasts', () => (
  <ToastProvider
    location='top right'
    dismissButton={<Icon icon={Icon.Icomoon.arrowRight3} />}
    hostElement='body'
  >
    <p>These toasts are portaled into the body using the hostElement prop</p>

    <BasicInner />
  </ToastProvider>
));
