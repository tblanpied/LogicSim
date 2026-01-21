import "../css/breadboard.css";
import React from "react";
import SevenSegmentDisplay from "../../components/js/seven_segment_display";
import Wire from "../../components/js/wire";
import PushButton from "../../components/js/push_button";
import AndGate from "../../components/js/and_gate";
import NotGate from "../../components/js/not_gate";
import { config } from "../../config";
import LightBulb from "../../components/js/light_bulb";
import Switch from "../../components/js/switch";
import Clock from "../../components/js/clock";
import PropertiesPanel from "./properties_panel";

class BreadBoard extends React.Component {
  constructor(props) {
    super(props);

    // Initial state of the component
    this.state = {
      selectedComponentId: null, // ID of the currently selected component
      selectedComponent: null,
      components: [], // Array of components
      wires: [], // Array of wires
      new_component: null, // Newly created component
      drawingWire: false, // Flag indicating if wire is being drawn
      drawingWirePoints: [], // Points of the wire being drawn
      zoom: 1.0, // Zoom level of the app
      offset: { x: 0, y: 0 }, // Offset of the breadboard
      dragging: false, // Flag indicating if the breadboard is being dragged
      dragging_offset: { x: 0, y: 0 },
      selected_tool: "select",
    };

    // Additional instance variables
    this.component_start_wire = null; // Starting component for wire connection
    this.components_coords = new Map(); // Map to store coordinates of components
    this.wires_points = new Map(); // Map to store points of wires
    this.id = 2; // ID counter for new components
    this.test = true; // Test flag
    this.dragging_start_pos = { x: 0, y: 0 }; // Starting position of the breadboard drag
    this.dragging_start_offset = { x: 0, y: 0 }; // Starting offset of the breadboard drag
    this.copied_component = null;
    this.pasting = false;
    this.properties = [];

    this.cursor = { x: 0, y: 0 };

    // Bind methods to the component instance
    this.selectComponent = this.selectComponent.bind(this);
    this.handleBreadboardClick = this.handleBreadboardClick.bind(this);
    this.setComponentCoord = this.setComponentCoord.bind(this);
    this.delNewComponent = this.delNewComponent.bind(this);
    this.startWire = this.startWire.bind(this);
    this.addWirePoint = this.addWirePoint.bind(this);
    this.stopDrawingWire = this.stopDrawingWire.bind(this);
    this.endWire = this.endWire.bind(this);
    this.startEndWire = this.startEndWire.bind(this);
    this.changeComponentOutputState =
      this.changeComponentOutputState.bind(this);
    this.changeComponentInputState = this.changeComponentInputState.bind(this);
    this.deleteComponent = this.deleteComponent.bind(this);
    this.updateWirePoint = this.updateWirePoint.bind(this);
    this.dragging = this.dragging.bind(this);
    this.dragEnd = this.dragEnd.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.changeTool = this.changeTool.bind(this);
    this.updateProperties = this.updateProperties.bind(this);
  }

  // componentDidMount: Lifecycle method called after the component is mounted in the DOM
  componentDidMount() {
    // Initialize event listeners and bindings only once
    if (this.test) {
      // Add event listeners to component picker items
      // Trigger addNewComponent method with the corresponding component type
      const sevensegdisplay = document.getElementsByClassName(
        "component_picker_item item-7segmentdisplay",
      )[0];
      sevensegdisplay.addEventListener("click", (e) => {
        this.addNewComponent("7segmentdisplay", 0, window.screen.height);
      });

      const pushbutton = document.getElementsByClassName(
        "component_picker_item item-pushbutton",
      )[0];
      pushbutton.addEventListener("click", (e) => {
        this.addNewComponent("pushbutton", 0, window.screen.height);
      });

      const andgate = document.getElementsByClassName(
        "component_picker_item item-andgate",
      )[0];
      andgate.addEventListener("click", (e) => {
        this.addNewComponent("andgate", 0, window.screen.height);
      });

      const notgate = document.getElementsByClassName(
        "component_picker_item item-notgate",
      )[0];
      notgate.addEventListener("click", (e) => {
        this.addNewComponent("notgate", 0, window.screen.height);
      });

      const lightbulb = document.getElementsByClassName(
        "component_picker_item item-lightbulb",
      )[0];
      lightbulb.addEventListener("click", (e) => {
        this.addNewComponent("lightbulb", 0, window.screen.height);
      });

      const _switch = document.getElementsByClassName(
        "component_picker_item item-switch",
      )[0];
      _switch.addEventListener("click", (e) => {
        this.addNewComponent("switch", 0, window.screen.height);
      });

      const clock = document.getElementsByClassName(
        "component_picker_item item-clock",
      )[0];
      clock.addEventListener("click", (e) => {
        this.addNewComponent("clock", 0, window.screen.height);
      });

      // Add event listener to the delete button
      // Trigger deleteComponent method when clicked
      const delete_button = document.getElementsByClassName("delete-btn")[0];
      delete_button.addEventListener("click", (e) => {
        this.deleteComponent();
      });

      const rotate_left_button =
        document.getElementsByClassName("rotate-left-btn")[0];
      rotate_left_button.addEventListener("click", (e) => {
        this.rotateComponent(-90);
      });

      const rotate_right_button =
        document.getElementsByClassName("rotate-right-btn")[0];
      rotate_right_button.addEventListener("click", (e) => {
        this.rotateComponent(90);
      });

      const copy_button = document.getElementsByClassName("copy-btn")[0];
      copy_button.addEventListener("click", (e) => {
        this.copySelectedComponent();
      });

      const paste_button = document.getElementsByClassName("paste-btn")[0];
      paste_button.addEventListener("click", (e) => {
        this.pasteComponent();
      });

      const select_button =
        document.getElementsByClassName("select-tool-btn")[0];
      select_button.addEventListener("click", (e) => {
        this.changeTool("select");
      });

      // const select_area_button = document.getElementsByClassName("select-area-tool-btn")[0];
      // select_area_button.addEventListener("click", (e) => { this.changeTool("select area") });

      const hand_button = document.getElementsByClassName("hand-tool-btn")[0];
      hand_button.addEventListener("click", (e) => {
        this.changeTool("move");
      });

      // Add event listener to the zoomin button
      // Trigger zoom method when clicked
      const zoomin_button = document.getElementsByClassName("zoomin-btn")[0];
      zoomin_button.addEventListener("click", (e) => {
        this.zoom(e, 1, 5, window.screen.width / 2, window.screen.height / 2);
      });

      // Add event listener to the zoomout button
      // Trigger zoom method when clicked
      const zoomout_button = document.getElementsByClassName("zoomout-btn")[0];
      zoomout_button.addEventListener("click", (e) => {
        this.zoom(e, -1, 5, window.screen.width / 2, window.screen.height / 2);
      });

      // Add wheel event listener to the breadboard for zooming
      const breadboard = document.getElementsByClassName("breadboard")[0];
      breadboard.addEventListener("wheel", (e) => {
        this.zoom(e, e.deltaY, 1, e.pageX, e.pageY);
      });

      document.addEventListener("keydown", this.onKeyDown);
      document.addEventListener("mousemove", (e) => {
        this.cursor.x = e.pageX;
        this.cursor.y = e.pageY;
      });

      // Set test flag to false to prevent reinitialization
      this.test = false;
    }
  }

