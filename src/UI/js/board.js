import "../css/board.css";
import React from "react";
import SevenSegmentDisplay from "../../components/js/seven_segment_display";
import Wire from "../../components/js/wire";

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedComponentId: null,
      components: []
    }
    this.id = 0;
    this.test = true;


    this.handleComponentClick = this.handleComponentClick.bind(this);
    this.handleContainerClick = this.handleContainerClick.bind(this);

  }

  componentDidMount(){
    if(this.test){
      const item = document.getElementsByClassName("component_picker_item item-7segmentdisplay")[0];
      item.addEventListener("click", (e) => {this.addComponent("7segmentdisplay")});
      this.test = false;
    }
  }

  getUniqueId(){
    console.log("id:" + this.id);
    return this.id++;
  }

  isSelected(id){
    return this.state.selectedComponentId == id;
  }

  handleComponentClick(id){
    this.setState({
      selectedComponentId: id
    });
    console.log(id);
  }

  handleContainerClick = () => {
    this.setState({
      selectedComponentId: null
    });
  }

  addComponent(name){
    console.log("a");
    if(name === "7segmentdisplay"){
      const id = this.getUniqueId()
      const new_component = <SevenSegmentDisplay key={id} id={id} onClick={this.handleComponentClick} selected={this.state.selectedComponentId == id} x="0" y="0" segments={{a:false,b:false,c:false,d:false,e:false,f:false,g:false,h:false}}></SevenSegmentDisplay>;
      this.setState(prevState =>({
        components: [...prevState.components, new_component]
      }));
    }
    console.log(this.state.components);
  }

  render(){
    return(
        <div className="breadboard" onMouseDown={this.handleContainerClick}>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <g>
                  {this.state.components}
                <SevenSegmentDisplay id={1} onClick={this.handleComponentClick} selected={this.state.selectedComponentId == 1} x="350" y="150" segments={{a:true,b:true,c:true,d:true,e:false,f:false,g:true,h:true}}></SevenSegmentDisplay>
                <Wire id={0} onClick={this.handleComponentClick} selected={this.state.selectedComponentId == 0} strokeBorder={3} strokeWidth={5} strokeColor="#00ff00" points={[{x:100,y:150}, {x:150,y:300}, {x:200,y:150}, {x:400,y:150}, {x:400,y:500}]}></Wire>
                </g>
            </svg>
        </div>
    );
  }

}
 
export default Board;