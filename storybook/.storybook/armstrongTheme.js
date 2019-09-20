import { create } from '@storybook/theming';

export default create({
  base: 'light',

  colorPrimary: '#F5503D',
  colorSecondary: 'deepskyblue',

  // UI
  appBg: 'white',
  appBorderRadius: 0,

  // Typography
  fontBase: '"Cabin", sans-serif',

  // Text colors
  textColor: 'black',
  textInverseColor: 'rgba(255,255,255,0.9)',

  // Toolbar default and active colors
  // barTextColor: 'white',
  // barSelectedColor: 'black',
  // barBg: '#F5503D',

  // Form colors
  inputBg: 'white',
  inputBorder: 'silver',
  inputTextColor: 'black',
  inputBorderRadius: 4,

  brandTitle: 'Armstrong storybook',
  brandImage: require('../src/assets/images/logo.svg'),
});