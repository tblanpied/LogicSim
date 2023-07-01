import "../css/and_gate.css";
import React, { useState, useEffect, useRef, useCallback} from "react";

const AndGate = React.memo((props) => {

  // Destructure props and set default values
  const {
    new_component = false,
    dragging = false,
    x,
    y,
    selected,
    opacity = 1,
    rotation = 0,
    inputs,
    zoom,
    offset,
    onClick,
    setCoord,
    onStateChange,
    id,
    StartEndWire
  } = props;

  // Initialize state variables
  const [state, setState] = useState({
    new_component,
    dragging,
    position: {
      x: parseInt(x),
      y: parseInt(y),
    },
    diffX: 103 * zoom,
    diffY: 53 * zoom,
    selected,
    opacity,
    rotation,
    inputs,
    zoom,
    offset,
  });

  const [outputState, setOutputState] = useState(true);

  const start_position = useRef({ x: 0, y: 0 });
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    // Add event listeners for dragging if it's a new component
    if (state.new_component) {
      document.addEventListener("mousemove", _dragging);
      document.addEventListener("mouseup", dragEnd);
      console.log("use effect 1");
      return () => {
        // Remove event listeners on cleanup
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
        // Update coordinates when dragging a new component
        setCoord(
          id,
          (e.pageX - stateRef.current.diffX - stateRef.current.offset.x) /
            stateRef.current.zoom,
          (e.pageY - stateRef.current.diffY - stateRef.current.offset.y) /
            stateRef.current.zoom
        );
      }
      // Call onClick prop
      onClick(id);
      if (!state.new_component) {
        // Store initial position for dragging
        start_position.current.x = e.pageX;
        start_position.current.y = e.pageY;
        const rect = e.currentTarget.getBoundingClientRect();
        setState((prevState) => ({
          ...prevState,
          diffX: e.pageX - rect.left,
          diffY: e.pageY - rect.top,
          dragging: true,
        }));
        // Add event listeners for dragging
        document.addEventListener("mousemove", _dragging);
        document.addEventListener("mouseup", dragEnd);
      }
    }
    // eslint-disable-next-line
  }, []);

  const _dragging = useCallback((e) => {
    e.stopPropagation();
    if (
      stateRef.current.dragging &&
      (start_position.current.x !== e.pageX ||
        start_position.current.y !== e.pageY)
    ) {
      // Update position during dragging
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
      // Update coordinates on drag end
      setCoord(
        id,
        (e.pageX - stateRef.current.diffX - stateRef.current.offset.x) /
          stateRef.current.zoom,
        (e.pageY - stateRef.current.diffY - stateRef.current.offset.y) /
          stateRef.current.zoom
      );
      // Remove event listeners after dragging
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
    if (JSON.stringify(inputs) !== JSON.stringify(state.inputs)) {
      setState((prevState) => ({
        ...prevState,
        inputs: inputs,
      }));
      // Update output state and call onStateChange prop
      if ((inputs.a && inputs.b) !== outputState) {
        setOutputState(inputs.a && inputs.b);
        onStateChange(id, inputs.a && inputs.b, 0);
      }
    }
    if (zoom !== state.zoom) {
      setState((prevState) => ({
        ...prevState,
        zoom: zoom,
      }));
    }
    if (offset !== state.offset) {
      setState((prevState) => ({
        ...prevState,
        offset: offset,
      }));
    }
    // eslint-disable-next-line
  }, [selected, inputs, zoom, offset]);

  return (
    <g
      opacity={state.opacity}
      onMouseDown={dragStart}
      className={"Component-andgate-" + id}
      transform={`translate(${state.position.x},${state.position.y}) rotate(${state.rotation})`}
      width="206"
      height="106"
      viewBox="0 0 206 106"
      fill="none"
    >
      <g className="AndGate">
        <g 
          opacity={state.selected?1:0} 
          className="select-border"
        >
          <rect 
            className="Rectangle 7" 
            x="8" 
            y="15" 
            width="30" 
            height="16" 
            fill="#0A9DFF"
          />
          <circle 
            className="Rectangle" 
            cx="8" 
            cy="23" 
            r="8" 
            fill="#0A9DFF"
          />
          <circle 
            className="Rectangle" 
            cx="8" 
            cy="83" 
            r="8" 
            fill="#0A9DFF"
          />
          <rect 
            className="Rectangle 1" 
            x="35" 
            width="83" 
            height="106" 
            rx="5" 
            fill="#0A9DFF" 
            stroke="#0A9DFF" 
            strokeWidth="4"
          />
          <rect 
            className="Rectangle 12" 
            x="163" 
            y="45" 
            width="35" 
            height="16" 
            fill="#0A9DFF"
          />
          <circle 
            className="Circle" 
            cx="198" 
            cy="53" 
            r="8" 
            fill="#0A9DFF"
          />
          <circle 
            className="Ellipse 1" 
            cx="118" 
            cy="53" 
            r="53" 
            fill="#0A9DFF" 
            stroke="#0A9DFF" 
            strokeWidth="4"
          />
          <rect 
            className="Rectangle 11" 
            x="8" 
            y="75" 
            width="30" 
            height="16" 
            fill="#0A9DFF"
          />
        </g>
        <rect 
          className="Rectangle 6" 
          x="8" 
          y="78" 
          width="35" 
          height="10" 
          fill="black"
        />
        <rect 
          className="Rectangle 10" 
          x="8" 
          y="18" 
          width="35" 
          height="10" 
          fill="black"
        />
        <rect 
          className="Rectangle 4" 
          x="163" 
          y="48" 
          width="35" 
          height="10" 
          fill="black"
        />
        <circle 
          className="Circle" 
          cx="8" 
          cy="23" 
          r="4" 
          fill="black" 
          stroke="black" 
          strokeWidth="2"
        />
        <circle 
          className="Circle_2" 
          cx="8" 
          cy="83" 
          r="4" 
          fill="black" 
          stroke="black" 
          strokeWidth="2"
        />
        <circle 
          className="Circle_3" 
          cx="198" 
          cy="53" 
          r="4" 
          fill="black" 
          stroke="black" 
          strokeWidth="2"
        />
        <path 
          className="Body" 
          fillRule="evenodd" 
          clipRule="evenodd" 
          d="M118 3H43C40.2386 3 38 5.23858 38 8V98C38 100.761 40.2386 103 43 103H118C145.614 103 168 80.6142 168 53C168 25.3858 145.614 3 118 3Z" 
          fill="#215FFF" 
          stroke="black" 
          strokeWidth="4"
        />
        <path 
          className="AND" 
          d="M85.9213 64.064C84.0653 64.064 83.0626 63.7653 82.9133 63.168L81.8573 59.04H76.7693L75.8413 63.008C75.7133 63.6693 74.6893 64 72.7693 64C71.7453 64 70.9879 63.9467 70.4973 63.84C70.0066 63.712 69.7613 63.616 69.7613 63.552L75.4253 41.888C75.4253 41.7173 76.8866 41.632 79.8093 41.632C82.7319 41.632 84.1933 41.7173 84.1933 41.888L89.7293 63.584C89.7293 63.7333 89.2386 63.8507 88.2573 63.936C87.2759 64.0213 86.4973 64.064 85.9213 64.064ZM77.5693 54.976H80.9293L79.4893 48.352H79.2973L77.5693 54.976ZM109.386 63.296C109.386 63.744 108.383 63.968 106.378 63.968C104.373 63.968 103.285 63.808 103.114 63.488L97.77 53.504V63.456C97.77 63.84 96.778 64.032 94.794 64.032C92.8313 64.032 91.85 63.84 91.85 63.456V42.048C91.85 41.728 92.6927 41.568 94.378 41.568C95.0393 41.568 95.8073 41.632 96.682 41.76C97.578 41.8667 98.122 42.08 98.314 42.4L103.434 52.256V42.208C103.434 41.8027 104.426 41.6 106.41 41.6C108.394 41.6 109.386 41.8027 109.386 42.208V63.296ZM112.6 62.528V43.328C112.6 42.7947 112.728 42.3787 112.984 42.08C113.261 41.76 113.613 41.6 114.04 41.6H119.384C122.776 41.6 125.347 42.4533 127.096 44.16C128.867 45.8667 129.752 48.5547 129.752 52.224C129.752 60.0747 126.403 64 119.704 64H114.232C113.144 64 112.6 63.5093 112.6 62.528ZM118.744 47.68V57.248C118.744 57.696 118.776 57.984 118.84 58.112C118.904 58.2187 119.096 58.272 119.416 58.272C120.589 58.272 121.475 57.8347 122.072 56.96C122.691 56.0853 123 54.6347 123 52.608C123 50.56 122.68 49.2267 122.04 48.608C121.421 47.9893 120.429 47.68 119.064 47.68H118.744Z" 
          fill="black"
        />
        <circle 
          onMouseDown={(e) => {StartEndWire(e,id, "andgate", 1, "input")} } 
          className="IO In-1" 
          cx="8" 
          cy="83" 
          r="9" 
          fill="#FF0000" 
          stroke="black" 
          strokeWidth="4"
        />
        <circle 
          onMouseDown={(e) => {StartEndWire(e,id, "andgate", 0, "input")} } 
          className="IO In-0" 
          cx="8" 
          cy="23" 
          r="9" 
          fill="#FF0000" 
          stroke="black" 
          strokeWidth="4"
        />
        <circle 
          onMouseDown={(e) => {StartEndWire(e,id, "andgate", 0, "output")} } 
          className="IO Out-0" 
          cx="198" 
          cy="53" 
          r="9" 
          fill="#FF0000" 
          stroke="black" 
          strokeWidth="4"
        />
      </g>
    </g>     
  );
});

export default AndGate;