import "../css/seven_segment_display.css";
import React, { useState, useEffect, useRef, useCallback } from "react";

const SevenSegmentDisplay = React.memo((props) => {

  // Destructure props and set initial state using useState
  const {
    new_component = false,
    dragging = false,
    x,
    y,
    zoom,
    selected,
    opacity = 1,
    rotation = 0,
    segments,
    offset,
    onClick,
    setCoord,
    id,
    StartEndWire
  } = props;

  const [state, setState] = useState({
    new_component,
    dragging,
    position: {
      x: parseInt(x),
      y: parseInt(y),
    },
    diffX: 124 * zoom,
    diffY: 162 * zoom,
    selected,
    opacity,
    rotation: rotation !== undefined ? rotation : 0,
    segments: JSON.parse(segments),
    zoom,
    offset,
    input_hovered: ""
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
        document.removeEventListener('mousemove', _dragging);
        document.removeEventListener('mouseup', dragEnd);
      }
    }
    // eslint-disable-next-line
  }, []);

  const dragStart = useCallback((e) => {
    e.stopPropagation();
    if (e.button === 0) {
      if (state.new_component) {
        setCoord(
          id,
          (e.pageX - stateRef.current.diffX - stateRef.current.offset.x) / stateRef.current.zoom,
          (e.pageY - stateRef.current.diffY - stateRef.current.offset.y) / stateRef.current.zoom
        );
      }
      onClick(id);
      if (!state.new_component) {
        start_position.current = { x: e.pageX, y: e.pageY };
        const rect = e.currentTarget.getBoundingClientRect();

        var diff;
        if (stateRef.current.rotation == 0) {
          diff = { x: e.pageX - rect.left, y: e.pageY - rect.top };
        } else if (stateRef.current.rotation == 90) {
          diff = { x: e.pageX - rect.right, y: e.pageY - rect.top };
        } else if (stateRef.current.rotation == 180) {
          diff = { x: e.pageX - rect.right, y: e.pageY - rect.bottom };
        } else if (stateRef.current.rotation == 270) {
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
    if (stateRef.current.dragging && (start_position.current.x !== e.pageX || start_position.current.y !== e.pageY)) {
      setState((prevState) => ({
        ...prevState,
        position: {
          x: (e.pageX - stateRef.current.diffX - stateRef.current.offset.x) / stateRef.current.zoom,
          y: (e.pageY - stateRef.current.diffY - stateRef.current.offset.y) / stateRef.current.zoom,
        },
      }));
    }
    // eslint-disable-next-line
  }, []);

  const dragEnd = useCallback((e) => {
    if (!stateRef.current.new_component) {
      setState((prevState) => ({
        ...prevState,
        dragging: false,
      }));
      setCoord(
        id,
        (e.pageX - stateRef.current.diffX - stateRef.current.offset.x) / stateRef.current.zoom,
        (e.pageY - stateRef.current.diffY - stateRef.current.offset.y) / stateRef.current.zoom
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
    if (segments !== JSON.stringify(state.segments)) {
      setState((prevState) => ({
        ...prevState,
        segments: JSON.parse(segments),
      }));
    }
    if (zoom !== state.zoom) {
      setState((prevState) => ({
        ...prevState,
        zoom: zoom,
        diffX: state.diffX * (zoom / state.zoom),
        diffY: state.diffY * (zoom / state.zoom)
      }));
    }
    if (offset !== state.offset) {
      setState((prevState) => ({
        ...prevState,
        offset: offset
      }));
    }
    if (rotation !== undefined && rotation !== state.rotation) {
      setState((prevState) => ({
        ...prevState,
        rotation: rotation
      }));
    }
    // eslint-disable-next-line
  }, [selected, segments, zoom, offset, rotation]);

  const handleHover = (e, input) => {
    setState((prevState) => ({
      ...prevState,
      input_hovered: input
    }));
  };

  const handleMouseLeave = (e) => {
    setState((prevState) => ({
      ...prevState,
      input_hovered: ""
    }));
  };

  return (
    <g opacity={state.opacity} onMouseDown={dragStart} transform={"translate(" + state.position.x + "," + state.position.y + ") rotate(" + state.rotation + ")"} className={"Component-7segmentdisplay-" + id.toString()}>
      <g className="SevenSegmentDisplay">
        <path className={`select-border ${state.selected ? "" : "display-none"}`} d="M47 0C39.8203 0 34 5.82029 34 13V25H13C8.58172 25 5 28.5817 5 33C5 37.4183 8.58172 41 13 41H34V60H13C8.58172 60 5 63.5817 5 68C5 72.4183 8.58172 76 13 76H34V95H13C8.58172 95 5 98.5817 5 103C5 107.418 8.58172 111 13 111H34V130H13C8.58172 130 5 133.582 5 138C5 142.418 8.58172 146 13 146H34V165H13C8.58172 165 5 168.582 5 173C5 177.418 8.58172 181 13 181H34V200H13C8.58172 200 5 203.582 5 208C5 212.418 8.58172 216 13 216H34V235H13C8.58172 235 5 238.582 5 243C5 247.418 8.58172 251 13 251H34V270H13C8.58172 270 5 273.582 5 278C5 282.418 8.58172 286 13 286H34V298C34 305.18 39.8203 311 47 311H239C246.18 311 252 305.18 252 298V13C252 5.8203 246.18 0 239 0H47Z" fill="#0A9DFF" />
        <g className="Outputs-rects">
          <path d="M13 28C10.2386 28 8 30.2386 8 33C8 35.7614 10.2386 38 13 38H38C40.7614 38 43 35.7614 43 33C43 30.2386 40.7614 28 38 28H13Z" fill="black" />
          <path d="M13 63C10.2386 63 8 65.2386 8 68C8 70.7614 10.2386 73 13 73H38C40.7614 73 43 70.7614 43 68C43 65.2386 40.7614 63 38 63H13Z" fill="black" />
          <path d="M8 103C8 100.239 10.2386 98 13 98H38C40.7614 98 43 100.239 43 103C43 105.761 40.7614 108 38 108H13C10.2386 108 8 105.761 8 103Z" fill="black" />
          <path d="M13 133C10.2386 133 8 135.239 8 138C8 140.761 10.2386 143 13 143H38C40.7614 143 43 140.761 43 138C43 135.239 40.7614 133 38 133H13Z" fill="black" />
          <path d="M8 173C8 170.239 10.2386 168 13 168H38C40.7614 168 43 170.239 43 173C43 175.761 40.7614 178 38 178H13C10.2386 178 8 175.761 8 173Z" fill="black" />
          <path d="M13 203C10.2386 203 8 205.239 8 208C8 210.761 10.2386 213 13 213H38C40.7614 213 43 210.761 43 208C43 205.239 40.7614 203 38 203H13Z" fill="black" />
          <path d="M8 243C8 240.239 10.2386 238 13 238H38C40.7614 238 43 240.239 43 243C43 245.761 40.7614 248 38 248H13C10.2386 248 8 245.761 8 243Z" fill="black" />
          <path d="M13 273C10.2386 273 8 275.239 8 278C8 280.761 10.2386 283 13 283H38C40.7614 283 43 280.761 43 278C43 275.239 40.7614 273 38 273H13Z" fill="black" />
        </g>
        <g>
          <circle className="IO In-0" onMouseEnter={(e) => {handleHover(e, "In-0")}} onMouseLeave={handleMouseLeave} onMouseDown={(e) => {StartEndWire(e, id, "7segmentdisplay", 0, "input");}} cx="13" cy="33" r="11" fill="#FF0000" stroke="black" strokeWidth="4"/>
          {state.input_hovered === "In-0" && (
          <g>
            <rect x="-26" y="23" width="20" height="21" fill="rgba(0, 0, 0, 0.5)" />
            <text x="-21.5" y="39"  fontSize="1.3em" fill="rgba(255, 255, 255)" className="input-name">a</text>
          </g>
          )}
        </g>
        <g>
          <circle className="IO In-1" onMouseEnter={(e) => {handleHover(e, "In-1")}} onMouseLeave={handleMouseLeave} onMouseDown={(e) => {StartEndWire(e, id, "7segmentdisplay", 1, "input");}} cx="13" cy="68" r="11" fill="#FF0000" stroke="black" strokeWidth="4" />
          {state.input_hovered === "In-1" && (
          <g>
            <rect x="-26" y="58" width="20" height="21" fill="rgba(0, 0, 0, 0.5)" />
            <text x="-21.5" y="76"  fontSize="1.3em" fill="rgba(255, 255, 255)" className="input-name">b</text>
          </g>
          )}
        </g>
        <g>
          <circle className="IO In-2" onMouseEnter={(e) => {handleHover(e, "In-2")}} onMouseLeave={handleMouseLeave} onMouseDown={(e) => {StartEndWire(e, id, "7segmentdisplay", 2, "input");}} cx="13" cy="103" r="11" fill="#FF0000" stroke="black" strokeWidth="4" />
          {state.input_hovered === "In-2" && (
          <g>
            <rect x="-26" y="93" width="20" height="21" fill="rgba(0, 0, 0, 0.5)" />
            <text x="-21.5" y="109"  fontSize="1.3em" fill="rgba(255, 255, 255)" className="input-name">c</text>
          </g>
          )}
        </g>
        <g>
          <circle className="IO In-3" onMouseEnter={(e) => {handleHover(e, "In-3")}} onMouseLeave={handleMouseLeave} onMouseDown={(e) => {StartEndWire(e, id, "7segmentdisplay", 3, "input");}} cx="13" cy="138" r="11" fill="#FF0000" stroke="black" strokeWidth="4" />
          {state.input_hovered === "In-3" && (
          <g>
            <rect x="-26" y="128" width="20" height="21" fill="rgba(0, 0, 0, 0.5)" />
            <text x="-21.5" y="146"  fontSize="1.3em" fill="rgba(255, 255, 255)" className="input-name">d</text>
          </g>
          )}
        </g>
        <g>
          <circle className="IO In-4" onMouseEnter={(e) => {handleHover(e, "In-4")}} onMouseLeave={handleMouseLeave} onMouseDown={(e) => {StartEndWire(e, id, "7segmentdisplay", 4, "input");}} cx="13" cy="173" r="11" fill="#FF0000" stroke="black" strokeWidth="4" />
          {state.input_hovered === "In-4" && (
          <g>
            <rect x="-26" y="163" width="20" height="21" fill="rgba(0, 0, 0, 0.5)" />
            <text x="-21.5" y="179"  fontSize="1.3em" fill="rgba(255, 255, 255)" className="input-name">e</text>
          </g>
          )}
        </g>
        <g>
          <circle className="IO In-5" onMouseEnter={(e) => {handleHover(e, "In-5")}} onMouseLeave={handleMouseLeave} onMouseDown={(e) => {StartEndWire(e, id, "7segmentdisplay", 5, "input");}} cx="13" cy="208" r="11" fill="#FF0000" stroke="black" strokeWidth="4" />
          {state.input_hovered === "In-5" && (
          <g>
            <rect x="-26" y="198" width="20" height="21" fill="rgba(0, 0, 0, 0.5)" />
            <text x="-20" y="216"  fontSize="1.3em" fill="rgba(255, 255, 255)" className="input-name">f</text>
          </g>
          )}
        </g>
        <g>
          <circle className="IO In-6" onMouseEnter={(e) => {handleHover(e, "In-6")}} onMouseLeave={handleMouseLeave} onMouseDown={(e) => {StartEndWire(e, id, "7segmentdisplay", 6, "input");}} cx="13" cy="243" r="11" fill="#FF0000" stroke="black" strokeWidth="4" />
          {state.input_hovered === "In-6" && (
          <g>
            <rect x="-26" y="233" width="20" height="21" fill="rgba(0, 0, 0, 0.5)" />
            <text x="-21.5" y="247"  fontSize="1.3em" fill="rgba(255, 255, 255)" className="input-name">g</text>
          </g>
          )}
        </g>
        <g>
          <circle className="IO In-7" onMouseEnter={(e) => {handleHover(e, "In-7")}} onMouseLeave={handleMouseLeave} onMouseDown={(e) => {StartEndWire(e, id, "7segmentdisplay", 7, "input");}} cx="13" cy="278" r="11" fill="#FF0000" stroke="black" strokeWidth="4" />
          {state.input_hovered === "In-7" && (
          <g>
            <rect x="-26" y="268" width="20" height="21" fill="rgba(0, 0, 0, 0.5)" />
            <text x="-21.5" y="285"  fontSize="1.3em" fill="rgba(255, 255, 255)" className="input-name">h</text>
          </g>
          )}
        </g>
        <rect className="base" x="38.5" y="4.5" width="209" height="302" rx="8.5" fill="#212121" stroke="black" strokeWidth="3" />
        <path className={"segment-a" + (state.segments.a ? " segment-active" : "") + (state.input_hovered === "In-0"?" segment-selected":"")} d="M89.6637 31.994L95.23 25.5H200.77L206.311 31.9642L187.801 49.5H105.225L89.6637 31.994Z" fill="#7D7D7D" stroke="black" />
        <path className={"segment-d" + (state.segments.d ? " segment-active" : "") + (state.input_hovered === "In-3"?" segment-selected":"")} d="M65.7252 276.018L71.2071 281.5H179.77L185.328 275.016L168.784 257.5H86.1926L65.7252 276.018Z" fill="#7D7D7D" stroke="black" />
        <path className={"segment-f" + (state.segments.f ? " segment-active" : "") + (state.input_hovered === "In-5"?" segment-selected":"")} d="M76.8135 148.5L66.5546 148.5L77.4768 43.2498L83.963 37.6902L99.4803 54.1773L91.5217 135.753L76.8135 148.5Z" fill="#7D7D7D" stroke="black" />
        <path className={"segment-e" + (state.segments.e ? " segment-active" : "") + (state.input_hovered === "In-4"?" segment-selected":"")} d="M74.7929 156.5H65.4608L56.5172 265.81L61.0181 270.311L80.5182 252.761L87.4825 169.19L74.7929 156.5Z" fill="#7D7D7D" stroke="black" />
        <path className={"segment-c" + (state.segments.c ? " segment-active" : "") + (state.input_hovered === "In-2"?" segment-selected":"")} d="M196.196 156.5H206.457L197.519 264.754L191.037 270.31L175.517 253.819L182.482 169.234L196.196 156.5Z" fill="#7D7D7D" stroke="black" />
        <path className={"segment-g" + (state.segments.g ? " segment-active" : "") + (state.input_hovered === "In-6"?" segment-selected":"")} d="M189.324 151.97L177.847 163.5L93.2212 163.5L83.6907 153.016L96.2071 140.5L179.766 140.5L189.324 151.97Z" fill="#7D7D7D" stroke="black" />
        <path className={"segment-b" + (state.segments.b ? " segment-active" : "") + (state.input_hovered === "In-1"?" segment-selected":"")} d="M196.219 148.5L206.545 148.5L216.478 42.2156L211.031 37.6765L193.478 55.2296L184.522 135.828L196.219 148.5Z" fill="#7D7D7D" stroke="black" />
        <circle className={"segment-h" + (state.segments.b ? " segment-active" : "") + (state.input_hovered === "In-7"?" segment-selected":"")} cx="223" cy="274" r="9.5" fill="#7D7D7D" stroke="black" />
      </g>
    </g>
  );
});

export default SevenSegmentDisplay;
