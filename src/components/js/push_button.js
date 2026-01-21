import "../css/push_button.css";
import React, { useState, useEffect, useRef, useCallback } from "react";

const PushButton = React.memo((props) => {
  // Destructure props and set initial state using useState
  const {
    active = false,
    new_component = false,
    dragging = false,
    x,
    y,
    zoom,
    selected,
    opacity = 1,
    rotation = 0,
    offset,
    onClick,
    setCoord,
    onStateChange,
    id,
    StartEndWire,
  } = props;

  const [state, setState] = useState({
    active,
    new_component,
    dragging,
    position: {
      x: parseInt(x),
      y: parseInt(y),
    },
    diffX: 64 * zoom,
    diffY: 40 * zoom,
    selected,
    opacity,
    rotation: rotation !== undefined ? rotation : 0,
    zoom,
    offset,
    input_hovered: "",
  });

  const start_position = useRef({ x: 0, y: 0 });

  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (state.new_component) {
      // Add event listeners when new_component is true
      document.addEventListener("mousemove", _dragging);
      document.addEventListener("mouseup", dragEnd);
      return () => {
        // Clean up event listeners when component unmounts or new_component is false
        document.removeEventListener("mousemove", _dragging);
        document.removeEventListener("mouseup", dragEnd);
      };
    }
    // eslint-disable-next-line
  }, []);

  const dragStart = useCallback((e) => {
    e.stopPropagation();
    if (e.button === 0) {
      if (state.new_component) {
        setCoord(
          id,
          (e.pageX - stateRef.current.diffX - stateRef.current.offset.x) /
            stateRef.current.zoom,
          (e.pageY - stateRef.current.diffY - stateRef.current.offset.y) /
            stateRef.current.zoom,
        );
      }
      onClick(id);
      if (!state.new_component) {
        start_position.current.x = e.pageX;
        start_position.current.y = e.pageY;
        const rect = e.currentTarget.getBoundingClientRect();

        var diff;
        if (stateRef.current.rotation === 0) {
          diff = { x: e.pageX - rect.left, y: e.pageY - rect.top };
        } else if (stateRef.current.rotation === 90) {
          diff = { x: e.pageX - rect.right, y: e.pageY - rect.top };
        } else if (stateRef.current.rotation === 180) {
          diff = { x: e.pageX - rect.right, y: e.pageY - rect.bottom };
        } else if (stateRef.current.rotation === 270) {
          diff = { x: e.pageX - rect.left, y: e.pageY - rect.bottom };
        }
        setState((prevState) => ({
          ...prevState,
          diffX: diff.x,
          diffY: diff.y,
          dragging: true,
        }));
        document.addEventListener("mousemove", _dragging);
        document.addEventListener("mouseup", dragEnd);
      }
    }
    // eslint-disable-next-line
  }, []);

  const _dragging = useCallback((e) => {
    e.stopPropagation();
    if (
      (stateRef.current.dragging &&
        (start_position.current.x !== e.pageX ||
          start_position.current.y !== e.pageY) &&
        stateRef.current.selected) ||
      stateRef.current.new_component
    ) {
      setState((prevState) => ({
        ...prevState,
        position: {
          x:
            (e.pageX - stateRef.current.diffX - stateRef.current.offset.x) /
            stateRef.current.zoom,
          y:
            (e.pageY - stateRef.current.diffY - stateRef.current.offset.y) /
            stateRef.current.zoom,
        },
      }));
    }
    // eslint-disable-next-line
  }, []);

  const dragEnd = useCallback((e) => {
    e.stopPropagation();
    if (!stateRef.current.new_component) {
      setState((prevState) => ({
        ...prevState,
        dragging: false,
      }));
      setCoord(
        id,
        (e.pageX - stateRef.current.diffX - stateRef.current.offset.x) /
          stateRef.current.zoom,
        (e.pageY - stateRef.current.diffY - stateRef.current.offset.y) /
          stateRef.current.zoom,
      );
      document.removeEventListener("mousemove", _dragging);
      document.removeEventListener("mouseup", dragEnd);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Update state when props change
    if (selected !== state.selected) {
      setState((prevState) => ({
        ...prevState,
        selected: selected,
      }));
    }
    if (zoom !== state.zoom) {
      setState((prevState) => ({
        ...prevState,
        zoom: zoom,
        diffX: state.diffX * (zoom / state.zoom),
        diffY: state.diffY * (zoom / state.zoom),
      }));
    }
    if (offset !== state.offset) {
      setState((prevState) => ({
        ...prevState,
        offset: offset,
      }));
    }
    if (rotation !== undefined && rotation !== state.rotation) {
      setState((prevState) => ({
        ...prevState,
        rotation: rotation,
      }));
    }
    // eslint-disable-next-line
  }, [selected, zoom, offset, rotation]);

  const _buttonPress = useCallback((e) => {
    if (!stateRef.current.new_component) {
      setState((prevState) => ({
        ...prevState,
        active: true,
      }));
      onStateChange(id, true, 0);
    }
    // eslint-disable-next-line
  }, []);

  const _buttonRelease = useCallback((e) => {
    if (!stateRef.current.new_component) {
      setState((prevState) => ({
        ...prevState,
        active: false,
      }));
      onStateChange(id, false, 0);
    }
    // eslint-disable-next-line
  }, []);

  const handleHover = (e, input) => {
    setState((prevState) => ({
      ...prevState,
      input_hovered: input,
    }));
  };

  const handleMouseLeave = (e) => {
    setState((prevState) => ({
      ...prevState,
      input_hovered: "",
    }));
  };

  return (
    <g
      opacity={state.opacity}
      onMouseDown={dragStart}
      className={"Component-pushbutton-" + id}
      transform={`translate(${state.position.x},${state.position.y}) rotate(${state.rotation})`}
      width="132"
      height="86"
      viewBox="0 0 132 86"
      fill="none"
    >
      <g className="PushButton">
        <path
          className={`select-border ${state.selected ? "" : "display-none"}`}
          fillRule="evenodd"
          clipRule="evenodd"
          d="M81.1065 49C77.201 67.2865 60.952 81 41.5 81C19.1325 81 1 62.8675 1 40.5C1 18.1325 19.1325 0 41.5 0C61.305 0 77.7897 14.2157 81.3069 33H119C123.418 33 127 36.5817 127 41C127 45.4183 123.418 49 119 49H81.1065Z"
          fill="#0A9DFF"
        />
        <path
          className="Line"
          d="M41 41H119"
          stroke="black"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <g className="button" filter="url(#filter0_d_108_11)">
          <circle
            onMouseDown={_buttonPress}
            onMouseUp={_buttonRelease}
            cx="41.5"
            cy="40.5"
            r="37.5"
            fill={state.active ? "#ea2828" : "#531F21"}
          />
          <circle cx="41.5" cy="40.5" r="35" stroke="black" strokeWidth="5" />
        </g>
        <g>
          <circle
            className="IO Out-0"
            onMouseEnter={(e) => {
              handleHover(e, "Out-0");
            }}
            onMouseLeave={handleMouseLeave}
            onMouseDown={(e) => {
              StartEndWire(e, id, "pushbutton", 0, "output");
            }}
            cx="119"
            cy="41"
            r="11"
            fill="#FF0000"
            stroke="black"
            strokeWidth="4"
          />
          {state.input_hovered === "Out-0" && (
            <g>
              <rect
                x="145"
                y="30"
                width="70"
                height="23"
                fill="rgba(0, 0, 0, 0.6)"
              />
              <text
                x="147"
                y="47"
                fontWeight="700"
                letterSpacing="-2px"
                fontFamily='"Lucida Console", Monaco, monospace'
                fontSize="1.3em"
                fill="rgba(255, 255, 255)"
                className="input-name"
              >
                output
              </text>
            </g>
          )}
        </g>
      </g>
      <defs>
        <filter
          className="filter0_d_108_11"
          x="0"
          y="3"
          width="83"
          height="83"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_108_11"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_108_11"
            result="shape"
          />
        </filter>
      </defs>
    </g>
  );
});

export default PushButton;