  changeTool(tool) {
    if (this.state.selected_tool !== tool) {
      this.setState({
        selected_tool: tool,
      });
      document
        .getElementsByClassName("select-tool-btn")[0]
        .classList.add("toolbar_active_btn");
      // document.getElementsByClassName("select-area-tool-btn")[0].classList.add("toolbar_active_btn");
      document
        .getElementsByClassName("hand-tool-btn")[0]
        .classList.add("toolbar_active_btn");
      const breadboard = document.getElementsByClassName("breadboard")[0];
      if (tool === "select") {
        document
          .getElementsByClassName("select-tool-btn")[0]
          .classList.remove("toolbar_active_btn");
        breadboard.removeEventListener(
          "mousedown",
          this.handleBreadboardClick,
          { capture: true },
        );
      } else if (tool === "select area") {
        // document.getElementsByClassName("select-area-tool-btn")[0].classList.remove("toolbar_active_btn");
      } else if (tool === "move") {
        document
          .getElementsByClassName("hand-tool-btn")[0]
          .classList.remove("toolbar_active_btn");
        breadboard.removeEventListener(
          "mousedown",
          this.handleBreadboardClick,
          { capture: true },
        );
        this.setState({
          selectedComponentId: null,
        });
        breadboard.addEventListener("mousedown", this.handleBreadboardClick, {
          capture: true,
        });
      }
    }
  }

  // zoom: Handle the zooming functionality based on the scroll event
  // Accepts the event object and the delta value of the scroll
  zoom(e, delta, k, x, y) {
    const zoomFactor =
      delta > 0
        ? config.breadboard.zoom.zoomin_factor
        : config.breadboard.zoom.zoomout_factor; // Zoom factor based on scroll direction

    // Calculate cursor position relative to the current zoom level and offset
    const cursorX = (x - this.state.offset.x) / this.state.zoom;
    const cursorY = (y - this.state.offset.y) / this.state.zoom;

    // Calculate the new translate values for zooming
    const new_zoom = Math.max(
      Math.min(
        this.state.zoom * Math.pow(zoomFactor, k),
        config.breadboard.zoom.max,
      ),
      config.breadboard.zoom.min,
    );
    const translateX = x - cursorX * new_zoom;
    const translateY = y - cursorY * new_zoom;

    // Update the state with the new zoom level and offset
    this.setState({
      zoom: new_zoom,
      offset: { x: translateX, y: translateY },
    });
    if (
      new_zoom === config.breadboard.zoom.min &&
      document
        .getElementsByClassName("zoomout-btn")[0]
        .classList.contains("toolbar_active_btn")
    ) {
      document
        .getElementsByClassName("zoomout-btn")[0]
        .classList.remove("toolbar_active_btn");
    }
    if (
      new_zoom === config.breadboard.zoom.max &&
      document
        .getElementsByClassName("zoomin-btn")[0]
        .classList.contains("toolbar_active_btn")
    ) {
      document
        .getElementsByClassName("zoomin-btn")[0]
        .classList.remove("toolbar_active_btn");
    }
    if (
      new_zoom > config.breadboard.zoom.min &&
      new_zoom < config.breadboard.zoom.max
    ) {
      if (
        !document
          .getElementsByClassName("zoomin-btn")[0]
          .classList.contains("toolbar_active_btn")
      ) {
        document
          .getElementsByClassName("zoomin-btn")[0]
          .classList.add("toolbar_active_btn");
      }
      if (
        !document
          .getElementsByClassName("zoomout-btn")[0]
          .classList.contains("toolbar_active_btn")
      ) {
        document
          .getElementsByClassName("zoomout-btn")[0]
          .classList.add("toolbar_active_btn");
      }
    }
  }

