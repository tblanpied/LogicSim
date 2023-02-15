import "../css/component_picker.css";
import React from 'react';
import ComponentPickerItem from "./component_picker_item";

class ComponentPicker extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="component_picker">
                <ComponentPickerItem></ComponentPickerItem>
                <ComponentPickerItem></ComponentPickerItem>
                <ComponentPickerItem></ComponentPickerItem>
                <ComponentPickerItem></ComponentPickerItem>
                <ComponentPickerItem></ComponentPickerItem>
                <ComponentPickerItem></ComponentPickerItem>
                <ComponentPickerItem></ComponentPickerItem>
                <ComponentPickerItem></ComponentPickerItem>
                <ComponentPickerItem></ComponentPickerItem>
                <ComponentPickerItem></ComponentPickerItem>
                <ComponentPickerItem></ComponentPickerItem>
                <ComponentPickerItem></ComponentPickerItem>
                <ComponentPickerItem></ComponentPickerItem>
                <ComponentPickerItem></ComponentPickerItem>
                <ComponentPickerItem></ComponentPickerItem>
                <ComponentPickerItem></ComponentPickerItem>
                <ComponentPickerItem></ComponentPickerItem>
                <ComponentPickerItem></ComponentPickerItem>
                <ComponentPickerItem></ComponentPickerItem>
                <ComponentPickerItem></ComponentPickerItem>
                <ComponentPickerItem></ComponentPickerItem>
                <ComponentPickerItem></ComponentPickerItem>
                <ComponentPickerItem></ComponentPickerItem>
            </div>
        );
    }
}

export default ComponentPicker;