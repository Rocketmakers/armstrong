<p align="center">
<img src="http://armstrongcss.org/assets/logolarge.svg" width="256" height="256" />
</p>

# armstrong-react

Armstrong React - [Rocketmakers](http://www.rocketmakers.com/) React component library.

## 1.0 Breaking changes

#### Imports

All virtual classes have been removed. Don't extend armstrong classes in your css or you WILL get duplication issues. This is due to how TSX and SCSS imports work.
There are also now more files to import to cut down on size. They are self explanatory and as follows:
```
@import "~armstrong-react/dist/imports";
@import "~armstrong-react/dist/style";
@import "~armstrong-react/dist/form";
@import "~armstrong-react/dist/responsive";
@import "~armstrong-react/dist/nav";
```

#### Grid - CenterContent

Center content has been deprecated and is replaced with 2 new properties. HorizontalAlignment and Vertical alignment.

#### Grid - Fixed on row and col

Rows now take a height prop which supports either a number or the string 'auto'. Cols are the same but with a width property.
You can now also use XAML-style star widths/heights. For example a 2 col layout with `width='1*'` and a `width='2*'` would split into a 1 3rd 2 3rds ratio

#### Grid - SingleColumnRow

This is no more! Just write the markup `<Row><Col></Col></Row>` or make your own component. It was messy and unmaintainable before

#### Button

Button no longer has a text property. You can pass anything, be it text or a component as its child. Shadows have been removed by default, if you want them add the class `shadow`.
The default bottom margin has been removed to make it more flexible. Just pad your container or add `m-bottom-small` if you'd like a margin.

#### Form - Calendar & Datepickers

 - TimeSelector is no more
 - DatepickerInput has been renamed CalendarInput.
 - There are also now DateInput and TimeInput controls.
 - CalendarInput now only takes strings, so moment.js is now just an implementation detail
 - CalendarInput no longer takes a locale prop. Instead import `ArmstrongConfig` and call `setLocale` once, probably on app startup.

#### Form - Dropdownselect

Dropdownselect has been renamed to AutoCompleteInput to better reflect what it actually does

## Introduction

A library of components for React/SCSS interface development.

>The Rokot platform components heavily rely on usage of the [typings](https://github.com/typings/typings) utility for typescript definitions management.
If you don't have `typings` installed:
```
npm i typings -g
```

## Getting Started

>WARNING!: This library assumes you're using React and SASS.

### Installation
Install via `npm`
```
npm i armstrong-react --save
```

### Typings

You will need to install these ambient dependencies:
>NOTE: you may already have some of these ambient dependencies installed!

```
typings install react underscore classnames node -SA
```

## Importing the SCSS

To make use of the default styles, you'll need to import a single SCSS entry point from the module into your root stylesheet. The simplest way of achieving this is to use [webpack](https://webpack.github.io)'s [sass-loader](https://github.com/jtangelder/sass-loader) plugin and add the following line to your root SCSS file:
```scss
@import "~armstrong-react/dist/style";
```
>NOTE: If you're not using webpack, you can use an absolute or relative path through your node_modules folder.

## Example: Adding a simple Armstrong Button (TypeScript/JSX):

```javascript
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Button } from "armstrong-react";

export class MyComponent extends React.Component<{}, {}> {

  private buttonClicked(e) {
    console.log('Clicked!')
  }

  public render() {
    return (
      <main>
        <h1>Below is a button!</h1>
        <Button text="Armstrong lives!" condition="info" onClick={ this.buttonClicked } />
      </main>
    );
  }
}
```

## Workbench folder?
Don't worry about this ;)

## Consumed Libraries

#### [Underscore](http://underscorejs.org)
#### [Classnames](https://github.com/JedWatson/classnames)