  // selectComponent: Set the selected component ID and add the active class to the delete button
  selectComponent(id) {
    if (this.state.selected_tool === "select") {
      var selected_component = this.getComponent(id);
      this.setState({
        selectedComponentId: id,
        selectedComponent: selected_component,
      });

      this.properties = [];
      this.properties.push({
        name: "Name",
        type: "string",
        default: selected_component.attributes.name,
      });
      if (selected_component.attributes.input_names !== null) {
        for (
          let i = 0;
          i < selected_component.attributes.input_names.length;
          i++
        ) {
          this.properties.push({
            name: "Input name " + i,
            type: "string",
            default: selected_component.attributes.input_names[i],
          });
        }
      }
      if (selected_component.attributes.output_names !== null) {
        for (
          let i = 0;
          i < selected_component.attributes.output_names.length;
          i++
        ) {
          this.properties.push({
            name: "Output name " + i,
            type: "string",
            default: selected_component.attributes.output_names[i],
          });
        }
      }

      // Add the active class to the delete button in the toolbar
      document
        .getElementsByClassName("delete-btn")[0]
        .classList.add("toolbar_active_btn");
      document
        .getElementsByClassName("rotate-left-btn")[0]
        .classList.add("toolbar_active_btn");
      document
        .getElementsByClassName("rotate-right-btn")[0]
        .classList.add("toolbar_active_btn");
      document
        .getElementsByClassName("copy-btn")[0]
        .classList.add("toolbar_active_btn");
    }
  }

  rotateComponent(angle) {
    if (this.state.selectedComponentId !== null) {
      this.setState({
        components: this.state.components.map((c, i) => {
          if (c.id === this.state.selectedComponentId) {
            c.attributes.rotation += angle;
            if (c.attributes.rotation < 0) {
              c.attributes.rotation += 360;
            }
            if (c.attributes.rotation >= 360) {
              c.attributes.rotation -= 360;
            }
          }
          return c;
        }),
      });
    }
  }

  copySelectedComponent() {
    if (this.state.selectedComponentId !== null) {
      this.copied_component = this.state.selectedComponentId;
      document
        .getElementsByClassName("paste-btn")[0]
        .classList.add("toolbar_active_btn");
    }
  }

  pasteComponent() {
    if (this.copied_component !== null) {
      var component_name = "";
      for (let i = 0; i < this.state.components.length; i++) {
        if (this.state.components[i].id === this.copied_component) {
          component_name = this.state.components[i].type;
        }
      }
      var component = document.getElementsByClassName(
        "Component-" + component_name + "-" + this.copied_component,
      )[0];
      var rect = component.getBoundingClientRect();
      this.addNewComponent(
        component_name,
        this.cursor.x - rect.width / 2,
        this.cursor.y - rect.height / 2,
      );
      this.pasting = true;
    }
  }

  onKeyDown(e) {
    if (!e.repeat) {
      if (e.key === "Delete") {
        this.deleteComponent();
      } else if (e.key === "c" && e.ctrlKey) {
        this.copySelectedComponent();
      } else if (e.key === "v" && e.ctrlKey) {
        this.pasteComponent();
      }
    }
  }

  // handleBreadboardClick: Handle the click event on the breadboard
  handleBreadboardClick(e) {
    // Clear the selected component and remove the active class from the delete button
    this.setState({
      selectedComponentId: null,
    });
    document
      .getElementsByClassName("delete-btn")[0]
      .classList.remove("toolbar_active_btn");
    document
      .getElementsByClassName("rotate-left-btn")[0]
      .classList.remove("toolbar_active_btn");
    document
      .getElementsByClassName("rotate-right-btn")[0]
      .classList.remove("toolbar_active_btn");
    document
      .getElementsByClassName("copy-btn")[0]
      .classList.remove("toolbar_active_btn");

    if (e.button === 0 && this.state.selected_tool !== "select area") {
      // Store the initial click position and offset for dragging
      this.dragging_start_pos.x = e.pageX;
      this.dragging_start_pos.y = e.pageY;
      this.dragging_start_offset.x = this.state.offset.x;
      this.dragging_start_offset.y = this.state.offset.y;

      // Enable dragging mode
      this.setState({
        dragging: true,
        dragging_offset: {
          x: this.state.offset.x,
          y: this.state.offset.y,
        },
      });
    }
  }

  // dragging: Handle the dragging functionality of the breadboard
  dragging(e) {
    // Update the offset based on the dragging movement
    if (this.state.dragging && !this.state.drawingWire) {
      this.setState({
        dragging_offset: {
          x:
            this.dragging_start_offset.x -
            (this.dragging_start_pos.x - e.pageX),
          y:
            this.dragging_start_offset.y -
            (this.dragging_start_pos.y - e.pageY),
        },
      });
    }
  }

  // dragEnd: Handle the end of dragging of the breadboard
  dragEnd(e) {
    // Disable dragging mode
    if (this.state.dragging) {
      this.setState({
        dragging: false,
        offset: {
          x: this.state.dragging_offset.x,
          y: this.state.dragging_offset.y,
        },
      });
    }
  }

  getUniqueId() {
    return this.id++;
  }

  // addNewComponent: Add a new component to the state and set its initial coordinates
  addNewComponent(name, x, y) {
    if (this.state.selected_tool === "select") {
      // Generate a unique ID for the new component
      let id = this.getUniqueId();

      // Create a new component object with its type and ID
      const new_component = { type: name, id: id };

      // Update the state with the new_component and set its initial coordinates
      this.setState({
        new_component: new_component,
      });
      this.setComponentCoord(
        id,
        (x - this.state.offset.x) / this.state.zoom,
        (y - this.state.offset.y) / this.state.zoom,
      );

      // Add a context menu event listener to delete the new component
      document.addEventListener("contextmenu", this.delNewComponent);
    }
  }

  // delNewComponent: Delete the new component and remove the context menu event listener
  delNewComponent(e) {
    if (e !== null) {
      e.preventDefault();
    }
    // Remove the context menu event listener
    document.removeEventListener("contextmenu", this.delNewComponent);

    if (this.state.new_component !== null) {
      // Delete the new component from the coordinates map and update the state
      this.components_coords.delete(this.state.new_component.id);

      this.setState({
        new_component: null,
      });
    }
  }

