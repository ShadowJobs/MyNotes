import { message } from "antd"
import React from "react"

export class Comp1 extends React.PureComponent{
    state={label:"000"}
    changeLabel=(v)=>{
        this.setState({label:v})
    }
    componentDidMount(){
        window.EventBus.on("CHANGE_LABEL",this.changeLabel)

        setTimeout(()=>{message.info("clicked"+this.state.label)},1000)
    }
    render(){
        return <div className="with-border">
            {this.state.label}
        </div>
    }
}