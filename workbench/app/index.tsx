// LIBS
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, Link, hashHistory, IndexRoute } from 'react-router';

// VIEWS
import { Home } from "./views/home/home";

// STYLES
import "./theme/theme.scss";

// HISTORY
//const hist = history();

// APP WRAPPER
class App extends React.Component<any, {}> {
  public render() {
    const view = this.props.children;
    return (
      <main>
        { this.props.children }
      </main>
    );
  }
}

// ROUTER
ReactDOM.render((
  <Router history={ hashHistory }>
    <Route path="/" component={ App }>
      <IndexRoute component={ Home } />
      </Route>
    </Router>
), document.getElementById('app-content'));
