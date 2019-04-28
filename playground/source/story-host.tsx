import * as React from "react";

interface IComponentStories {
  name: string
  stories: IComponentStory[]
}

interface IComponentStory {
  name: string
  comp: React.FunctionComponent<any>
}
const comps: IComponentStories[] = []
/*

.row {
  display: flex;
}

.column {
  flex: 50%;
}
*/
export function StoryHost() {
  const [Comp, setComp] = React.useState<React.FunctionComponent<any>>(null)
  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: "30%" }}>
        <ul>
          {comps.map((c, i) => {
            return (
              <li key={i}>
                {c.name}
                <ul>
                  {c.stories.map((s, j) => <li key={j} onClick={() => setComp(s.comp)}>{s.name}</li>)}
                </ul>
              </li>
            )
          })}
        </ul>
      </div>
      <div style={{ flex: "70%" }}>{Comp}</div>

    </div>
  )
}

class StoryFor<P>{
  private stories: IComponentStories
  constructor(storyName: string, private component: React.ComponentType<P>) {
    this.stories = { name: storyName, stories: [] }
    comps.push(this.stories)
  }
  props(name: string, props: () => P) {
    this.stories.stories.push({ name, comp: () => React.createElement(this.component, props()) })
    return this
  }
  add(name: string, storyComponent: React.FunctionComponent<any>) {
    this.stories.stories.push({ name, comp: () => React.createElement(storyComponent) })
    return this
  }
}

export function storiesOf<P>(storyName: string, component: React.ComponentType<P>) {
  return new StoryFor<P>(storyName, component)
}