  // addComponent: Add a new component to the state with its inputs and outputs
  addComponent(name) {
    // Check if there is a new component being added
    if (this.state.new_component != null) {
      var inputs = [];
      var outputs = [];
      var input_names = null;
      var output_names = null;
      var human_name = "";

      // Set inputs and outputs based on the component type
      if (name === "7segmentdisplay") {
        human_name = "7 segment display";
        for (let i = 0; i < 8; i++) {
          inputs.push(Object.assign({}, { state: false, connections: [] }));
        }
      } else if (name === "pushbutton") {
        human_name = "Push button";
        outputs.push(Object.assign({}, { state: false, connections: [] }));
      } else if (name === "andgate") {
        human_name = "AND gate";
        outputs.push(Object.assign({}, { state: false, connections: [] }));
        inputs.push(Object.assign({}, { state: false, connections: [] }));
        inputs.push(Object.assign({}, { state: false, connections: [] }));
        input_names = ["a", "b"];
        output_names = ["output"];
      } else if (name === "notgate") {
        human_name = "NOT gate";
        outputs.push(Object.assign({}, { state: false, connections: [] }));
        inputs.push(Object.assign({}, { state: false, connections: [] }));
        input_names = ["input"];
        output_names = ["output"];
      } else if (name === "lightbulb") {
        human_name = "Light bulb";
        inputs.push(Object.assign({}, { state: false, connections: [] }));
      } else if (name === "switch") {
        human_name = "Switch";
        outputs.push(Object.assign({}, { state: false, connections: [] }));
      } else if (name === "clock") {
        human_name = "Clock";
        outputs.push(Object.assign({}, { state: false, connections: [] }));
      }

      // Generate a unique ID for the new component
      let id = this.getUniqueId();

      // Create a new component object with its type, ID, inputs, and outputs
      const new_component = {
        type: name,
        id: id,
        inputs: inputs,
        outputs: outputs,
        attributes: {
          name: human_name,
          input_names: input_names,
          output_names: output_names,
          rotation: 0,
        },
      };

      // Update the state with the new_component and set its coordinates based on the new_component
      this.setState((prevState) => ({
        components: [...prevState.components, new_component],
      }));
      this.setComponentCoord(
        id,
        this.components_coords.get(this.state.new_component.id).x,
        this.components_coords.get(this.state.new_component.id).y,
      );

      if (this.pasting) {
        this.pasting = false;
        this.delNewComponent(null);
      }
    }
  }

  // deleteComponent: Delete a component and its associated wires from the state
  deleteComponent() {
    // Check if a component is selected
    if (this.state.selectedComponentId != null) {
      var components = [...this.state.components];
      var wires_to_delete = [this.state.selectedComponentId];

      // Find the selected component and remove it from the components array
      components.filter((value, index, arr) => {
        if (value.id === this.state.selectedComponentId) {
          // Add the associated wire IDs to the wires_to_delete array
          for (let i = 0; i < value.inputs.length; i++) {
            for (let j = 0; j < value.inputs[i].connections.length; j++) {
              wires_to_delete.push(value.inputs[i].connections[j].wireId);
            }
          }
          for (let i = 0; i < value.outputs.length; i++) {
            for (let j = 0; j < value.outputs[i].connections.length; j++) {
              wires_to_delete.push(value.outputs[i].connections[j].wireId);
            }
          }

          // Remove the selected component from the components array
          arr.splice(index, 1);
          return true;
        }
        return false;
      });

      if (this.state.selectedComponentId === this.copied_component) {
        this.copied_component = null;
        document
          .getElementsByClassName("paste-btn")[0]
          .classList.remove("toolbar_active_btn");
      }

      // Delete the associated wires and update the state
      this.setState(
        {
          components: components,
          selectedComponentId: null,
        },
        () => {
          this.deleteWires(wires_to_delete);
        },
      );

      // Remove the active class from the delete button in the toolbar
      document
        .getElementsByClassName("delete-btn")[0]
        .classList.remove("toolbar_active_btn");
      document
        .getElementsByClassName("rotate-left-btn")[0]
        .classList.remove("toolbar_active_btn");
      document
        .getElementsByClassName("rotate-right-btn")[0]
        .classList.remove("toolbar_active_btn");
      document
        .getElementsByClassName("copy-btn")[0]
        .classList.remove("toolbar_active_btn");
    }
  }

  /**
   * Sets the coordinates of a component.
   * @param {string} id - The ID of the component.
   * @param {number} x - The x-coordinate.
   * @param {number} y - The y-coordinate.
   */
  setComponentCoord(id, x, y) {
    this.components_coords.set(id, { x: x, y: y });
  }

  /**
   * Deletes wires from the state and updates component inputs and outputs.
   * @param {Array} ids - Array of wire IDs to be deleted.
   */
  deleteWires(ids) {
    // Update the state with the modified wires and components arrays
    this.setState({
      // Filter out the wires to be deleted and update component input states
      wires: this.state.wires.filter((wire, index1) => {
        if (ids.includes(wire.id)) {
          // Update the input state of the component connected to the wire end
          this.changeComponentInputState(wire.end.id, false, wire.end.index);
          return false; // Exclude the wire from the filtered array
        }
        return true; // Keep the wire in the filtered array
      }),

      // Update the component inputs and outputs connections
      components: this.state.components.map((c, i1) => {
        c.inputs = c.inputs.map((input, i2) => {
          // Filter out the connections associated with the deleted wires
          input.connections = input.connections.filter((con, i3) => {
            if (ids.includes(con.wireId)) {
              return false; // Exclude the connection from the filtered array
            }
            return true; // Keep the connection in the filtered array
          });
          return input;
        });
        c.outputs = c.outputs.map((output, i2) => {
          // Filter out the connections associated with the deleted wires
          output.connections = output.connections.filter((con, i3) => {
            if (ids.includes(con.wireId)) {
              return false; // Exclude the connection from the filtered array
            }
            return true; // Keep the connection in the filtered array
          });
          return output;
        });
        return c;
      }),
    });
  }

