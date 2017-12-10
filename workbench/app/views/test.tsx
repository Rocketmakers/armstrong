import * as React from "react";

export class Test extends React.Component {
  render() {
    return (
      <div>
       <div style={{ animationDelay: '0.1s'}} className="loop animatable slide-in-left">Slide in left</div>
       <div style={{ animationDelay: '0.2s'}} className="loop animatable slide-in-right">Slide in right</div>
       <div style={{ animationDelay: '0.3s'}} className="loop animatable slide-in-up">Slide in up</div>
       <div style={{ animationDelay: '0.4s'}} className="loop animatable slide-in-down">Slide in down</div>
       <div style={{ animationDelay: '0.1s'}} className="loop animatable slide-out-left">Slide out left</div>
       <div style={{ animationDelay: '0.2s'}} className="loop animatable slide-out-right">Slide out right</div>
       <div style={{ animationDelay: '0.3s'}} className="loop animatable slide-out-up">Slide out up</div>
       <div style={{ animationDelay: '0.4s'}} className="loop animatable slide-out-down">Slide out down</div>
       <div style={{ animationDelay: '0.5s'}} className="loop animatable fade-in">Fade in</div>
       <div style={{ animationDelay: '0.5s'}} className="loop animatable fade-out">Fade out</div>
       <div style={{ animationDelay: '0.6s'}} className="loop animatable scale-down-in">Scale down in</div>
       <div style={{ animationDelay: '0.7s'}} className="loop animatable scale-up-in">Scale up in</div>
      </div>
    )
  }
}