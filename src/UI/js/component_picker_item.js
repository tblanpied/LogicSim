import "../css/component_picker_item.css";
import React from "react";

class ComponentPickerItem extends React.Component {
  constructor(props) {
    super(props);

    this.name = props.name === undefined ? "" : props.name;
    this.icon = props.icon;

    this.state = {
      display: props.display !== undefined ? props.display : true,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.display !== this.props.display) {
      this.setState({
        display: this.props.display,
      });
    }
  }

  render() {
    return (
      <div
        className={
          "component_picker_item item-" +
          this.name.replace(/\s+/g, "").toLowerCase()
        }
        style={this.state.display ? {} : { display: "none" }}
      >
        <div className="component_picker_item_icon">
          <img draggable="false" src={this.icon} alt={this.name}></img>
        </div>
        <div className="component_picker_item_name">{this.name}</div>
      </div>
    );
  }
}

export default ComponentPickerItem;