  /**
   * Determines whether to start or end a wire based on the current drawingWire state.
   * @param {Event} e - The event object.
   * @param {string} id - The ID of the component.
   * @param {string} type - The type of the component.
   * @param {number} index - The index of the input/output.
   * @param {string} IO - The input/output type ("input" or "output").
   */
  startEndWire(e, id, type, index, IO) {
    if (e.button === 0 && this.state.selected_tool === "select") {
      if (this.state.drawingWire) {
        this.endWire(e, id, type, index, IO);
      } else {
        this.startWire(e, id, type, index, IO);
      }
    }
  }

  /**
   * Starts drawing a wire and sets the initial drawingWirePoints state.
   * @param {Event} e - The event object.
   * @param {string} id - The ID of the component.
   * @param {string} type - The type of the component.
   * @param {number} index - The index of the input/output.
   * @param {string} IO - The input/output type ("input" or "output").
   */
  startWire(e, id, type, index, IO) {
    e.stopPropagation();

    // Set the start wire object
    this.component_start_wire = { type: type, id: id, index: index, IO: IO };

    // Calculate the center coordinates of the component
    var center = {
      x:
        (e.currentTarget.getBoundingClientRect().left +
          e.currentTarget.getBoundingClientRect().width / 2 -
          this.state.offset.x) /
        this.state.zoom,
      y:
        (e.currentTarget.getBoundingClientRect().top +
          e.currentTarget.getBoundingClientRect().height / 2 -
          this.state.offset.y) /
        this.state.zoom,
    };

    // Set the drawingWire and drawingWirePoints state
    this.setState({
      drawingWire: true,
      drawingWirePoints: [center, Object.assign({}, center)],
    });

    // Add event listeners for wire drawing
    document.addEventListener("contextmenu", this.stopDrawingWire);
  }

  /**
   * Ends the wire drawing process and adds the wire to the state.
   * @param {Event} e - The event object.
   * @param {string} id - The ID of the component.
   * @param {string} type - The type of the component.
   * @param {number} index - The index of the input/output.
   * @param {string} IO - The input/output type ("input" or "output").
   */
  endWire(e, id, type, index, IO) {
    if (this.state.drawingWire) {
      e.stopPropagation();

      // Delete the wire when connecting an input to an input or an output to an output
      if (IO === this.component_start_wire.IO) {
        this.stopDrawingWire(e);
        return;
      }

      // Remove event listeners for wire drawing
      document.removeEventListener("contextmenu", this.stopDrawingWire);

      // Calculate the center coordinates of the component
      var center = {
        x:
          (e.currentTarget.getBoundingClientRect().left +
            e.currentTarget.getBoundingClientRect().width / 2 -
            this.state.offset.x) /
          this.state.zoom,
        y:
          (e.currentTarget.getBoundingClientRect().top +
            e.currentTarget.getBoundingClientRect().height / 2 -
            this.state.offset.y) /
          this.state.zoom,
      };

      var new_id = this.getUniqueId();
      var points = [...this.state.drawingWirePoints];
      points.pop();
      points[points.length - 1].x = center.x;
      points[points.length - 1].y = center.y;

      // Reverse the points if the wire connects an input to an output
      if (IO === "output") {
        points = points.reverse();
      }

      // Store the wire points
      this.wires_points.set(new_id, points);

      // Determine the start and end components of the wire
      var start =
        this.component_start_wire.IO === "output"
          ? {
              id: this.component_start_wire.id,
              type: this.component_start_wire.type,
              index: this.component_start_wire.index,
              IO: this.component_start_wire.IO,
            }
          : { id: id, type: type, index: index, IO: IO };
      var end =
        IO === "input"
          ? { id: id, type: type, index: index, IO: IO }
          : {
              id: this.component_start_wire.id,
              type: this.component_start_wire.type,
              index: this.component_start_wire.index,
              IO: this.component_start_wire.IO,
            };

      // Set the connection between the start and end components
      this.setConnection(
        this.component_start_wire,
        { type: type, id: id, index: index, IO: IO },
        new_id,
      );

      var wire_state = false;
      this.state.components.map((c, i) => {
        if (c.id === start.id) {
          c.outputs.map((c, i) => {
            if (i === start.index) {
              wire_state = c.state;
            }
            return c;
          });
        }
        return c;
      });

      // Update the state with the new wire and wire points
      this.setState({
        drawingWirePoints: [],
        drawingWire: false,
        wires: [
          ...this.state.wires,
          { id: new_id, start: start, end: end, active: wire_state },
        ],
      });

      // Update the input state of the end component
      this.changeComponentInputState(end.id, wire_state, end.index);
    }
  }

  /**
   * Adds a new point to the wire drawing process.
   * @param {Event} e - The event object.
   */
  addWirePoint(e, x, y) {
    if (e.button === 0 && this.state.drawingWire) {
      var drawingWirePoints = [...this.state.drawingWirePoints];
      drawingWirePoints[drawingWirePoints.length - 1].x = x;
      drawingWirePoints[drawingWirePoints.length - 1].y = y;
      drawingWirePoints.push({
        x: (e.pageX - this.state.offset.x) / this.state.zoom,
        y: (e.pageY - this.state.offset.y) / this.state.zoom,
      });
      this.setState({
        drawingWirePoints: drawingWirePoints,
      });
    }
  }

  /**
   * Stops the wire drawing process and clears the drawingWirePoints state.
   * @param {Event} e - The event object.
   */
  stopDrawingWire(e) {
    e.preventDefault();
    document.removeEventListener("contextmenu", this.stopDrawingWire);
    this.setState({
      drawingWirePoints: [],
      drawingWire: false,
    });
  }

