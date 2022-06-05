import { Button } from "antd"
import React from "react"

export class Comp2 extends React.PureComponent{
    state={label:""}
    send=(v)=>{
        window.EventBus.emit("CHANGE_LABEL",v)
    }
    render(){
        return <div className="with-border">
            <Button onClick={()=>this.send("发送了123")}>发事件</Button>
        </div>
    }
}