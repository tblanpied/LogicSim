import "../css/component_picker.css";
import React from 'react';
import ComponentPickerItem from "./component_picker_item";

class ComponentPicker extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            search: props.search
        };

        this.components = [
            {name: "7 segment display", icon: "/icons/icon-7segmentdisplay.png"},
            {name: "push button", icon: "/icons/icon-PushButton.png"},
            {name: "AND gate", icon: "/icons/icon-AndGate.png"},
            {name: "NOT gate", icon: "/icons/icon-NotGate.png"},
            {name: "Light bulb", icon: "/icons/icon-LightBulb.png"},
            {name: "Switch", icon: "/icons/icon-Switch.png"},
            {name: "Clock", icon: "/icons/icon-Clock.png"}
        ];
    }

    componentDidUpdate(prevProps) {
        if (prevProps.search !== this.props.search) {
            this.setState({
                search: this.props.search
            });
        }
    }

    render(){
        var componentsItems = []
        for(let i = 0; i < this.components.length; i++){
            componentsItems.push(<ComponentPickerItem display={this.components[i].name.toLowerCase().includes(this.state.search.toLowerCase())} key={i} name={this.components[i].name} icon={this.components[i].icon}></ComponentPickerItem>);
        }
        return(
            <div className="component_picker">
                {componentsItems}
            </div>
        );
    }
}

export default ComponentPicker;