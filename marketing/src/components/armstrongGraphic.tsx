import * as React from "react"

import "./armstrongGraphic.scss"

export const Capsule = () => <img src={require("../assets/capsule.svg")} className="capsule" />

export const Space = () => {
    return <img src={require("../assets/space.svg")} className="space" />
}

export const ArmstrongGraphic = () => {
    return <div className="armstrong-graphic">
        <Space />
        <Capsule />
    </div>
}


