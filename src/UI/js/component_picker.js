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
                <ComponentPickerItem name="7 segment display" icon="/icons/icon-7segmentdisplay.png"></ComponentPickerItem>
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