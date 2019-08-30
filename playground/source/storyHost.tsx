import * as React from "react";
import * as _ from "underscore";
import * as _s from "underscore.string";
import * as jsxToString from 'jsx-to-string';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import reactElementToJSXString from 'react-element-to-jsx-string';

import "./storyHost.scss";
import { Button, Icon } from './_symlink';
import { IButton } from './_symlink/components/interaction/button';

interface IComponentStories {
  name: string
  stories: IComponentStory[]
}

interface IComponentStory {
  name: string
  comp: React.FunctionComponent<any>
}
const comps: IComponentStories[] = []

function makeSlug(value: string) {
  return _s.dasherize(value).substring(1)
}

function makeUrl(c: IComponentStories, s: IComponentStory) {
  return `/${makeSlug(c.name)}/${makeSlug(s.name)}`
}
export function StoryHost() {

  const sortedComps = _.sortBy(comps, c => c.name)
  return (
    <Router>
      <header>
        <img src={require('./assets/armstrong.svg')} />
      </header>
      <main>
        <div className="sidebar">
          {sortedComps.map((c, i) => {
            const sorted = _.sortBy(c.stories, c => c.name)

            return (
              <div className="story" key={i}>
                <div className="story-name">{c.name}</div>
                <ul>
                  {sorted.map((s, j) => <li key={j}><Link to={makeUrl(c, s)}>{s.name}</Link></li>)}
                </ul>
              </div>
            )
          })}
        </div>
        <div className="content">
          {/* {selectedStory && <h1>{selectedStory.name}</h1>} */}
          {comps.map((c) => {
            return c.stories.map((s, i) => {
              return (
                <Route key={i} path={makeUrl(c, s)} exact render={() => {
                  let cn = <s.comp />
                  return (<>
                    <h1>{c.name}</h1>
                    <h2>{s.name}</h2>
                    <s.comp />
                    {reactElementToJSXString(cn, { showFunctions: true, displayName: e => c.name })}
                  </>)
                }
                } />
              )
            })
          })}

        </div>
      </main>
    </Router>
  )
}

class StoryForHook {
  protected stories: IComponentStories
  constructor(storyName: string) {
    this.stories = { name: storyName, stories: [] }
    comps.push(this.stories)
  }
  add(name: string, storyComponent: React.FunctionComponent<any>) {
    this.stories.stories.push({ name, comp: () => React.createElement(storyComponent) })
    return this
  }
}

class StoryFor<P> extends StoryForHook {
  constructor(storyName: string, private component: React.ComponentType<P>) {
    super(storyName)
  }
  props(name: string, props: () => P) {
    this.stories.stories.push({ name, comp: () => React.createElement(this.component, props()) })
    return this
  }
}

export function storiesOf<P>(storyName: string, component: React.ComponentType<P>) {
  return new StoryFor<P>(storyName, component)
}

export function storiesOfHook(storyName: string) {
  return new StoryForHook(storyName)
}