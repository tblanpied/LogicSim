import "../css/board.css";
import React from "react";
import SevenSegmentDisplay from "../../components/js/seven_segment_display";
import Wire from "../../components/js/wire";
import PushButton from "../../components/js/push_button";

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedComponentId: null,
      components: [],
      new_component: null
    }
    this.components_coords = new Map();
    this.id = 2;
    this.test = true;


    this.handleComponentClick = this.handleComponentClick.bind(this);
    this.handleContainerClick = this.handleContainerClick.bind(this);
    this.setComponentCoord = this.setComponentCoord.bind(this);
    this.delNewComponent = this.delNewComponent.bind(this);
  }

  componentDidMount(){
    if(this.test){
      const sevensegdisplay = document.getElementsByClassName("component_picker_item item-7segmentdisplay")[0];
      sevensegdisplay.addEventListener("click", (e) => {this.addNewComponent("7segmentdisplay")});
      const pushbutton = document.getElementsByClassName("component_picker_item item-pushbutton")[0];
      pushbutton.addEventListener("click", (e) => {this.addNewComponent("pushbutton")});
      this.test = false;
    }
  }

  getUniqueId(){
    return this.id++;
  }

  handleComponentClick(id){
    this.setState({
      selectedComponentId: id
    });
  }

  handleContainerClick = () => {
    this.setState({
      selectedComponentId: null
    });
  }

  addComponent(name){
    let id = this.getUniqueId();
    const new_component = {component: name, id: id};
    this.setState(prevState =>({
      components: [...prevState.components, new_component]
    }));
    this.setComponentCoord(id, this.components_coords.get(this.state.new_component.id).x, this.components_coords.get(this.state.new_component.id).y);
  }

  addNewComponent(name){
    let id = this.getUniqueId();
    const new_component = {component: name, id: id};
    this.setState({
      new_component: new_component
    });
    this.setComponentCoord(id, 0, 0);
    document.addEventListener("contextmenu", this.delNewComponent);
  }

  delNewComponent(e){
    document.removeEventListener("contextmenu", this.delNewComponent);
    e.preventDefault();
    this.components_coords.delete(this.state.new_component.id);
    this.setState({
      new_component: null
    });
  }

  setComponentCoord(id, x, y){
    this.components_coords.set(id,{x:x, y:y});
  }

  render(){
    var key=0;
    var components = []
    for(let i = 0; i < this.state.components.length; i++){
      if(this.state.components[i].component == "7segmentdisplay"){
        components.push(<SevenSegmentDisplay setCoord={this.setComponentCoord} key={key++} id={this.state.components[i].id} onClick={this.handleComponentClick} selected={this.state.selectedComponentId == this.state.components[i].id} x={this.components_coords.get(this.state.components[i].id).x} y={this.components_coords.get(this.state.components[i].id).y} segments={{a:false,b:false,c:false,d:false,e:false,f:false,g:false,h:false}}></SevenSegmentDisplay>);
      }
      else if(this.state.components[i].component == "pushbutton"){
        components.push(<PushButton id={this.state.components[i].id} key={key++} setCoord={this.setComponentCoord} onClick={this.handleComponentClick} selected={this.state.selectedComponentId == this.state.components[i].id} x={this.components_coords.get(this.state.components[i].id).x} y={this.components_coords.get(this.state.components[i].id).y}></PushButton>);
      }
    }

    var new_component = []
    if(this.state.new_component != null){
      if(this.state.new_component.component == "7segmentdisplay"){
        new_component.push(<SevenSegmentDisplay opacity={0.5} new_component={true} setCoord={this.setComponentCoord} dragging={true} key={key++} id={this.state.new_component.id} onClick={() => {this.addComponent("7segmentdisplay")}} selected={false} x={this.components_coords.get(this.state.new_component.id).x} y={this.components_coords.get(this.state.new_component.id).y} segments={{a:false,b:false,c:false,d:false,e:false,f:false,g:false,h:false}}></SevenSegmentDisplay>)
      }
      else if(this.state.new_component.component == "pushbutton"){
        new_component.push(<PushButton opacity={0.5} new_component={true} id={this.state.new_component.id} key={key++} setCoord={this.setComponentCoord} onClick={() => {this.addComponent("pushbutton")}} selected={false} x={this.components_coords.get(this.state.new_component.id).x} y={this.components_coords.get(this.state.new_component.id).y}></PushButton>);
      }
    }

    return(
        <div className="breadboard" onMouseDown={this.handleContainerClick}>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <g>
                {components}
                <SevenSegmentDisplay id={1} setCoord={this.setComponentCoord} onClick={this.handleComponentClick} selected={this.state.selectedComponentId == 1} x="350" y="150" segments={{a:true,b:true,c:true,d:true,e:false,f:false,g:true,h:true}}></SevenSegmentDisplay>
                <Wire active={true} id={0} onClick={this.handleComponentClick} selected={this.state.selectedComponentId == 0} strokeBorder={3} strokeWidth={5} strokeColor="#00ff00" points={[{x:100,y:150}, {x:150,y:300}, {x:200,y:150}, {x:400,y:150}, {x:400,y:500}]}></Wire>
                {new_component}
                </g>
            </svg>
        </div>
    );
  }

}
 
export default Board;