  /**
   * Updates the coordinates of a wire point.
   * @param {string} wireId - The ID of the wire.
   * @param {number} index - The index of the point.
   * @param {number} x - The new x-coordinate.
   * @param {number} y - The new y-coordinate.
   */
  updateWirePoint(wireId, index, x, y) {
    var new_points = this.wires_points.get(wireId);
    new_points[index].x = x;
    new_points[index].y = y;
    this.wires_points.set(wireId, new_points);
  }

  /**
   * Sets the connection between two components.
   * @param {Object} start - The start component information.
   * @param {Object} end - The end component information.
   * @param {string} wireId - The ID of the wire.
   */
  setConnection(start, end, wireId) {
    this.setState({
      components: this.state.components.map((c, i) => {
        if (c.type === start.type && c.id === start.id) {
          if (start.IO === "output") {
            c.outputs[start.index].connections.push(
              Object.assign({}, { type: end.type, id: end.id, wireId: wireId }),
            );
          } else if (start.IO === "input") {
            c.inputs[start.index].connections.push(
              Object.assign({}, { type: end.type, id: end.id, wireId: wireId }),
            );
          }
          return c;
        } else if (c.type === end.type && c.id === end.id) {
          if (end.IO === "output") {
            c.outputs[end.index].connections.push(
              Object.assign(
                {},
                { type: start.type, id: start.id, wireId: wireId },
              ),
            );
          } else if (end.IO === "input") {
            c.inputs[end.index].connections.push(
              Object.assign(
                {},
                { type: start.type, id: start.id, wireId: wireId },
              ),
            );
          }
          return c;
        } else {
          return c;
        }
      }),
    });
  }

  /**
   * Changes the state of a component's output.
   * @param {string} id - The ID of the component.
   * @param {boolean} state - The new state of the output.
   * @param {number} index - The index of the output.
   */
  changeComponentOutputState(id, state, index) {
    var wireIds = [];

    this.setState({
      components: this.state.components.map((c, i) => {
        if (c.id === id) {
          c.outputs.map((output, i) => {
            if (i === index) {
              // Update the state of the output
              output.state = state;

              if (output.connections.length !== 0) {
                // Collect the IDs of connected wires
                wireIds = output.connections.map((connection) => {
                  return connection.wireId;
                });
              }
            }
            return output;
          });
        }
        return c;
      }),
    });

    if (wireIds.length !== 0) {
      // Update the state of connected wires
      this.setState({
        wires: this.state.wires.map((wire) => {
          if (wireIds.includes(wire.id)) {
            wire.active = state;
          }
          return wire;
        }),
      });
    }
  }

  /**
   * Changes the state of a component's input.
   * @param {string} id - The ID of the component.
   * @param {boolean} state - The new state of the input.
   * @param {number} index - The index of the input.
   */
  changeComponentInputState(id, state, index) {
    this.setState({
      components: this.state.components.map((c, i) => {
        if (c.id === id) {
          c.inputs.map((input, i) => {
            if (i === index) {
              // Update the state of the input
              input.state = state;
            }
            return input;
          });
        }
        return c;
      }),
    });
  }

  getComponent(component_id) {
    if (component_id === null) {
      return null;
    }
    for (let i = 0; i < this.state.components.length; i++) {
      if (this.state.components[i].id === component_id) {
        return this.state.components[i];
      }
    }
    return null;
  }

  updateProperties(component_id, name, value) {
    if (name.includes("Input name")) {
      const index = parseInt(name.match(/\d+/)[0]);
      this.setState({
        components: this.state.components.map((c, i) => {
          if (c.id === component_id) {
            c.attributes.input_names[index] = value;
          }
          return c;
        }),
      });
    }
    if (name.includes("Output name")) {
      const index = parseInt(name.match(/\d+/)[0]);
      this.setState({
        components: this.state.components.map((c, i) => {
          if (c.id === component_id) {
            c.attributes.output_names[index] = value;
          }
          return c;
        }),
      });
    }
  }

