import "../css/not_gate.css";
import React, { useState, useEffect, useRef } from "react";

const NotGate = React.memo((props) => {
    const [state, setState] = useState({
      new_component: props.new_component === undefined ? false : props.new_component,
      dragging: props.dragging !== undefined ? props.dragging : false,
      position: {
        x: parseInt(props.x),
        y: parseInt(props.y),
      },
      diffX: 97 * props.zoom,
      diffY: 75 * props.zoom,
      selected: props.selected,
      opacity: props.opacity === undefined ? 1 : props.opacity,
      rotation: props.rotation === undefined ? 0 : props.rotation,
      input: props.input,
      zoom: props.zoom,
      offset: props.offset
    });
    const [outputState, setOutputState] = useState(true);
  
    const onClick = props.onClick;
    const setCoord = props.setCoord;
    const onStateChange = props.onStateChange;
    const id = props.id;
    const start_position = { x: 0, y: 0 };
    const StartEndWire = props.StartEndWire;

    const stateRef = useRef(state);
    stateRef.current = state;
  
    const dragStart = (e) => {
      e.stopPropagation();
      if (e.button === 0) {
        if(state.new_component){
          setCoord(id, ((e.pageX - stateRef.current.diffX - stateRef.current.offset.x) / stateRef.current.zoom), ((e.pageY - stateRef.current.diffY - stateRef.current.offset.y) / stateRef.current.zoom));
        }
        onClick(id);
        if (!state.new_component) {
          start_position.x = e.pageX;
          start_position.y = e.pageY;
          const rect = e.currentTarget.getBoundingClientRect();
          setState((prevState) => ({
            ...prevState,
            diffX: e.pageX - rect.left,
            diffY: e.pageY - rect.top,
            dragging: true
          }));
          document.addEventListener("mousemove", dragging);
          document.addEventListener("mouseup", dragEnd);
        }
      }
    };
  
    const dragging = (e) => {
      e.stopPropagation();
      if (stateRef.current.dragging && (start_position.x !== e.pageX || start_position.y !== e.pageY)) {
        setState((prevState) => ({
          ...prevState,
          position: {
            x: ((e.pageX - stateRef.current.diffX - stateRef.current.offset.x) / stateRef.current.zoom),
            y: ((e.pageY - stateRef.current.diffY - stateRef.current.offset.y) / stateRef.current.zoom),
          },
        }));
      }
    };
  
    const dragEnd = (e) => {
      e.stopPropagation();
      if (!stateRef.current.new_component) {
        setState((prevState) => ({
          ...prevState,
          dragging: false,
        }));
        setCoord(id, ((e.pageX - stateRef.current.diffX - stateRef.current.offset.x) / stateRef.current.zoom), ((e.pageY - stateRef.current.diffY - stateRef.current.offset.y) / stateRef.current.zoom));
        document.removeEventListener("mousemove", dragging);
        document.removeEventListener("mouseup", dragEnd);
      }
    };
  
    useEffect(() => {
      onStateChange(id, !state.input, 0);
      if (state.new_component) {
        document.addEventListener("mousemove", dragging);
        document.addEventListener("mouseup", dragEnd);
        return () => {
            document.removeEventListener('mousemove', dragging);
            document.removeEventListener('mouseup', dragEnd);
        }
      }
    }, []);
  
    useEffect(() => {
      if (props.selected !== state.selected) {
        setState((prevState) => ({
          ...prevState,
          selected: props.selected,
        }));
      }
      if (props.input !== state.input) {
        setState((prevState) => ({
          ...prevState,
          input: props.input,
        }));
        if (!props.input !== outputState) {
          setOutputState(!props.input);
          onStateChange(id, !props.input, 0);
        }
      }
      if(props.zoom != state.zoom){
        setState((prevState) => ({
          ...prevState,
          zoom: props.zoom
        }));
      }
      if(props.offset != state.offset){
        setState((prevState) => ({
          ...prevState,
          offset: props.offset
        }));
      }
    }, [props.selected, props.input, props.zoom, props.offset]);
  
    return (
            <g opacity={state.opacity} onMouseDown={dragStart} className={"Component-notgate-" + id} transform={"translate(" + state.position.x + "," + state.position.y + ") rotate(" + state.rotation + ")"} width="198" height="152" viewBox="0 0 198 152" fill="none">
                <g className="NotGate">
                  <g opacity={state.selected?1:0} className="select-border">
                    <path className="Polygon 2" d="M163 69.5718C168.333 72.651 168.333 80.349 163 83.4282L46.75 150.545C41.4167 153.624 34.75 149.775 34.75 143.617L34.75 9.38303C34.75 3.22463 41.4167 -0.624376 46.75 2.45483L163 69.5718Z" fill="#0A9DFF"/>
                    <rect className="Rectangle 3" x="12.9999" y="69" width="35" height="15" fill="#0A9DFF"/>
                    <rect className="Rectangle 4" x="149" y="69" width="35" height="15" fill="#0A9DFF"/>
                    <circle className="Ellipse 3" cx="13.4999" cy="76.5" r="7.5" fill="#0A9DFF"/>
                    <circle className="Ellipse 4" cx="184.5" cy="76.5" r="7.5" fill="#0A9DFF"/>
                  </g>
                  <rect className="Rectangle 7" x="149" y="72" width="35" height="9" fill="black"/>
                  <circle className="Ellipse 7" cx="184.5" cy="76.5" r="4.5" fill="black"/>
                  <rect className="Rectangle 8" x="12.9999" y="72" width="35" height="9" fill="black"/>
                  <circle className="Ellipse 8" cx="13.4999" cy="76.5" r="4.5" fill="black"/>
                  <path className="Polygon 4" d="M160.25 78.6651L44 145.782C42.3333 146.744 40.25 145.541 40.25 143.617L40.25 9.38303C40.25 7.45853 42.3334 6.25571 44 7.21796L160.25 74.3349C161.917 75.2972 161.917 77.7028 160.25 78.6651Z" fill="#9218F1" stroke="black" strokeWidth="5"/>
                  <path className="NOT" d="M77.1359 87.296C77.1359 87.744 76.1332 87.968 74.1279 87.968C72.1225 87.968 71.0345 87.808 70.8639 87.488L65.5199 77.504V87.456C65.5199 87.84 64.5279 88.032 62.5439 88.032C60.5812 88.032 59.5999 87.84 59.5999 87.456V66.048C59.5999 65.728 60.4425 65.568 62.1279 65.568C62.7892 65.568 63.5572 65.632 64.4319 65.76C65.3279 65.8667 65.8719 66.08 66.0639 66.4L71.1839 76.256V66.208C71.1839 65.8027 72.1759 65.6 74.1599 65.6C76.1439 65.6 77.1359 65.8027 77.1359 66.208V87.296ZM89.8539 88.32C86.8672 88.32 84.4245 87.3387 82.5259 85.376C80.6485 83.4133 79.7099 80.5547 79.7099 76.8C79.7099 73.024 80.6592 70.1653 82.5579 68.224C84.4779 66.2827 86.9419 65.312 89.9499 65.312C92.9792 65.312 95.4219 66.272 97.2779 68.192C99.1339 70.0907 100.062 72.9813 100.062 76.864C100.062 80.7253 99.1125 83.6053 97.2139 85.504C95.3152 87.3813 92.8619 88.32 89.8539 88.32ZM89.8859 71.456C88.8619 71.456 87.9979 71.9253 87.2939 72.864C86.6112 73.8027 86.2699 75.1253 86.2699 76.832C86.2699 78.5173 86.6005 79.8187 87.2619 80.736C87.9232 81.632 88.7872 82.08 89.8539 82.08C90.9419 82.08 91.8165 81.6213 92.4779 80.704C93.1605 79.7867 93.5019 78.4747 93.5019 76.768C93.5019 75.0613 93.1499 73.7493 92.4459 72.832C91.7632 71.9147 90.9099 71.456 89.8859 71.456ZM112.263 87.488C112.263 87.9147 111.207 88.128 109.095 88.128C106.983 88.128 105.927 87.9147 105.927 87.488V71.424H102.087C101.724 71.424 101.468 70.9333 101.319 69.952C101.255 69.4827 101.223 69.0027 101.223 68.512C101.223 68.0213 101.255 67.5413 101.319 67.072C101.468 66.0907 101.724 65.6 102.087 65.6H116.007C116.37 65.6 116.626 66.0907 116.775 67.072C116.839 67.5413 116.871 68.0213 116.871 68.512C116.871 69.0027 116.839 69.4827 116.775 69.952C116.626 70.9333 116.37 71.424 116.007 71.424H112.263V87.488Z" fill="black"/>
                  <circle onMouseDown={(e) => {StartEndWire(e, id, "notgate", 0, "output")} } className="IO Out-0" cx="184.5" cy="76.5" r="11.5" fill="#FF0000" stroke="black" strokeWidth="4"/>
                  <circle onMouseDown={(e) => {StartEndWire(e, id, "notgate", 0, "input")} } className="IO In-0" cx="13.4999" cy="76.5" r="11.5" fill="#FF0000" stroke="black" strokeWidth="4"/>
                </g>
            </g>
    );
});

export default NotGate;