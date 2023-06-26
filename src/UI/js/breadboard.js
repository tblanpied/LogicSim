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
    this.startEndWire = this.startEndWire.bind(this);
    this.changeComponentOutputState = this.changeComponentOutputState.bind(this);
    this.changeComponentInputState = this.changeComponentInputState.bind(this);
    this.deleteComponent = this.deleteComponent.bind(this);
  }

  componentDidMount() {
    if (this.test) {
      const sevensegdisplay = document.getElementsByClassName("component_picker_item item-7segmentdisplay")[0];
      sevensegdisplay.addEventListener("click", (e) => { this.addNewComponent("7segmentdisplay") });
      const pushbutton = document.getElementsByClassName("component_picker_item item-pushbutton")[0];
      pushbutton.addEventListener("click", (e) => { this.addNewComponent("pushbutton") });
      const delete_button = document.getElementsByClassName("delete-btn")[0];
      delete_button.addEventListener("click", (e) => { this.deleteComponent() });
      document.onkeydown = this.deleteComponent;
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
    document.getElementsByClassName("delete-btn")[0].classList.add("toolbar_active_btn");
  }

  handleContainerClick = () => {
    this.setState({
      selectedComponentId: null
    });
    document.getElementsByClassName("delete-btn")[0].classList.remove("toolbar_active_btn");
  }

  addComponent(name) {
    var inputs = [];
    var outputs = [];
    if (name === "7segmentdisplay") {
      for (let i = 0; i < 8; i++) {
        inputs.push(Object.assign({}, { state: false, connections: [] }));
      }
    }
    else if (name === "pushbutton") {
      outputs.push(Object.assign({}, { state: false, connections: [] }));
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

  deleteWire(ids){
    var wires = [...this.state.wires]
    wires = wires.filter((wire, index1)=>{
      if(ids.includes(wire.id)){
          /*components = components.map((c, i)=>{
            var index = -1;
            if(c.id == wire.start.id){
              index = wire.start.index;
            } else if(c.id == wire.end.id){
              index = wire.end.id;
            }
            if(index != -1){
              c.inputs[index].connections = c.inputs[index].connections.filter((connection, ind, connections)=>{
                if(connection.wireId == wire.id){
                  connections.splice(ind, 1);
                  return true;
                }
                return false;
              });
              c.outputs[index].connections = c.outputs[index].connections.filter((connection, ind, connections)=>{
                if(connection.wireId == wire.id){
                  connections.splice(ind, 1);
                  return true;
                }
                return false;
              });
            }
            if(c.inputs.length != 0){
              var inputs = []
              for(let i = 0; i < c.inputs.length; i++){
                if(c.inputs[i].wireId != wire.id){
                  inputs.push(c.inputs[i]);
                  console.log(c.inputs[i].wireId, wire.id);
                }
              }
              c.inputs = inputs;
            }
            if(c.outputs.length != 0){
              var outputs = []
              for(let i = 0; i < c.outputs.length; i++){
                if(c.outputs[i].wireId != wire.id){
                  outputs.push(c.outputs[i]);
                }
              }
              c.outputs = outputs;
            }
            console.log(c);
            return c;
          });*/
          return false;
        }
        return true;
    });
    this.setState({
      wires: wires
    });
  }

  deleteComponent(){
    if(this.state.selectedComponentId != null){
      this.deleteWire([this.state.selectedComponentId]);
      var components = [...this.state.components];
      var wires_to_delete = []
      components.filter((value, index, arr)=>{
        if(value.id == this.state.selectedComponentId){
          for(let i = 0; i < value.inputs.length; i++){
            for(let j = 0; j < value.inputs[i].connections.length; j++){
              wires_to_delete.push(value.inputs[i].connections[j].wireId);
            }
          }
          for(let i = 0; i < value.outputs.length; i++){
            for(let j = 0; j < value.outputs[i].connections.length; j++){
              wires_to_delete.push(value.outputs[i].connections[j].wireId);
            }
          }
          this.deleteWire(wires_to_delete);
          arr.splice(index, 1);
          return true;
        }
        return false;
      });
      this.setState({
        components: components,
        selectedComponentId: null
      });
      document.getElementsByClassName("delete-btn")[0].classList.remove("toolbar_active_btn");
    }
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

  startEndWire(e, id, type, index, IO){
    if(this.state.drawingWire){
      this.endWire(e, id, type, index, IO);
    } else {
      this.startWire(e, id, type, index, IO);
    }
  }

  startWire(e, id, type, index, IO) {
    e.stopPropagation();
    this.component_start_wire = {type: type, id: id, index: index, IO: IO};
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

  endWire(e, id, type, index, IO) {
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
      var start = (this.component_start_wire.IO === "output" ? {id: this.component_start_wire.id, type: this.component_start_wire.type, index: this.component_start_wire.index} : {id: id, type: type, index:index});
      var end = (IO === "input" ? {id: id, type: type, index:index} : {id: this.component_start_wire.id, type: this.component_start_wire.type, index: this.component_start_wire.index});
      this.setState({
        drawingWirePoints: [],
        drawingWire: false,
        wires: [...this.state.wires, { id: new_id, start: start, end: end, active: false}]
      });

      this.setConnection(this.component_start_wire, {type: type, id: id, index: index, IO: IO}, new_id);
    }
  }

  setConnection(start, end, wireId){
    this.setState({
      components: this.state.components.map((c,i)=>{
        if(c.type === start.type && c.id === start.id){
          if(start.IO === "output"){
            c.outputs[start.index].connections.push(Object.assign({}, {type: end.type, id: end.id, wireId: wireId}));
          } else if(start.IO === "input"){
            c.inputs[start.index].connections.push(Object.assign({}, {type: end.type, id: end.id, wireId: wireId}));
          }
          return c;
        }
        else if(c.type === end.type && c.id === end.id){
          if(end.IO === "output"){
            c.outputs[end.index].connections.push(Object.assign({}, {type: start.type, id: start.id, wireId: wireId}));
          } else if(end.IO === "input"){
            c.inputs[end.index].connections.push(Object.assign({}, {type: start.type, id: start.id, wireId: wireId}));
          }
          return c;
        }
        else{
          return c;
        }
      })
    })
  }

  changeComponentOutputState(id, state, index){
    var wireIds = [];
    this.setState({
      components: this.state.components.map((c,i)=>{
        if(c.id == id){
          c.outputs.map((c,i)=>{
            if(i == index){
              c.state = state;
              if(c.connections.length != 0){
                wireIds = c.connections.map((c, i) => {
                  return c.wireId;
                });
              }
              return c
            }
            else{
              return c
            }
          });
          return c;
        }else{  
          return c;
        }
      })
    });
    if(wireIds.length != 0){
      this.setState({
        wires: this.state.wires.map((c,i)=>{
          if(wireIds.includes(c.id)){
            c.active = state;
            return c;
          }
          else{
            return c;
          }
        })
      });
    }
  }

  changeComponentInputState(id, state, index){
    this.setState({
      components: this.state.components.map((c,i)=>{
        if(c.id == id){
          c.inputs.map((c,i)=>{
            if(i == index){
              c.state = state;
              return c
            }
            else{
              return c
            }
          });
          return c;
        }else{  
          return c;
        }
      })
    });
  }

  render() {
    var components = []
    for (let i = 0; i < this.state.components.length; i++) {
      if (this.state.components[i].type === "7segmentdisplay") {
        components.push(<SevenSegmentDisplay StartEndWire={this.startEndWire} setCoord={this.setComponentCoord} key={this.state.components[i].id} id={this.state.components[i].id} onClick={this.handleComponentClick} selected={this.state.selectedComponentId === this.state.components[i].id} x={this.components_coords.get(this.state.components[i].id).x} y={this.components_coords.get(this.state.components[i].id).y} segments={{ a: this.state.components[i].inputs[0].state, b: this.state.components[i].inputs[1].state, c: this.state.components[i].inputs[2].state, d: this.state.components[i].inputs[3].state, e: this.state.components[i].inputs[4].state, f: this.state.components[i].inputs[5].state, g: this.state.components[i].inputs[6].state, h: this.state.components[i].inputs[7].state }}></SevenSegmentDisplay>);
      }
      else if (this.state.components[i].type === "pushbutton") {
        components.push(<PushButton onStateChange={this.changeComponentOutputState} StartEndWire={this.startEndWire} id={this.state.components[i].id} key={this.state.components[i].id} setCoord={this.setComponentCoord} onClick={this.handleComponentClick} selected={this.state.selectedComponentId === this.state.components[i].id} x={this.components_coords.get(this.state.components[i].id).x} y={this.components_coords.get(this.state.components[i].id).y}></PushButton>);
      }
    }

    var wires = [];
    for (let i = 0; i < this.state.wires.length; i++) {
      wires.push(<Wire onStateChange={this.changeComponentInputState} active={this.state.wires[i].active} start={this.state.wires[i].start} end={this.state.wires[i].end} key={this.state.wires[i].id} id={this.state.wires[i].id} onClick={this.handleComponentClick} selected={this.state.selectedComponentId === this.state.wires[i].id} strokeBorder={3} strokeWidth={5} strokeColor="#00ff00" points={this.wires_points.get(this.state.wires[i].id)}></Wire>);
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