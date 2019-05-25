import * as React from "react";
import * as _ from "underscore";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

interface IComponentStories {
  name: string
  stories: IComponentStory[]
}

interface IComponentStory {
  name: string
  comp: React.FunctionComponent<any>
}
const comps: IComponentStories[] = []

function makeUrlPart(value: string) {
  return value.toLowerCase().replace(/ /g, "")
}
function makeUrl(c: IComponentStories, s: IComponentStory) {
  return `/${makeUrlPart(c.name)}/${makeUrlPart(s.name)}`
}
export function StoryHost() {
  const sortedComps = _.sortBy(comps, c => c.name)
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <div style={{ flex: "30%" }}>
          <ul>
            {sortedComps.map((c, i) => {
              const sorted = _.sortBy(c.stories, c => c.name)

              return (
                <li key={i}>
                  {c.name}
                  <ul>
                    {sorted.map((s, j) => {
                      return (
                        <li key={j}><Link to={makeUrl(c, s)}>{s.name}</Link></li>
                      )
                    })}
                  </ul>
                </li>
              )
            })}
          </ul>
        </div>
        <div style={{ flex: "70%" }}>
          {comps.map((c) => {
            return c.stories.map((s, i) => {
              return (
                <Route key={i} path={makeUrl(c, s)} exact component={s.comp} />
              )
            })
          })}
        </div>
      </div>
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