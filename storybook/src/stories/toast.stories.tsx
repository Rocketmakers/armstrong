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
      DISPATCH A DUDE
    </Button>
  );
};

storiesOf('Toast', module).add('Simple Toast', () => (
  <ToastProvider>
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
      DISPATCH A DUDE
    </Button>
  );
};

storiesOf('Toast', module).add('Toast with content', () => (
  <ToastProvider location='bottom left'>
    <ComplexInner />
  </ToastProvider>
));

storiesOf('Toast', module).add('Customised dismiss button', () => (
  <ToastProvider
    location='top right'
    dismissButton={<Icon icon={Icon.Icomoon.arrowRight3} />}
  >
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
        DISPATCH A DUDE
      </Button>

      <Button onClick={dismissAll}>CLEAR ALL TOASTS</Button>

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

storiesOf('Toast', module).add('Custom toasts', () => (
  <ToastProvider
    location='top right'
    dismissButton={<Icon icon={Icon.Icomoon.arrowRight3} />}
    renderInProvider={false}
  >
    <CustomInner />
  </ToastProvider>
));
