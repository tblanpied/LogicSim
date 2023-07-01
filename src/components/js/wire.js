import "../css/wire.css";
import React, { useState, useEffect, useRef, useCallback, useMemo} from "react";
import { config } from '../../config';

const Wire = React.memo((props) => {

  // Destructure props
  const {
    points: propsPoints,
    dragging: propsDragging,
    point_dragged: propsPointDragged,
    selected: propsSelected,
    active: propsActive,
    style: propsStyle,
    start: propsStart,
    end: propsEnd,
    zoom: propsZoom,
    offset: propsOffset,
    onStateChange,
    updateWirePoint,
    onClick,
    id,
  } = props;

  // Set initial state using useState
  const [state, setState] = useState({
    points: propsPoints,
    dragging: propsDragging !== undefined ? propsDragging : false,
    point_dragged: propsPointDragged !== undefined ? propsPointDragged : null,
    selected: propsSelected,
    active: propsActive === undefined ? false : propsActive,
    style: propsStyle === undefined ? {} : propsStyle,
    start: propsStart,
    end: propsEnd,
    zoom: propsZoom,
    offset: propsOffset,
    start_observer: null,
    end_observer: null,
  });

  // Create a ref to hold the state value
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if(state.dragging){
      document.addEventListener("mousemove", dragging);
      return () => {
        document.removeEventListener('mousemove', dragging);
      }
    }
    // eslint-disable-next-line
  }, []);

  // Function to observe changes in the start and end components output / input
  const observe = useCallback(() => {
    if (state.end !== undefined && state.start !== undefined) {
      if (state.start_observer !== null) {
        state.start_observer.disconnect();
      }

      if (state.end_observer !== null) {
        state.end_observer.disconnect();
      }

      const targetend = document.getElementsByClassName(
        `Component-${state.end.type}-${state.end.id}`
      );
      const targetstart = document.getElementsByClassName(
        `Component-${state.start.type}-${state.start.id}`
      );

      // Observer for the start component
      const start_observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === "transform") {
            var target =
              state.start.IO === "output"
                ? targetstart[0].getElementsByClassName(
                  `Out-${state.start.index}`
                )[0]
                : targetstart[0].getElementsByClassName(
                  `In-${state.start.index}`
                )[0];
            var center = {
              x:
                (target.getBoundingClientRect().left +
                  target.getBoundingClientRect().width / 2 -
                  state.offset.x) /
                  state.zoom,
              y:
                (target.getBoundingClientRect().top +
                  target.getBoundingClientRect().height / 2 -
                  state.offset.y) /
                state.zoom,
            };
            setState((prevState) => ({
              ...prevState,
              points: state.points.map((c, i) => {
                if (i === 0) {
                  c.x = center.x;
                  c.y = center.y;
                }
                return c;
              }),
            }));
          }
        });
      });
      const config = { attributes: true };
      start_observer.observe(targetstart[0], config);

      // Observer for the end component
      const end_observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === "transform") {
            var target =
              state.end.IO === "output"
                ? targetend[0].getElementsByClassName(
                  `Out-${state.end.index}`
                )[0]
                : targetend[0].getElementsByClassName(
                  `In-${state.end.index}`
                )[0];
            var center = {
              x:
                (target.getBoundingClientRect().left +
                  target.getBoundingClientRect().width / 2 -
                  state.offset.x) /
                  state.zoom,
              y:
                (target.getBoundingClientRect().top +
                  target.getBoundingClientRect().height / 2 -
                  state.offset.y) /
                  state.zoom,
            };
            setState((prevState) => ({
              ...prevState,
              points: state.points.map((c, i) => {
                if (i === state.points.length - 1) {
                  c.x = center.x;
                  c.y = center.y;
                }
                return c;
              }),
            }));
          }
        });
      });
      end_observer.observe(targetend[0], config);

      setState((prevState) => ({
        ...prevState,
        start_observer,
        end_observer,
      }));
    } 
    // eslint-disable-next-line
  }, [state.zoom, state.offset]); 

  // useEffect to update the observation of the start and end components output / input 
  useEffect(() => {
    observe();
  }, [observe]);


  // Adjusts the brightness of a color by the given amount
  const LightenDarkenColor = useCallback((col, amt) => {
    var usePound = false;
    if (col[0] === "#") {
      col = col.slice(1);
      usePound = true;
    }

    var num = parseInt(col, 16);

    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    var b = ((num >> 8) & 0x00ff) + amt;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    var g = (num & 0x0000ff) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    const res = (g | (b << 8) | (r << 16)).toString(16);
    return (usePound ? "#" : "") + "0".repeat(6 - res.length) + res;
  }, []);

  // Event handler for dragging start
  const dragStart = useCallback((e, i) => {
    e.stopPropagation();
    setState((prevState) => ({
      ...prevState,
      dragging: true,
      point_dragged: i
    }));
    document.addEventListener("mousemove", dragging);
    document.addEventListener("mouseup", dragEnd);
    // eslint-disable-next-line
  }, []);

  // Event handler for dragging
  const dragging = useCallback((e) => {
    if (stateRef.current.dragging) {
      let points = [...stateRef.current.points];
      let point = { ...points[stateRef.current.point_dragged] };
      point.x = (e.pageX - stateRef.current.offset.x) / stateRef.current.zoom;
      point.y = (e.pageY - stateRef.current.offset.y) / stateRef.current.zoom;
      points[stateRef.current.point_dragged] = point;
      setState((prevState) => ({
        ...prevState,
        points: points
      }));
    }
  }, []);

  // Event handler for dragging end
  const dragEnd = useCallback((e) => {
    setState((prevState) => ({
      ...prevState,
      dragging: false,
      point_dragged: null
    }));
    updateWirePoint(id, stateRef.current.point_dragged, stateRef.current.points[stateRef.current.point_dragged].x, stateRef.current.points[stateRef.current.point_dragged].y);
    document.removeEventListener("mousemove", dragging);
    document.removeEventListener("mouseup", dragEnd);
    // eslint-disable-next-line
  }, []);

  // ComponentDidUpdate
  useEffect(() => {
    // Check if the selected prop has changed
    if (props.selected !== state.selected) {
      setState((prevState) => ({
        ...prevState,
        selected: props.selected,
      }));
    }

    // Check if the points prop has changed
    if (props.points.length !== state.points.length) {
      setState((prevState) => ({
        ...prevState,
        points: props.points
      }));
    }

    // Check if the active prop has changed
    if (props.active !== state.active) {
      setState((prevState) => ({
        ...prevState,
        active: props.active
      }));
      onStateChange(state.end.id, props.active, state.end.index);
    }

    // Check if the point_dragged prop has changed
    if (props.point_dragged !== undefined && props.point_dragged !== state.point_dragged) {
      setState((prevState) => ({
        ...prevState,
        point_dragged: props.point_dragged
      }));
    }

    // Check if zoom or offset props have changed
    if (props.zoom !== state.zoom) {
      setState((prevState) => ({
        ...prevState,
        zoom: props.zoom
      }));
    }

    if (props.offset !== state.offset) {
      setState((prevState) => ({
        ...prevState,
        offset: props.offset
      }));
    }

    if(props.dragging !== undefined && props.dragging !== state.dragging){
      setState((prevState) => ({
        ...prevState,
        dragging: props.dragging
      }));
      if(props.dragging){
        document.addEventListener("mousemove", dragging);
      } else {
        document.removeEventListener("mousemove", dragging);
      }
    }
    // eslint-disable-next-line
  }, [props.selected, props.points, props.active, props.zoom, props.offset, props.point_dragged, props.dragging]);

  const strokeWidth = props.strokeWidth === undefined ? 1 : props.strokeWidth;
  const strokeColor = props.strokeColor === undefined ? "#000000" : props.strokeColor;
  const strokeBorder = props.strokeBorder === undefined ? 0 : props.strokeBorder;
  const inactiveColor = useMemo(() => {
    return LightenDarkenColor(strokeColor, -175)
    // eslint-disable-next-line
  }, [strokeColor]);

  // Calculate angle between three points
  const angle = useCallback((A, B, C) => {
    return (((Math.atan2(C.y - B.y, C.x - B.x) - Math.atan2(A.y - B.y, A.x - B.x) + 3 * Math.PI) % (2 * Math.PI)) - Math.PI);
  }, [])

  // Initialize variables
  var data = "";
  var snap_data = "";
  var points = [];
  var key = 0;

  // Start building the path data from the first point
  data += "M" + state.points[0].x + "," + state.points[0].y;

  if (state.selected) {
    // Add points (circles) for the first point if selected
    points.push(
      <g
        onMouseDown={(e) => {dragStart(e, 0);}}
        key={key++}
      >
        <circle
          key={key++}
          fill={state.active ? strokeColor : inactiveColor}
          stroke={state.active ? LightenDarkenColor(strokeColor, -50) : LightenDarkenColor(inactiveColor, -25)}
          strokeWidth={2}
          cx={state.points[0].x}
          cy={state.points[0].y}
          r={7}
        />
        <circle
          key={key++}
          fill={state.active ? LightenDarkenColor(strokeColor, -50) : LightenDarkenColor(inactiveColor, -25)}
          cx={state.points[0].x}
          cy={state.points[0].y}
          r={3}
        />
      </g>
    );
  }
  for (let i = 1; i < state.points.length - 1; i++) {
    // Calculate angles and radius for each curve
    var radius = 20;
    var dxa = state.points[i].x - state.points[i - 1].x;
    var dya = state.points[i].y - state.points[i - 1].y;
    var dxb = state.points[i + 1].x - state.points[i].x;
    var dyb = state.points[i + 1].y - state.points[i].y;

    // Snap to horizontal or vertical lines if dragged close enough
    if (state.dragging && state.point_dragged !== null && state.point_dragged === i) {
      //va hozizontal
      if (dya <= config.wire.snap_range && dya >= -config.wire.snap_range) {
        dya = 0;
        state.points[i].y = state.points[i - 1].y;
        snap_data += "M" + (-state.offset.x / state.zoom) + "," + state.points[i].y;
        snap_data += "L" + (window.screen.width - state.offset.x) / state.zoom + "," + state.points[i].y;
      }
      //vb hozizontal
      if (dyb <= config.wire.snap_range && dyb >= -config.wire.snap_range) {
        dyb = 0;
        state.points[i].y = state.points[i + 1].y;
        snap_data += "M" + (-state.offset.x / state.zoom) + "," + state.points[i].y;
        snap_data += "L" + (window.screen.width - state.offset.x) / state.zoom + "," + state.points[i].y;
      }
      //va vertical 
      if (dxa <= config.wire.snap_range && dxa >= -config.wire.snap_range) {
        dxa = 0;
        state.points[i].x = state.points[i - 1].x;
        snap_data += "M" + state.points[i].x + "," + (-state.offset.y / state.zoom);
        snap_data += "L" + state.points[i].x + "," + (window.screen.height - state.offset.y) / state.zoom;
      }
      //vb vertical
      if (dxb <= config.wire.snap_range && dxb >= -config.wire.snap_range) {
        dxb = 0;
        state.points[i].x = state.points[i + 1].x;
        snap_data += "M" + state.points[i].x + "," + (-state.offset.y / state.zoom);
        snap_data += "L" + state.points[i].x + "," + (window.screen.height - state.offset.y) / state.zoom;
      }
    }

    var va = {
      x: (dxa === 0 && dya === 0) ? 0 : dxa / Math.sqrt(Math.pow(dxa, 2) + Math.pow(dya, 2)),
      y: (dxa === 0 && dya === 0) ? 0 : dya / Math.sqrt(Math.pow(dxa, 2) + Math.pow(dya, 2)),
    };
    var vb = {
      x: (dxb === 0 && dyb === 0) ? 0 : dxb / Math.sqrt(Math.pow(dxb, 2) + Math.pow(dyb, 2)),
      y: (dxb === 0 && dyb === 0) ? 0 : dyb / Math.sqrt(Math.pow(dxb, 2) + Math.pow(dyb, 2)),
    };

    var angleBetweenLines = Math.acos((-va.x) * vb.x + (-va.y) * vb.y);
    var r = 0;
    if (Math.tan((angleBetweenLines) / 2) !== 0) {
      r = radius / Math.tan((angleBetweenLines) / 2);
    }
    if (r > 25) {
      r = 25;
      radius = Math.tan((angleBetweenLines) / 2) * r;
    }
    if (r !== Math.min(r, Math.sqrt(Math.pow(dxa, 2) + Math.pow(dya, 2)), Math.sqrt(Math.pow(dxb, 2) + Math.pow(dyb, 2)))) {
      r = Math.min(Math.sqrt(Math.pow(dxa, 2) + Math.pow(dya, 2)), Math.sqrt(Math.pow(dxb, 2) + Math.pow(dyb, 2)));
      radius = Math.tan((angleBetweenLines) / 2) * r;
    }
    var ka = {
      x: state.points[i - 1].x + (dxa - va.x * r),
      y: state.points[i - 1].y + (dya - va.y * r),
    };
    var kb = {
      x: state.points[i].x + vb.x * r,
      y: state.points[i].y + vb.y * r,
    };

    // Build path data for the curve
    data += " L" + ka.x + "," + ka.y;
    data += " A" + radius + " " + radius + " " + 0 + " " + 0 + " " + (angle(kb, ka, state.points[i]) > 0 ? 0 : 1) + " " + kb.x + "," + kb.y;

    if (state.selected) {
      // Add points (circles) for each curve if selected
      points.push(
        <g 
          onMouseDown={(e) => { dragStart(e, i) }} 
          key={key++}>
          <circle 
            key={key++} 
            fill={state.active ? strokeColor : inactiveColor} 
            stroke={state.active ? LightenDarkenColor(strokeColor, -50) : LightenDarkenColor(inactiveColor, -25)} 
            strokeWidth={2} 
            cx={state.points[i].x} 
            cy={state.points[i].y} 
            r={7} 
          />
          <circle 
            key={key++} 
            fill={state.active ? LightenDarkenColor(strokeColor, -50) : LightenDarkenColor(inactiveColor, -25)} 
            cx={state.points[i].x} 
            cy={state.points[i].y} 
            r={3} 
          />
        </g>
      );
    }
  }

  // Snap to horizontal or vertical lines when the wire is being drawn
  if (state.dragging && state.point_dragged !== null && state.point_dragged === state.points.length - 1) {
    dxa = state.points[state.point_dragged].x - state.points[state.point_dragged - 1].x;
    dya = state.points[state.point_dragged].y - state.points[state.point_dragged - 1].y;
    //hozizontal
    if (dya <= config.wire.snap_range && dya >= -config.wire.snap_range) {
      dya = 0;
      state.points[state.point_dragged].y = state.points[state.point_dragged - 1].y;
      snap_data += "M" + (-state.offset.x / state.zoom) + "," + state.points[state.point_dragged].y;
      snap_data += "L" + (window.screen.width - state.offset.x) / state.zoom + "," + state.points[state.point_dragged].y;
    }
    //vertical 
    if (dxa <= config.wire.snap_range && dxa >= -config.wire.snap_range) {
      dxa = 0;
      state.points[state.point_dragged].x = state.points[state.point_dragged - 1].x;
      snap_data += "M" + state.points[state.point_dragged].x + "," + (-state.offset.y / state.zoom);
      snap_data += "L" + state.points[state.point_dragged].x + "," + (window.screen.height - state.offset.y) / state.zoom;
    }
  }

  // Connect the last point with a straight line
  data += " L" + state.points[state.points.length - 1].x + "," + state.points[state.points.length - 1].y;

  // Add points (circles) for the last point if selected
  if (state.selected) {
    points.push(
      <g 
        onMouseDown={(e) => { dragStart(e, state.points.length - 1) }} 
        key={key++}
      >
        <circle 
          key={key++} 
          fill={state.active ? strokeColor : inactiveColor} 
          stroke={state.active ? LightenDarkenColor(strokeColor, -50) : LightenDarkenColor(inactiveColor, -25)} 
          strokeWidth={2} 
          cx={state.points[state.points.length - 1].x} 
          cy={state.points[state.points.length - 1].y} 
          r={7} 
        />
        <circle 
          key={key++} 
          fill={state.active ? LightenDarkenColor(strokeColor, -50) : LightenDarkenColor(inactiveColor, -25)} 
          cx={state.points[state.points.length - 1].x} 
          cy={state.points[state.points.length - 1].y} 
          r={3} 
        />
      </g>
    );
  }

  return (
    <g className="wire" style={state.style}>
      <path
        className={"snap-line"}
        d={snap_data}
        fill="none"
        strokeWidth={strokeWidth / 2}
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#3399ff"
        strokeDasharray="6 4"
      >
      </path>
      <path
        className={"wire-background" + (state.selected ? "-selected" : "")}
        d={data}
        fill="none"
        strokeWidth={strokeWidth * 4}
        strokeLinecap="round"
        strokeLinejoin="round"
        onMouseDown={(e) => { e.stopPropagation(); onClick(id); }}
      ></path>
      {strokeBorder !== 0 ? (
        <path
          d={data}
          fill="none"
          stroke={state.active ? LightenDarkenColor(strokeColor, -50) : LightenDarkenColor(inactiveColor, -25)}
          strokeWidth={strokeWidth + strokeBorder}
          strokeLinecap="round"
          strokeLinejoin="round"
          onMouseDown={(e) => { e.stopPropagation(); onClick(id); }}
        ></path>
      ) : (
        ""
      )}
      <path
        d={data}
        fill="none"
        stroke={state.active ? strokeColor : inactiveColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        onMouseDown={(e) => { e.stopPropagation(); onClick(id); }}
      ></path>
      {points}
    </g>
  );

});

export default Wire;
