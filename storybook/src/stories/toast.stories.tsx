import * as React from 'react';

import { storiesOf } from '@storybook/react';
import { ToastProvider, useToast, Button, TextInput, Icon } from '../_symlink';

import '../theme/theme.scss';

const BasicInner = () => {
  const { dispatch } = useToast();

  return (
    <>
      <Button
        style={{ margin: '10px' }}
        onClick={() =>
          dispatch({
            title: 'Info',
            message: "I'm a toast",
            type: 'info',
            autodismiss: 6000
          })
        }
      >
        Dispatch an info Notification
      </Button>

      <Button
        style={{ margin: '10px' }}
        onClick={() =>
          dispatch({
            title: 'Warning',
            message: "I'm a warning",
            type: 'warning',
            autodismiss: 6000
          })
        }
      >
        Dispatch a warning Notification
      </Button>

      <Button
        style={{ margin: '10px' }}
        onClick={() =>
          dispatch({
            title: 'Error',
            message: "I'm an error.... ruh roh",
            type: 'error',
            autodismiss: 6000
          })
        }
      >
        Dispatch an error Notification
      </Button>

      <Button
        style={{ margin: '10px' }}
        onClick={() =>
          dispatch({
            title: 'Success',
            message: "I'm a success notification! Isn't that nice!",
            type: 'success',
            autodismiss: 6000
          })
        }
      >
        Dispatch a success Notification
      </Button>

      <Button
        style={{ margin: '10px' }}
        onClick={() =>
          dispatch({
            title: 'Top left',
            message: "Look at me i'm in the top left...",
            type: 'success',
            autodismiss: 6000,
            location: 'top left'
          })
        }
      >
        Dispatch a notification to the top left
      </Button>
    </>
  );
};

const ComplexInner = () => {
  const { dispatch } = useToast();

  return (
    <Button
      style={{ margin: '10px' }}
      onClick={() =>
        dispatch({
          title: 'TOAST',
          type: 'warning',
          allowManualDismiss: false,
          content: ({ dismiss }) => (
            <>
              <p>Look at this here</p>
              <TextInput />
              <Button style={{ margin: '10px' }} onClick={dismiss}>
                Dismiss
              </Button>
            </>
          )
        })
      }
    >
      Dispatch a Toast Notification
    </Button>
  );
};

const CustomInner = () => {
  const { dispatch, toasts, dismiss, dismissAll } = useToast();

  return (
    <div>
      <Button
        style={{ margin: '10px' }}
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

      <Button style={{ margin: '10px' }} onClick={dismissAll}>
        Clear all Toasts
      </Button>

      <div className='toasts'>
        {toasts.map((toast, i) => (
          <div
            style={{
              border: '1px solid black',
              margin: '15px',
              padding: '10px'
            }}
            key={i}
          >
            <h3>{toast.title}</h3>
            <p>{toast.message}</p>
            {typeof toast.content === 'function'
              ? toast.content({
                  dismiss: () => dismiss(i),
                  timestamp: toast.timestamp
                })
              : toast.content}
          </div>
        ))}
      </div>
    </div>
  );
};

const HistoryInner = () => {
  const { dispatch, toastsHistory, clearToastHistory } = useToast();

  return (
    <>
      <Button
        style={{ margin: '10px' }}
        onClick={() =>
          dispatch({
            title: 'TOAST',
            type: 'error',
            message: 'look at this one!',
            autodismiss: 5000
          })
        }
      >
        Dispatch a Toast Notification
      </Button>

      <Button style={{ margin: '10px' }} onClick={clearToastHistory}>
        Clear Toast Notifications
      </Button>

      <div className='notifications'>
        {toastsHistory.map((toast, i) => (
          <p key={i}>
            {toast.title} — {toast.timestamp}
          </p>
        ))}
      </div>
    </>
  );
};

const BigDemoInner = () => {
  const { dispatch } = useToast();

  const onClick = React.useCallback(() => {
    dispatch(
      {
        title: 'Info',
        type: 'info',
        message: 'Toasty time - look at it go!',
        autodismiss: 5000
      },
      {
        title: 'Look',
        type: 'info',
        message: 'Hi there!',
        autodismiss: 5000,
        location: 'bottom right'
      },
      {
        title: 'TOAST',
        type: 'warning',
        message: 'Toasty time - look at it go!',
        autodismiss: 5000
      },
      {
        title: 'TOAST',
        type: 'warning',
        message: 'Toasty time - look at it go!',
        content: (
          <img src='https://static.independent.co.uk/s3fs-public/thumbnails/image/2018/03/14/14/bread-waste.jpg?w968h681' />
        ),
        location: 'bottom left',
        autodismiss: 10000
      },
      {
        title: 'Look heres some more toast',
        type: 'success',
        message: 'Check out this cool video about my hero!',
        content: (
          <iframe
            width='560'
            height='315'
            src='https://www.youtube.com/embed/P40sJOkxnac'
            allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
          />
        ),
        location: 'top left'
      }
    );
  }, [dispatch]);

  return (
    <>
      <Button style={{ margin: '10px' }} onClick={onClick}>
        Dispatch a Toast Notification
      </Button>
    </>
  );
};

storiesOf('Toasts', module)
  .addParameters({
    options: {
      showAddonPanel: true
    }
  })
  .add('Simple Toast', () => (
    <ToastProvider>
      <p>
        Armstrong toasts, dispatched by the useToast hook, and handled by the
        ToastProvider component by default. Different types of notification are
      </p>

      <BasicInner />
    </ToastProvider>
  ))
  .add('Toast with custom JSX content', () => (
    <ToastProvider location='bottom left'>
      <p>
        Custom JSX content can be rendered on a per toast basis, passed into the
        dispatch function returned by useToast
      </p>

      <ComplexInner />
    </ToastProvider>
  ))
  .add('Customised dismiss button', () => (
    <ToastProvider
      location='top right'
      dismissButton={<Icon icon={Icon.Icomoon.arrowRight3} />}
    >
      <p>The dismiss button has been changed to an arrow</p>

      <BasicInner />
    </ToastProvider>
  ))
  .add('Custom toasts', () => (
    <ToastProvider
      location='top right'
      dismissButton={<Icon icon={Icon.Icomoon.arrowRight3} />}
      renderInProvider={false}
    >
      <p>
        Default rendering has been disabled for these toasts and they are
        rendered manually using the useToast hook.
      </p>

      <CustomInner />
    </ToastProvider>
  ))
  .add('Portaled toasts', () => (
    <ToastProvider location='top right' hostElement='body'>
      <p>These toasts are portaled into the body using the hostElement prop</p>

      <BasicInner />
    </ToastProvider>
  ))
  .add('Toast history', () => (
    <ToastProvider
      location='top right'
      dismissButton={<Icon icon={Icon.Icomoon.arrowRight3} />}
      hostElement='body'
      saveHistory
    >
      <p>
        These toasts are kept in a toast history state, and can be rendered
        elsewhere - ie in a notification centre
      </p>

      <HistoryInner />
    </ToastProvider>
  ))
  .add('Big demo', () => (
    <ToastProvider location='top right' hostElement='body' saveHistory>
      <p>Here's a demo with a bunch of stuff happening</p>

      <BigDemoInner />
    </ToastProvider>
  ));
