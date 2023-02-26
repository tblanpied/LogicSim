import "../css/breadboard.css";
import React from "react";
import SevenSegmentDisplay from "../../components/js/seven_segment_display";
import Wire from "../../components/js/wire";
import PushButton from "../../components/js/push_button";

class BreadBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedComponentId: null,
      components: [],
      wires: [],
      new_component: null,
      drawingWire: false,
      drawingWirePoints: []
    }
    this.component_start_wire = null;
    this.components_coords = new Map();
    this.wires_points = new Map();
    this.id = 2;
    this.test = true;


    this.handleComponentClick = this.handleComponentClick.bind(this);
    this.handleContainerClick = this.handleContainerClick.bind(this);
    this.setComponentCoord = this.setComponentCoord.bind(this);
    this.delNewComponent = this.delNewComponent.bind(this);
    this.startWire = this.startWire.bind(this);
    this.drawWire = this.drawWire.bind(this);
    this.addWirePoint = this.addWirePoint.bind(this);
    this.stopDrawingWire = this.stopDrawingWire.bind(this);
    this.endWire = this.endWire.bind(this);
  }

  componentDidMount() {
    if (this.test) {
      const sevensegdisplay = document.getElementsByClassName("component_picker_item item-7segmentdisplay")[0];
      sevensegdisplay.addEventListener("click", (e) => { this.addNewComponent("7segmentdisplay") });
      const pushbutton = document.getElementsByClassName("component_picker_item item-pushbutton")[0];
      pushbutton.addEventListener("click", (e) => { this.addNewComponent("pushbutton") });
      this.test = false;
    }
  }

  getUniqueId() {
    return this.id++;
  }

  handleComponentClick(id) {
    this.setState({
      selectedComponentId: id
    });
  }

  handleContainerClick = () => {
    this.setState({
      selectedComponentId: null
    });
  }

  addComponent(name) {
    var inputs = [];
    var outputs = [];
    if (name === "7segmentdisplay") {
      for (let i = 0; i < 8; i++) {
        inputs.push(Object.assign({}, { state: false, connection: null }));
      }
    }
    else if (name === "pushbutton") {
      outputs.push(Object.assign({}, { state: false, connection: null }));
    }
    let id = this.getUniqueId();
    const new_component = { type: name, id: id, inputs: inputs, outputs: outputs };
    this.setState(prevState => ({
      components: [...prevState.components, new_component]
    }));
    this.setComponentCoord(id, this.components_coords.get(this.state.new_component.id).x, this.components_coords.get(this.state.new_component.id).y);
  }

  addNewComponent(name) {
    let id = this.getUniqueId();
    const new_component = { type: name, id: id };
    this.setState({
      new_component: new_component
    });
    this.setComponentCoord(id, 0, 0);
    document.addEventListener("contextmenu", this.delNewComponent);
  }

  delNewComponent(e) {
    document.removeEventListener("contextmenu", this.delNewComponent);
    e.preventDefault();
    this.components_coords.delete(this.state.new_component.id);
    this.setState({
      new_component: null
    });
  }

  setComponentCoord(id, x, y) {
    /*var wires = [];
    this.state.components.forEach(component =>{
      if(component.id === id){
        component.inputs.forEach(input =>{
          if(input.connection != null){
            wires.push({id: input.connection.wireId, type: "input"});
          }
        });
        component.outputs.forEach(output =>{
          if(output.connection != null){
            wires.push({id: output.connection.wireId, type: "input"});
          }
        });
      }
    });
    wires.forEach(wire =>{
      if(wire.type === "input"){

      }
    })*/
    this.components_coords.set(id, { x: x, y: y });
  }

  startWire(e, id, type, index) {
    e.stopPropagation();
    this.component_start_wire = {type: type, id: id, index: index};
    var center = {
      x: e.currentTarget.getBoundingClientRect().left + e.currentTarget.getBoundingClientRect().width / 2,
      y: e.currentTarget.getBoundingClientRect().top + e.currentTarget.getBoundingClientRect().height / 2
    };
    this.setState({
      drawingWire: true,
      drawingWirePoints: [center, Object.assign({}, center)]
    });
    document.addEventListener("mousedown", this.addWirePoint, { capture: true });
    document.addEventListener("mousemove", this.drawWire);
    document.addEventListener("contextmenu", this.stopDrawingWire);
  }

  drawWire(e) {
    //e.stopPropagation();
    this.setState({
      drawingWirePoints: this.state.drawingWirePoints.map((c, i) => {
        if (i === this.state.drawingWirePoints.length - 1) {
          c.x = e.pageX;
          c.y = e.pageY;
          return c;
        }
        else {
          return c;
        }
      })
    });

  }

  addWirePoint(e) {
    //e.stopPropagation();
    if (e.button === 0) {
      this.setState({
        drawingWirePoints: [...this.state.drawingWirePoints, { x: e.pageX, y: e.pageY }]
      });
    }
    //console.log(this.state.drawingWirePoints);
  }

  stopDrawingWire(e) {
    e.preventDefault();
    document.removeEventListener("mousedown", this.addWirePoint, { capture: true });
    document.removeEventListener("mousemove", this.drawWire);
    document.removeEventListener("contextmenu", this.stopDrawingWire, { capture: true });
    this.setState({
      drawingWirePoints: [],
      drawingWire: false
    });
  }

  endWire(e, id, type, index) {
    if (this.state.drawingWire) {
      e.stopPropagation();
      document.removeEventListener("mousedown", this.addWirePoint, { capture: true });
      document.removeEventListener("mousemove", this.drawWire);
      document.removeEventListener("contextmenu", this.stopDrawingWire);
      var center = {
        x: e.currentTarget.getBoundingClientRect().left + e.currentTarget.getBoundingClientRect().width / 2,
        y: e.currentTarget.getBoundingClientRect().top + e.currentTarget.getBoundingClientRect().height / 2
      };
      var new_id = this.getUniqueId();
      var points = [...this.state.drawingWirePoints]
      points.pop();
      points[points.length - 1].x = center.x;
      points[points.length - 1].y = center.y;
      this.wires_points.set(new_id, points);
      this.setState({
        drawingWirePoints: [],
        drawingWire: false,
        wires: [...this.state.wires, { id: new_id, start: {id: this.component_start_wire.id, type: this.component_start_wire.type, index: this.component_start_wire.index}, end: {id: id, type: type, index:index}}]
      });

      this.setConnection(this.component_start_wire, {type: type, id: id, index: index}, new_id);
    }
  }

  setConnection(start, end, wireId){
    this.setState({
      components: this.state.components.map((c,i)=>{
        if(c.type === start.type && c.id === start.id){
          c.outputs[start.index].connection = Object.assign({}, {type: end.type, id: end.id, wireId: wireId});
          return c;
        }
        else if(c.type === end.type && c.id === end.id){
          c.inputs[end.index].connection = Object.assign({}, {type: start.type, id: start.id, wireId: wireId});
          return c;
        }
        else{
          return c;
        }
      })
    })
  }

  render() {
    var components = []
    for (let i = 0; i < this.state.components.length; i++) {
      if (this.state.components[i].type === "7segmentdisplay") {
        components.push(<SevenSegmentDisplay endWire={this.endWire} setCoord={this.setComponentCoord} key={this.state.components[i].id} id={this.state.components[i].id} onClick={this.handleComponentClick} selected={this.state.selectedComponentId === this.state.components[i].id} x={this.components_coords.get(this.state.components[i].id).x} y={this.components_coords.get(this.state.components[i].id).y} segments={{ a: false, b: false, c: false, d: false, e: false, f: false, g: false, h: false }}></SevenSegmentDisplay>);
      }
      else if (this.state.components[i].type === "pushbutton") {
        components.push(<PushButton startWire={this.startWire} id={this.state.components[i].id} key={this.state.components[i].id} setCoord={this.setComponentCoord} onClick={this.handleComponentClick} selected={this.state.selectedComponentId === this.state.components[i].id} x={this.components_coords.get(this.state.components[i].id).x} y={this.components_coords.get(this.state.components[i].id).y}></PushButton>);
      }
    }

    var wires = [];
    for (let i = 0; i < this.state.wires.length; i++) {
      wires.push(<Wire start={this.state.wires[i].start} end={this.state.wires[i].end} key={this.state.wires[i].id} active={true} id={this.state.wires[i].id} onClick={this.handleComponentClick} selected={this.state.selectedComponentId === this.state.wires[i].id} strokeBorder={3} strokeWidth={5} strokeColor="#00ff00" points={this.wires_points.get(this.state.wires[i].id)}></Wire>);
    }

    var new_component = []
    if (this.state.new_component != null) {
      if (this.state.new_component.type === "7segmentdisplay") {
        new_component.push(<SevenSegmentDisplay opacity={0.5} new_component={true} setCoord={this.setComponentCoord} dragging={true} key={this.state.new_component.id} id={this.state.new_component.id} onClick={() => { this.addComponent("7segmentdisplay") }} selected={false} x={this.components_coords.get(this.state.new_component.id).x} y={this.components_coords.get(this.state.new_component.id).y} segments={{ a: false, b: false, c: false, d: false, e: false, f: false, g: false, h: false }}></SevenSegmentDisplay>)
      }
      else if (this.state.new_component.type === "pushbutton") {
        new_component.push(<PushButton opacity={0.5} new_component={true} id={this.state.new_component.id} key={this.state.new_component.id} setCoord={this.setComponentCoord} onClick={() => { this.addComponent("pushbutton") }} selected={false} x={this.components_coords.get(this.state.new_component.id).x} y={this.components_coords.get(this.state.new_component.id).y}></PushButton>);
      }
    }

    var drawingWire = [];
    if (this.state.drawingWire) {
      drawingWire.push(<Wire style={{ pointerEvents: "none" }} key={-1} active={true} id={-1} onClick={() => { }} selected={false} strokeBorder={3} strokeWidth={5} strokeColor="#00ff00" points={this.state.drawingWirePoints}></Wire>);
    }
    return (
      <div className="breadboard" onMouseDown={this.handleContainerClick}>
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <g>
            {components}
            <SevenSegmentDisplay id={1} setCoord={this.setComponentCoord} onClick={this.handleComponentClick} selected={this.state.selectedComponentId === 1} x="350" y="150" segments={{ a: true, b: true, c: true, d: true, e: false, f: false, g: true, h: true }}></SevenSegmentDisplay>
            {new_component}
            {drawingWire}
            {wires}
          </g>
        </svg>
      </div>
    );
  }

}

export default BreadBoard;