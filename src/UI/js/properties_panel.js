import "../css/properties_panel.css";
import { ReactComponent as CloseIcon } from "../svg/close-icon.svg";
import React, { useState, useEffect, useRef } from "react";

const PropertiesPanel = React.memo((props) => {
  // Destructure props and set initial state using useState
  const { component_name, component_id, properties, display } = props;

  const [state, setState] = useState({
    component_name,
    properties: JSON.parse(properties),
    display,
    component_id,
  });

  const updateProperties = props.updateProperties;

  const stateRef = useRef(state);
  stateRef.current = state;

  const closePanel = (e) => {
    e.stopPropagation();
    setState((prevState) => ({
      ...prevState,
      display: false,
    }));
  };

  useEffect(() => {
    if (display !== undefined && display !== state.display) {
      setState((prevState) => ({
        ...prevState,
        display: display,
      }));
    }
    if (
      component_name !== undefined &&
      component_name !== state.component_name
    ) {
      setState((prevState) => ({
        ...prevState,
        component_name: component_name,
      }));
    }
    if (component_id !== undefined && component_id !== state.component_id) {
      setState((prevState) => ({
        ...prevState,
        component_id: component_id,
      }));
    }
    if (
      properties !== undefined &&
      properties !== JSON.stringify(state.properties)
    ) {
      setState((prevState) => ({
        ...prevState,
        properties: JSON.parse(properties),
      }));
    }
    // eslint-disable-next-line
  }, [display, component_name, component_id, properties]);

  const onChangeHandler = (e) => {
    updateProperties(state.component_id, e.target.name, e.target.value);
  };

  var properties_groups = [];

  for (let i = 0; i < stateRef.current.properties.length; i++) {
    properties_groups.push(
      <div
        key={`property_group_${state.component_id}_${i}`}
        className="property_group"
      >
        <div
          key={`property_input_type_${state.component_id}_${i}`}
          className="property_input_type"
        >
          <div
            key={`property_name_${state.component_id}_${i}`}
            className="property_name"
          >
            {stateRef.current.properties[i].name}
          </div>
          <div
            key={`property_input_${state.component_id}_${i}`}
            className="property_input"
          >
            <input
              key={`property_input_text_${state.component_id}_${i}`}
              name={stateRef.current.properties[i].name}
              onChange={onChangeHandler}
              defaultValue={stateRef.current.properties[i].default}
              className="property_input_text"
              type="text"
            />
          </div>
        </div>
      </div>,
    );
  }

  return (
    <div
      className={"properties_panel" + (state.display ? "" : " display-none")}
    >
      <div className="properties_header">
        <div className="component_name">{state.component_name}</div>
        <div className="close-icon_container" onClick={closePanel}>
          <CloseIcon className="close-icon"></CloseIcon>
        </div>
      </div>
      <form className="properties_form" autoComplete="off">
        {properties_groups}
      </form>
    </div>
  );
});

export default PropertiesPanel;