  render() {
    var components = [];
    for (let i = 0; i < this.state.components.length; i++) {
      // Render SevenSegmentDisplay component
      if (this.state.components[i].type === "7segmentdisplay") {
        components.push(
          <SevenSegmentDisplay
            offset={this.state.offset}
            zoom={this.state.zoom}
            StartEndWire={this.startEndWire}
            setCoord={this.setComponentCoord}
            key={this.state.components[i].id}
            id={this.state.components[i].id}
            onClick={this.selectComponent}
            selected={
              this.state.selectedComponentId === this.state.components[i].id
            }
            x={this.components_coords.get(this.state.components[i].id).x}
            y={this.components_coords.get(this.state.components[i].id).y}
            segments={JSON.stringify({
              a: this.state.components[i].inputs[0].state,
              b: this.state.components[i].inputs[1].state,
              c: this.state.components[i].inputs[2].state,
              d: this.state.components[i].inputs[3].state,
              e: this.state.components[i].inputs[4].state,
              f: this.state.components[i].inputs[5].state,
              g: this.state.components[i].inputs[6].state,
              h: this.state.components[i].inputs[7].state,
            })}
            rotation={this.state.components[i].attributes.rotation}
          ></SevenSegmentDisplay>,
        );
      }
      // Render PushButton component
      else if (this.state.components[i].type === "pushbutton") {
        components.push(
          <PushButton
            offset={this.state.offset}
            zoom={this.state.zoom}
            onStateChange={this.changeComponentOutputState}
            StartEndWire={this.startEndWire}
            id={this.state.components[i].id}
            key={this.state.components[i].id}
            setCoord={this.setComponentCoord}
            onClick={this.selectComponent}
            selected={
              this.state.selectedComponentId === this.state.components[i].id
            }
            x={this.components_coords.get(this.state.components[i].id).x}
            y={this.components_coords.get(this.state.components[i].id).y}
            rotation={this.state.components[i].attributes.rotation}
          ></PushButton>,
        );
      }
      // Render AndGate component
      else if (this.state.components[i].type === "andgate") {
        components.push(
          <AndGate
            offset={this.state.offset}
            zoom={this.state.zoom}
            onStateChange={this.changeComponentOutputState}
            StartEndWire={this.startEndWire}
            id={this.state.components[i].id}
            key={this.state.components[i].id}
            setCoord={this.setComponentCoord}
            onClick={this.selectComponent}
            selected={
              this.state.selectedComponentId === this.state.components[i].id
            }
            x={this.components_coords.get(this.state.components[i].id).x}
            y={this.components_coords.get(this.state.components[i].id).y}
            inputs={JSON.stringify({
              a: this.state.components[i].inputs[0].state,
              b: this.state.components[i].inputs[1].state,
            })}
            rotation={this.state.components[i].attributes.rotation}
            input_names={JSON.stringify(
              this.state.components[i].attributes.input_names,
            )}
            output_names={JSON.stringify(
              this.state.components[i].attributes.output_names,
            )}
          ></AndGate>,
        );
      }
      // Render NotGate component
      else if (this.state.components[i].type === "notgate") {
        components.push(
          <NotGate
            offset={this.state.offset}
            zoom={this.state.zoom}
            onStateChange={this.changeComponentOutputState}
            StartEndWire={this.startEndWire}
            id={this.state.components[i].id}
            key={this.state.components[i].id}
            setCoord={this.setComponentCoord}
            onClick={this.selectComponent}
            selected={
              this.state.selectedComponentId === this.state.components[i].id
            }
            x={this.components_coords.get(this.state.components[i].id).x}
            y={this.components_coords.get(this.state.components[i].id).y}
            input={this.state.components[i].inputs[0].state}
            rotation={this.state.components[i].attributes.rotation}
            input_names={JSON.stringify(
              this.state.components[i].attributes.input_names,
            )}
            output_names={JSON.stringify(
              this.state.components[i].attributes.output_names,
            )}
          ></NotGate>,
        );
      } else if (this.state.components[i].type === "lightbulb") {
        components.push(
          <LightBulb
            offset={this.state.offset}
            zoom={this.state.zoom}
            onStateChange={this.changeComponentOutputState}
            StartEndWire={this.startEndWire}
            id={this.state.components[i].id}
            key={this.state.components[i].id}
            setCoord={this.setComponentCoord}
            onClick={this.selectComponent}
            selected={
              this.state.selectedComponentId === this.state.components[i].id
            }
            x={this.components_coords.get(this.state.components[i].id).x}
            y={this.components_coords.get(this.state.components[i].id).y}
            input={this.state.components[i].inputs[0].state}
            rotation={this.state.components[i].attributes.rotation}
          ></LightBulb>,
        );
      } else if (this.state.components[i].type === "switch") {
        components.push(
          <Switch
            offset={this.state.offset}
            zoom={this.state.zoom}
            onStateChange={this.changeComponentOutputState}
            StartEndWire={this.startEndWire}
            id={this.state.components[i].id}
            key={this.state.components[i].id}
            setCoord={this.setComponentCoord}
            onClick={this.selectComponent}
            selected={
              this.state.selectedComponentId === this.state.components[i].id
            }
            x={this.components_coords.get(this.state.components[i].id).x}
            y={this.components_coords.get(this.state.components[i].id).y}
            rotation={this.state.components[i].attributes.rotation}
          ></Switch>,
        );
      } else if (this.state.components[i].type === "clock") {
        components.push(
          <Clock
            offset={this.state.offset}
            zoom={this.state.zoom}
            onStateChange={this.changeComponentOutputState}
            StartEndWire={this.startEndWire}
            id={this.state.components[i].id}
            key={this.state.components[i].id}
            setCoord={this.setComponentCoord}
            onClick={this.selectComponent}
            selected={
              this.state.selectedComponentId === this.state.components[i].id
            }
            x={this.components_coords.get(this.state.components[i].id).x}
            y={this.components_coords.get(this.state.components[i].id).y}
            rotation={this.state.components[i].attributes.rotation}
          ></Clock>,
        );
      }
    }

    var wires = [];
    for (let i = 0; i < this.state.wires.length; i++) {
      wires.push(
        <Wire
          drawing={false}
          offset={this.state.offset}
          zoom={this.state.zoom}
          updateWirePoint={this.updateWirePoint}
          onStateChange={this.changeComponentInputState}
          active={this.state.wires[i].active}
          start={this.state.wires[i].start}
          end={this.state.wires[i].end}
          key={this.state.wires[i].id}
          id={this.state.wires[i].id}
          onClick={this.selectComponent}
          selected={this.state.selectedComponentId === this.state.wires[i].id}
          strokeBorder={3}
          strokeWidth={5}
          strokeColor="#00ff00"
          points={this.wires_points.get(this.state.wires[i].id)}
        ></Wire>,
      );
    }

    var new_component = [];
    if (this.state.new_component != null) {
      if (this.state.new_component.type === "7segmentdisplay") {
        new_component.push(
          <SevenSegmentDisplay
            offset={this.state.offset}
            zoom={this.state.zoom}
            opacity={0.5}
            new_component={true}
            setCoord={this.setComponentCoord}
            key={this.state.new_component.id}
            id={this.state.new_component.id}
            onClick={() => {
              this.addComponent("7segmentdisplay");
            }}
            selected={false}
            x={this.components_coords.get(this.state.new_component.id).x}
            y={this.components_coords.get(this.state.new_component.id).y}
            segments={JSON.stringify({
              a: false,
              b: false,
              c: false,
              d: false,
              e: false,
              f: false,
              g: false,
              h: false,
            })}
            dragging={true}
          ></SevenSegmentDisplay>,
        );
      } else if (this.state.new_component.type === "pushbutton") {
        new_component.push(
          <PushButton
            offset={this.state.offset}
            zoom={this.state.zoom}
            opacity={0.5}
            new_component={true}
            onStateChange={this.changeComponentOutputState}
            id={this.state.new_component.id}
            key={this.state.new_component.id}
            setCoord={this.setComponentCoord}
            onClick={() => {
              this.addComponent("pushbutton");
            }}
            selected={false}
            x={this.components_coords.get(this.state.new_component.id).x}
            y={this.components_coords.get(this.state.new_component.id).y}
            dragging={true}
          ></PushButton>,
        );
      } else if (this.state.new_component.type === "andgate") {
        new_component.push(
          <AndGate
            offset={this.state.offset}
            zoom={this.state.zoom}
            opacity={0.5}
            new_component={true}
            onStateChange={this.changeComponentOutputState}
            id={this.state.new_component.id}
            key={this.state.new_component.id}
            setCoord={this.setComponentCoord}
            onClick={() => {
              this.addComponent("andgate");
            }}
            selected={false}
            x={this.components_coords.get(this.state.new_component.id).x}
            y={this.components_coords.get(this.state.new_component.id).y}
            inputs={JSON.stringify({ a: false, b: false })}
            dragging={true}
          ></AndGate>,
        );
      } else if (this.state.new_component.type === "notgate") {
        new_component.push(
          <NotGate
            offset={this.state.offset}
            zoom={this.state.zoom}
            opacity={0.5}
            new_component={true}
            onStateChange={this.changeComponentOutputState}
            id={this.state.new_component.id}
            key={this.state.new_component.id}
            setCoord={this.setComponentCoord}
            onClick={() => {
              this.addComponent("notgate");
            }}
            selected={false}
            x={this.components_coords.get(this.state.new_component.id).x}
            y={this.components_coords.get(this.state.new_component.id).y}
            input={false}
            dragging={true}
          ></NotGate>,
        );
      } else if (this.state.new_component.type === "lightbulb") {
        components.push(
          <LightBulb
            offset={this.state.offset}
            zoom={this.state.zoom}
            opacity={0.5}
            new_component={true}
            onStateChange={this.changeComponentOutputState}
            id={this.state.new_component.id}
            key={this.state.new_component.id}
            setCoord={this.setComponentCoord}
            onClick={() => {
              this.addComponent("lightbulb");
            }}
            selected={false}
            x={this.components_coords.get(this.state.new_component.id).x}
            y={this.components_coords.get(this.state.new_component.id).y}
            input={false}
            dragging={true}
          ></LightBulb>,
        );
      } else if (this.state.new_component.type === "switch") {
        new_component.push(
          <Switch
            offset={this.state.offset}
            zoom={this.state.zoom}
            opacity={0.5}
            new_component={true}
            onStateChange={this.changeComponentOutputState}
            id={this.state.new_component.id}
            key={this.state.new_component.id}
            setCoord={this.setComponentCoord}
            onClick={() => {
              this.addComponent("switch");
            }}
            selected={false}
            x={this.components_coords.get(this.state.new_component.id).x}
            y={this.components_coords.get(this.state.new_component.id).y}
            dragging={true}
          ></Switch>,
        );
      } else if (this.state.new_component.type === "clock") {
        new_component.push(
          <Clock
            offset={this.state.offset}
            zoom={this.state.zoom}
            opacity={0.5}
            new_component={true}
            onStateChange={this.changeComponentOutputState}
            id={this.state.new_component.id}
            key={this.state.new_component.id}
            setCoord={this.setComponentCoord}
            onClick={() => {
              this.addComponent("clock");
            }}
            selected={false}
            x={this.components_coords.get(this.state.new_component.id).x}
            y={this.components_coords.get(this.state.new_component.id).y}
            dragging={true}
          ></Clock>,
        );
      }
    }

    var drawingWire = [];
    if (this.state.drawingWire) {
      drawingWire.push(
        <Wire
          drawing={true}
          addWirePoint={this.addWirePoint}
          offset={this.state.offset}
          zoom={this.state.zoom}
          style={{ pointerEvents: "none" }}
          key={-1}
          active={true}
          id={-1}
          onClick={() => {}}
          selected={false}
          strokeBorder={3}
          strokeWidth={5}
          strokeColor="#00ff00"
          points={this.state.drawingWirePoints}
          dragging={true}
          point_dragged={this.state.drawingWirePoints.length - 1}
        ></Wire>,
      );
    }

    var cursor = "default";
    if (this.state.selected_tool === "move") {
      if (this.state.dragging) {
        cursor = "grabbing";
      } else {
        cursor = "grab";
      }
    }

    return (
      <div className="breadboard">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          style={{ cursor: cursor }}
          onMouseDown={this.handleBreadboardClick}
          onMouseMove={this.dragging}
          onMouseUp={this.dragEnd}
        >
          <g
            transform={
              "translate(" +
              (this.state.dragging
                ? this.state.dragging_offset.x
                : this.state.offset.x) +
              "," +
              (this.state.dragging
                ? this.state.dragging_offset.y
                : this.state.offset.y) +
              ") scale(" +
              this.state.zoom +
              ")"
            }
          >
            {components}
            {new_component}
            {drawingWire}
            {wires}
          </g>
        </svg>
        <PropertiesPanel
          updateProperties={this.updateProperties}
          component_id={this.state.selectedComponentId}
          component_name={
            this.state.selectedComponent !== null
              ? this.state.selectedComponent.attributes.name
              : ""
          }
          properties={JSON.stringify(this.properties)}
          display={this.state.selectedComponentId !== null}
        ></PropertiesPanel>
      </div>
    );
  }
}

export default BreadBoard;
