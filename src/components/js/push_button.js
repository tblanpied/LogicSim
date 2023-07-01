import "../css/push_button.css";
import React, { useState, useEffect, useRef } from "react";

const PushButton = React.memo((props) => {

    const [state, setState] = useState({
        active: props.active === undefined ? false : props.active,
        new_component: props.new_component === undefined ? false : props.new_component,
        dragging: props.dragging !== undefined ? props.dragging : false,
        position: {
            x: parseInt(props.x),
            y: parseInt(props.y),
        },
        diffX: 37 * props.zoom,
        diffY: 40 * props.zoom,
        selected: props.selected,
        opacity: props.opacity === undefined ? 1 : props.opacity,
        rotation: props.rotation === undefined ? 0 : props.rotation,
        zoom: props.zoom,
        offset: props.offset
    });
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
    }, [props.selected, props.zoom, props.offset]);

    const _buttonPress = (e) => {
        if (!stateRef.current.new_component) {
            setState((prevState) => ({
                ...prevState,
                active: true
            }));
            onStateChange(id, true, 0);
        }
    };

    const _buttonRelease = (e) => {
        if (!stateRef.current.new_component) {
            setState((prevState) => ({
                ...prevState,
                active: false
            }));
            onStateChange(id, false, 0);
        }
    }

    return (
            <g opacity={state.opacity} onMouseDown={dragStart} className={"Component-pushbutton-" + id} transform={"translate(" + state.position.x + "," + state.position.y + ") rotate(" + state.rotation + ")"} width="137" height="86" viewBox="0 0 137 86" fill="none">
                <g className="PushButton">
                    <path opacity={state.selected?1:0} className="select-border" fillRule="evenodd" clipRule="evenodd" d="M81.3069 48C77.7897 66.7843 61.305 81 41.5 81C19.1325 81 1 62.8675 1 40.5C1 18.1325 19.1325 0 41.5 0C61.6549 0 78.3712 14.7226 81.4812 34H102.412C105.143 27.5361 111.542 23 119 23C128.941 23 137 31.0589 137 41C137 50.9411 128.941 59 119 59C111.542 59 105.143 54.4639 102.412 48H81.3069Z" fill="#0A9DFF" />
                    <path className="Line" d="M41 41H119" stroke="black" strokeWidth="8" strokeLinecap="round" />
                    <g className="button" filter="url(#filter0_d_3_2)">
                        <circle onMouseDown={_buttonPress} onMouseUp={_buttonRelease} cx="41.5" cy="40.5" r="37.5" fill={state.active?"#ea2828":"#531F21"} />
                        <circle cx="41.5" cy="40.5" r="35" stroke="black" strokeWidth="5" />
                    </g>
                    <circle onMouseDown={(e) => {StartEndWire(e,id, "pushbutton", 0, "output")} } className="IO Out-0" cx="119" cy="41" r="12.5" fill="black" stroke="black" strokeWidth="5" />
                </g>
                <defs>
                    <filter id="filter0_d_3_2" x="0" y="3" width="83" height="83" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy="4" />
                        <feGaussianBlur stdDeviation="2" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3_2" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3_2" result="shape" />
                    </filter>
                </defs>
            </g>
    );
});

export default PushButton;