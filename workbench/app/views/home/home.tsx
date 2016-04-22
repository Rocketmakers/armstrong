// IMPORTS
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Image } from './../../../../source/components/display/image'

// STYLES
import "./home.scss";

export class Home extends React.Component<{}, {}> {

  public render() {
    return (
      <main>
        <Image height={128} width={128} sampleUser={true} seed="Jason Dorell"/>
        <h1>Welcome to Project Skeleton</h1>
        <p>You are currently running in the <strong>{ rmConfig.getEnvironment() }</strong> environment</p>
        <p>Below is an example showing how to load a static asset in a way which allows webpack to find and compile it. This is done using a relative path and the <b>require</b> method.</p>
        <div className="rocket-logo">
          <img src={ require('../../assets/graphics/headerlogo.png') } />
        </div>
        <p>Assets linked to in stylesheets can be referenced in the usual way with relative paths. Webpack will pick these up and compile them automatically.</p>
        <p>If you're looking for this page, it's here: <b>./app/views/home/home.tsx</b></p>
      </main>
    );
  }
}
