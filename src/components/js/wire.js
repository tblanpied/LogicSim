import "../css/wire.css";
import React, { useState, useEffect, useRef } from "react";

const Wire = React.memo((props) => {

  const [state, setState] = useState({
      points: props.points,
      dragging: props.dragging !== undefined ? props.dragging : false,
      selected: props.selected,
      active: props.active === undefined ? false : props.active,
      style: props.style === undefined ? {} : props.style,
      start: props.start,
      end: props.end,
      zoom: props.zoom,
      offset: props.offset,
      start_observer: null,
      end_observer: null
  });
  //console.log(state.points);
  const onStateChange = props.onStateChange;
  const updateWirePoint = props.updateWirePoint;
  const onClick = props.onClick;
  const id = props.id;


  const stateRef = useRef(state);
  stateRef.current = state;

  const observe = (zoom, offset) => {
    if(state.end != undefined && state.start != undefined){

      if(state.start_observer != null){
        state.start_observer.disconnect();
      }

      if(state.end_observer != null){
        state.end_observer.disconnect();
      }

      const targetend = document.getElementsByClassName("Component-" + state.end.type + "-" + state.end.id);
      const targetstart = document.getElementsByClassName("Component-" + state.start.type + "-" + state.start.id);

      var start_observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if(mutation.attributeName == 'transform'){
            var target = state.start.IO === "output" ? targetstart[0].getElementsByClassName("Out-" + state.start.index)[0] : targetstart[0].getElementsByClassName("In-" + state.start.index)[0];
            var center = {
              x: (target.getBoundingClientRect().left + (target.getBoundingClientRect().width / 2) - offset.x) / zoom,
              y: (target.getBoundingClientRect().top + (target.getBoundingClientRect().height / 2) - offset.y) / zoom
            };
            setState((prevState) => ({
              ...prevState,
              points: state.points.map((c,i)=>{
                if(i == 0){
                  c.x = center.x;
                  c.y = center.y
                  return c;
                } 
                else{
                  return c;
                }
              })
            }));
          }
        });
      });
      const config = {attributes: true};
      start_observer.observe(targetstart[0], config);

      var end_observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if(mutation.attributeName == 'transform'){
            var target = state.end.IO === "output" ? targetend[0].getElementsByClassName("Out-" + state.end.index)[0] : targetend[0].getElementsByClassName("In-" + state.end.index)[0];
            var center = {
              x: (target.getBoundingClientRect().left + (target.getBoundingClientRect().width / 2) - offset.x) / zoom,
              y: (target.getBoundingClientRect().top + (target.getBoundingClientRect().height / 2) - offset.y) / zoom
            };
            setState((prevState) => ({
              ...prevState,
              points: state.points.map((c,i)=>{
                if(i == state.points.length-1){
                  c.x = center.x;
                  c.y = center.y
                  return c;
                }
                else{
                  return c;
                }
              })
            }));
          }
        });
      });
      end_observer.observe(targetend[0], config);

      setState((prevState) => ({
        ...prevState,
        start_observer: start_observer,
        end_observer: end_observer
      }));
    }
  };

  // ComponentDidMount
  useEffect(() => {
    observe(state.zoom, state.offset);
  }, []);
  

  const LightenDarkenColor = (col, amt) => {
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
  };

  const dragStart = (e, i) => {
    e.stopPropagation();
    setState((prevState) => ({
      ...prevState,
      dragging: true
    }));
    document.addEventListener("mousemove", (e) => { dragging(e, i); });
    document.addEventListener("mouseup", (e) => {dragEnd(e, i);});
  };

  const dragging = (e, i) => {
    if (stateRef.current.dragging) {
      let points = [...stateRef.current.points];
      let point = { ...points[i] };
      point.x = (e.pageX - state.offset.x) / stateRef.current.zoom;
      point.y = (e.pageY - state.offset.y) / stateRef.current.zoom;
      points[i] = point;
      setState((prevState) => ({
        ...prevState,
        points: points
      }));
    }
  };

  const dragEnd = (e, i) => {
    setState((prevState) => ({
      ...prevState,
      dragging: false
    }));
    updateWirePoint(id, i, stateRef.current.points[i].x, stateRef.current.points[i].y);
    document.removeEventListener("mousemove", (e) => { dragging(e, i); });
    document.removeEventListener("mouseup", (e) => {dragEnd(e, i);});
  };

  // ComponentDidUpdate
  useEffect(() => {
    if (props.selected !== state.selected) {
      setState((prevState) => ({
        ...prevState,
        selected: props.selected,
      }));
    }
    if (props.points.length !== state.points.length) {
      //console.log("points");
      setState((prevState) => ({
        ...prevState,
        points: props.points
      }));
    }
    if(props.active != state.active){
      setState((prevState) => ({
        ...prevState,
        active: props.active
      }));
      onStateChange(state.end.id, props.active, state.end.index);
    }
    var zoom = false;
    var offset = false;
    if(props.zoom != state.zoom){
      setState((prevState) => ({
        ...prevState,
        zoom: props.zoom
      }));
      zoom = true;
    }
    if(props.offset != state.offset){
      setState((prevState) => ({
        ...prevState,
        offset: props.offset
      }));
      offset = true;
    }
    if(zoom && offset){
      observe(props.zoom, props.offset);
    } else if(zoom){
      observe(props.zoom, state.offset);
    } else if(offset){
      observe(state.zoom, props.offset);
    }
}, [props.selected, props.points, props.active, props.zoom, props.offset]);

