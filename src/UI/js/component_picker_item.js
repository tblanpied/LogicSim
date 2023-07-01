import "../css/component_picker_item.css";
import React from 'react';

class ComponentPickerItem extends React.Component{
    constructor(props){
        super(props);

        this.name = props.name==undefined?"":props.name;
        this.icon = props.icon;
    }

    render(){
        return(
            <div className={"component_picker_item item-" + this.name.replace(/\s+/g, '')}>
                <div className="component_picker_item_icon">
                    <img draggable="false" src={this.icon}></img>
                </div>
                <div className="component_picker_item_name">
                    {this.name}
                </div>
            </div>
        );
    }
}

export default ComponentPickerItem;