const strokeWidth = props.strokeWidth === undefined ? 1 : props.strokeWidth;
const strokeColor = props.strokeColor === undefined ? "#000000" : props.strokeColor;
const strokeBorder = props.strokeBorder === undefined ? 0 : props.strokeBorder;
const inactiveColor = LightenDarkenColor(strokeColor, -175);

    //console.log(state.points);
    const angle = (A, B, C) =>
      ((Math.atan2(C.y - B.y, C.x - B.x) -
        Math.atan2(A.y - B.y, A.x - B.x) +
        3 * Math.PI) %
        (2 * Math.PI)) -
      Math.PI;

    var data = "";
    var points = [];
    var key = 0;
    data += "M" + state.points[0].x + "," + state.points[0].y;
    if (state.selected) {
      points.push(<g onMouseDown={(e) => { dragStart(e, 0); }} onMouseMove={(e) => { dragging(e, 0); }} onMouseUp={(e) => { dragEnd(e, 0); }} key={key++}><circle key={key++} fill={state.active ? strokeColor : inactiveColor} stroke={state.active ? LightenDarkenColor(strokeColor, -50) : LightenDarkenColor(inactiveColor, -25)} strokeWidth={2} cx={state.points[0].x} cy={state.points[0].y} r={7} /><circle key={key++} fill={state.active ? LightenDarkenColor(strokeColor, -50) : LightenDarkenColor(inactiveColor, -25)} cx={state.points[0].x} cy={state.points[0].y} r={3} /></g>);
    }
    for (let i = 1; i < state.points.length - 1; i++) {
      var radius = 20;
      var dxa = state.points[i].x - state.points[i - 1].x;
      var dya = state.points[i].y - state.points[i - 1].y;
      var dxb = state.points[i + 1].x - state.points[i].x;
      var dyb = state.points[i + 1].y - state.points[i].y;
      var va = {
        x: dxa+dya == 0? 0 : dxa / Math.sqrt(Math.pow(dxa, 2) + Math.pow(dya, 2)),
        y: dxa+dya == 0? 0 : dya / Math.sqrt(Math.pow(dxa, 2) + Math.pow(dya, 2)),
      };
      var vb = {
        x: dxb+dyb == 0? 0 : dxb / Math.sqrt(Math.pow(dxb, 2) + Math.pow(dyb, 2)),
        y: dxb+dyb == 0? 0 : dyb / Math.sqrt(Math.pow(dxb, 2) + Math.pow(dyb, 2)),
      };
      var angleBetweenLines = Math.acos((-va.x) * vb.x + (-va.y) * vb.y);
      var r = 0;
      if(Math.tan((angleBetweenLines) / 2) != 0){
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
      //var c = { x: ka.x + (ka.x - kb.x) / 2, y: ka.y + (ka.y - kb.y) / 2 };

      data += " L" + ka.x + "," + ka.y;
      data += " A" + radius + " " + radius + " " + 0 + " " + 0 + " " + (angle(kb, ka, state.points[i]) > 0 ? 0 : 1) + " " + kb.x + "," + kb.y;

      if (state.selected) {
        points.push(<g onMouseDown={(e) => { dragStart(e, i); }} onMouseMove={(e) => { dragging(e, i); }} onMouseUp={(e) => { dragEnd(e, i); }} key={key++}><circle key={key++} fill={state.active ? strokeColor : inactiveColor} stroke={state.active ? LightenDarkenColor(strokeColor, -50) : LightenDarkenColor(inactiveColor, -25)} strokeWidth={2} cx={state.points[i].x} cy={state.points[i].y} r={7} /><circle key={key++} fill={state.active ? LightenDarkenColor(strokeColor, -50) : LightenDarkenColor(inactiveColor, -25)} cx={state.points[i].x} cy={state.points[i].y} r={3} /></g>);
      }
    }
    data += " L" + state.points[state.points.length - 1].x + "," + state.points[state.points.length - 1].y;

    if (state.selected) {
      points.push(<g onMouseDown={(e) => { dragStart(e, state.points.length - 1); }} onMouseMove={(e) => { dragging(e, state.points.length - 1); }} onMouseUp={(e) => { dragEnd(e, state.points.length - 1); }} key={key++}><circle key={key++} fill={state.active ? strokeColor : inactiveColor} stroke={state.active ? LightenDarkenColor(strokeColor, -50) : LightenDarkenColor(inactiveColor, -25)} strokeWidth={2} cx={state.points[state.points.length - 1].x} cy={state.points[state.points.length - 1].y} r={7} /><circle key={key++} fill={state.active ? LightenDarkenColor(strokeColor, -50) : LightenDarkenColor(inactiveColor, -25)} cx={state.points[state.points.length - 1].x} cy={state.points[state.points.length - 1].y} r={3} /></g>);
    }
    return (
      <g className="wire" style={state.style}>
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
