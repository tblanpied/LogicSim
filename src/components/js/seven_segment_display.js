import "../css/seven_segment_display.css";
import React, { useState, useEffect, useRef, useCallback} from "react";

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
    rotation,
    segments: JSON.parse(segments),
    zoom,
    offset
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
        setState((prevState) => ({
          ...prevState,
          diffX: e.pageX - rect.left,
          diffY: e.pageY - rect.top,
          dragging: true
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
    if(segments !== JSON.stringify(state.segments)){
      setState((prevState) => ({
        ...prevState,
        segments: JSON.parse(segments),
      }));
    }
    if(zoom !== state.zoom){
      setState((prevState) => ({
        ...prevState,
        zoom: zoom,
        diffX: state.diffX * (zoom / state.zoom),
        diffY: state.diffY * (zoom / state.zoom)
      }));
    }
    if(offset !== state.offset){
      setState((prevState) => ({
        ...prevState,
        offset: offset
      }));
    }
    // eslint-disable-next-line
  }, [selected, segments, zoom, offset]);

  return (
      <g opacity={state.opacity} onMouseDown={dragStart} transform={"translate(" + state.position.x + "," + state.position.y + ") rotate(" + state.rotation + ")"} className={"Component-7segmentdisplay-" + id.toString()}>
        <g className="SevenSegmentDisplay">
          <rect
            className={`select-border ${state.selected ? "" : "display-none"}`}
            x="-4.5"
            y="-4.5"
            width="249"
            height="324"
            rx="13"
            fill="#0A9DFF"
          />
          <rect
            className="base"
            x="1.5"
            y="1.5"
            width="237"
            height="312"
            rx="8.5"
            fill="#212121"
            stroke="#575757"
            strokeWidth="3"
          />
          <path
            className={
              "segment-a" + (state.segments.a ? " segment-active" : "")
            }
            d="M78.6637 33.994L84.23 27.5H189.77L195.311 33.9642L176.801 51.5H94.2245L78.6637 33.994Z"
            fill="#7D7D7D"
            stroke="black"
          />
          <path
            className={
              "segment-d" + (state.segments.d ? " segment-active" : "")
            }
            d="M54.7252 278.018L60.2071 283.5H168.77L174.328 277.016L157.784 259.5H75.1926L54.7252 278.018Z"
            fill="#7D7D7D"
            stroke="black"
          />
          <path
            className={
              "segment-f" + (state.segments.f ? " segment-active" : "")
            }
            d="M65.8135 150.5L55.5546 150.5L66.4768 45.2498L72.963 39.6902L88.4803 56.1773L80.5217 137.753L65.8135 150.5Z"
            fill="#7D7D7D"
            stroke="black"
          />
          <path
            className={
              "segment-e" + (state.segments.e ? " segment-active" : "")
            }
            d="M63.7929 158.5H54.4608L45.5172 267.81L50.0181 272.311L69.5182 254.761L76.4825 171.19L63.7929 158.5Z"
            fill="#7D7D7D"
            stroke="black"
          />
          <path
            className={
              "segment-c" + (state.segments.c ? " segment-active" : "")
            }
            d="M185.196 158.5H195.457L186.519 266.754L180.037 272.31L164.517 255.819L171.482 171.234L185.196 158.5Z"
            fill="#7D7D7D"
            stroke="black"
          />
          <path
            className={
              "segment-g" + (state.segments.g ? " segment-active" : "")
            }
            d="M178.324 153.97L166.847 165.5L82.2211 165.5L72.6906 155.016L85.2071 142.5L168.766 142.5L178.324 153.97Z"
            fill="#7D7D7D"
            stroke="black"
          />
          <path
            className={
              "segment-b" + (state.segments.b ? " segment-active" : "")
            }
            d="M185.219 150.5L195.545 150.5L205.478 44.2156L200.031 39.6765L182.478 57.2296L173.522 137.828L185.219 150.5Z"
            fill="#7D7D7D"
            stroke="black"
          />
          <circle
            className={
              "segment-h" + (state.segments.h ? " segment-active" : "")
            }
            cx="212"
            cy="276"
            r="9.5"
            fill="#7D7D7D"
            stroke="black"
          />
          <g className="IO In-7" onMouseDown={(e) => {StartEndWire(e, id, "7segmentdisplay", 7, "input")} }>
          <g className="left-bottom">
            <mask id="path-10-inside-1_28_439" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.5 245.5H13C13 249.642 16.3579 253 20.5 253V245.5Z"
              />
            </mask>
            <path
              d="M20.5 245.5H25.5V240.5H20.5V245.5ZM13 245.5V240.5H8V245.5H13ZM20.5 253V258H25.5V253H20.5ZM20.5 240.5H13V250.5H20.5V240.5ZM8 245.5C8 252.404 13.5964 258 20.5 258V248C19.1193 248 18 246.881 18 245.5H8ZM25.5 253V245.5H15.5V253H25.5Z"
              fill="#262626"
              mask="url(#path-10-inside-1_28_439)"
            />
          </g>
          <g className="right-bottom">
            <mask id="path-12-inside-2_28_439" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.5 253C24.6421 253 28 249.642 28 245.5H20.5V253Z"
              />
            </mask>
            <path
              d="M20.5 253H15.5V258H20.5V253ZM28 245.5H33V240.5H28V245.5ZM20.5 245.5V240.5H15.5V245.5H20.5ZM20.5 258C27.4036 258 33 252.404 33 245.5H23C23 246.881 21.8807 248 20.5 248V258ZM28 240.5H20.5V250.5H28V240.5ZM15.5 245.5V253H25.5V245.5H15.5Z"
              fill="#707070"
              mask="url(#path-12-inside-2_28_439)"
            />
          </g>
          <g className="right-top">
            <mask id="path-14-inside-3_28_439" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.5 245.5H28C28 241.358 24.6421 238 20.5 238V245.5Z"
              />
            </mask>
            <path
              d="M20.5 245.5H15.5V250.5H20.5V245.5ZM28 245.5V250.5H33V245.5H28ZM20.5 238V233H15.5V238H20.5ZM20.5 250.5H28V240.5H20.5V250.5ZM33 245.5C33 238.596 27.4036 233 20.5 233V243C21.8807 243 23 244.119 23 245.5H33ZM15.5 238V245.5H25.5V238H15.5Z"
              fill="#515151"
              mask="url(#path-14-inside-3_28_439)"
            />
          </g>
          <g className="left-top">
            <mask id="path-16-inside-4_28_439" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.5 238C16.3579 238 13 241.358 13 245.5H20.5V238Z"
              />
            </mask>
            <path
              d="M20.5 238H25.5V233H20.5V238ZM13 245.5H8V250.5H13V245.5ZM20.5 245.5V250.5H25.5V245.5H20.5ZM20.5 233C13.5964 233 8 238.596 8 245.5H18C18 244.119 19.1193 243 20.5 243V233ZM13 250.5H20.5V240.5H13V250.5ZM25.5 245.5V238H15.5V245.5H25.5Z"
              fill="#212121"
              mask="url(#path-16-inside-4_28_439)"
            />
          </g>
          <circle
            className="center"
            cx="20.5"
            cy="245.5"
            r="5"
            fill="#191919"
          />
        </g>
        <g className="IO In-6" onMouseDown={(e) => {StartEndWire(e, id, "7segmentdisplay", 6, "input")} }>
          <g className="left-bottom">
            <mask id="path-19-inside-5_28_439" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.5 220.5H13C13 224.642 16.3579 228 20.5 228V220.5Z"
              />
            </mask>
            <path
              d="M20.5 220.5H25.5V215.5H20.5V220.5ZM13 220.5V215.5H8V220.5H13ZM20.5 228V233H25.5V228H20.5ZM20.5 215.5H13V225.5H20.5V215.5ZM8 220.5C8 227.404 13.5964 233 20.5 233V223C19.1193 223 18 221.881 18 220.5H8ZM25.5 228V220.5H15.5V228H25.5Z"
              fill="#262626"
              mask="url(#path-19-inside-5_28_439)"
            />
          </g>
          <g className="right-bottom">
            <mask id="path-21-inside-6_28_439" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.5 228C24.6421 228 28 224.642 28 220.5H20.5V228Z"
              />
            </mask>
            <path
              d="M20.5 228H15.5V233H20.5V228ZM28 220.5H33V215.5H28V220.5ZM20.5 220.5V215.5H15.5V220.5H20.5ZM20.5 233C27.4036 233 33 227.404 33 220.5H23C23 221.881 21.8807 223 20.5 223V233ZM28 215.5H20.5V225.5H28V215.5ZM15.5 220.5V228H25.5V220.5H15.5Z"
              fill="#707070"
              mask="url(#path-21-inside-6_28_439)"
            />
          </g>
          <g className="right-top">
            <mask id="path-23-inside-7_28_439" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.5 220.5H28C28 216.358 24.6421 213 20.5 213V220.5Z"
              />
            </mask>
            <path
              d="M20.5 220.5H15.5V225.5H20.5V220.5ZM28 220.5V225.5H33V220.5H28ZM20.5 213V208H15.5V213H20.5ZM20.5 225.5H28V215.5H20.5V225.5ZM33 220.5C33 213.596 27.4036 208 20.5 208V218C21.8807 218 23 219.119 23 220.5H33ZM15.5 213V220.5H25.5V213H15.5Z"
              fill="#515151"
              mask="url(#path-23-inside-7_28_439)"
            />
          </g>
          <g className="left-top">
            <mask id="path-25-inside-8_28_439" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.5 213C16.3579 213 13 216.358 13 220.5H20.5V213Z"
              />
            </mask>
            <path
              d="M20.5 213H25.5V208H20.5V213ZM13 220.5H8V225.5H13V220.5ZM20.5 220.5V225.5H25.5V220.5H20.5ZM20.5 208C13.5964 208 8 213.596 8 220.5H18C18 219.119 19.1193 218 20.5 218V208ZM13 225.5H20.5V215.5H13V225.5ZM25.5 220.5V213H15.5V220.5H25.5Z"
              fill="#212121"
              mask="url(#path-25-inside-8_28_439)"
            />
          </g>
          <circle
            className="center"
            cx="20.5"
            cy="220.5"
            r="5"
            fill="#191919"
          />
        </g>
        <g className="IO In-5" onMouseDown={(e) => {StartEndWire(e, id, "7segmentdisplay", 5, "input")} }>
          <g className="left-bottom">
            <mask id="path-28-inside-9_28_439" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.5 195.5H13C13 199.642 16.3579 203 20.5 203V195.5Z"
              />
            </mask>
            <path
              d="M20.5 195.5H25.5V190.5H20.5V195.5ZM13 195.5V190.5H8V195.5H13ZM20.5 203V208H25.5V203H20.5ZM20.5 190.5H13V200.5H20.5V190.5ZM8 195.5C8 202.404 13.5964 208 20.5 208V198C19.1193 198 18 196.881 18 195.5H8ZM25.5 203V195.5H15.5V203H25.5Z"
              fill="#262626"
              mask="url(#path-28-inside-9_28_439)"
            />
          </g>
          <g className="right-bottom">
            <mask id="path-30-inside-10_28_439" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.5 203C24.6421 203 28 199.642 28 195.5H20.5V203Z"
              />
            </mask>
            <path
              d="M20.5 203H15.5V208H20.5V203ZM28 195.5H33V190.5H28V195.5ZM20.5 195.5V190.5H15.5V195.5H20.5ZM20.5 208C27.4036 208 33 202.404 33 195.5H23C23 196.881 21.8807 198 20.5 198V208ZM28 190.5H20.5V200.5H28V190.5ZM15.5 195.5V203H25.5V195.5H15.5Z"
              fill="#707070"
              mask="url(#path-30-inside-10_28_439)"
            />
          </g>
          <g className="right-top">
            <mask id="path-32-inside-11_28_439" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.5 195.5H28C28 191.358 24.6421 188 20.5 188V195.5Z"
              />
            </mask>
            <path
              d="M20.5 195.5H15.5V200.5H20.5V195.5ZM28 195.5V200.5H33V195.5H28ZM20.5 188V183H15.5V188H20.5ZM20.5 200.5H28V190.5H20.5V200.5ZM33 195.5C33 188.596 27.4036 183 20.5 183V193C21.8807 193 23 194.119 23 195.5H33ZM15.5 188V195.5H25.5V188H15.5Z"
              fill="#515151"
              mask="url(#path-32-inside-11_28_439)"
            />
          </g>
          <g className="left-top">
            <mask id="path-34-inside-12_28_439" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.5 188C16.3579 188 13 191.358 13 195.5H20.5V188Z"
              />
            </mask>
            <path
              d="M20.5 188H25.5V183H20.5V188ZM13 195.5H8V200.5H13V195.5ZM20.5 195.5V200.5H25.5V195.5H20.5ZM20.5 183C13.5964 183 8 188.596 8 195.5H18C18 194.119 19.1193 193 20.5 193V183ZM13 200.5H20.5V190.5H13V200.5ZM25.5 195.5V188H15.5V195.5H25.5Z"
              fill="#212121"
              mask="url(#path-34-inside-12_28_439)"
            />
          </g>
          <circle
            className="center"
            cx="20.5"
            cy="195.5"
            r="5"
            fill="#191919"
          />
        </g>
        <g className="IO In-4" onMouseDown={(e) => {StartEndWire(e, id, "7segmentdisplay", 4, "input")} }>
          <g className="left-bottom">
            <mask id="path-37-inside-13_28_439" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.5 170.5H13C13 174.642 16.3579 178 20.5 178V170.5Z"
              />
            </mask>
            <path
              d="M20.5 170.5H25.5V165.5H20.5V170.5ZM13 170.5V165.5H8V170.5H13ZM20.5 178V183H25.5V178H20.5ZM20.5 165.5H13V175.5H20.5V165.5ZM8 170.5C8 177.404 13.5964 183 20.5 183V173C19.1193 173 18 171.881 18 170.5H8ZM25.5 178V170.5H15.5V178H25.5Z"
              fill="#262626"
              mask="url(#path-37-inside-13_28_439)"
            />
          </g>
          <g className="right-bottom">
            <mask id="path-39-inside-14_28_439" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.5 178C24.6421 178 28 174.642 28 170.5H20.5V178Z"
              />
            </mask>
            <path
              d="M20.5 178H15.5V183H20.5V178ZM28 170.5H33V165.5H28V170.5ZM20.5 170.5V165.5H15.5V170.5H20.5ZM20.5 183C27.4036 183 33 177.404 33 170.5H23C23 171.881 21.8807 173 20.5 173V183ZM28 165.5H20.5V175.5H28V165.5ZM15.5 170.5V178H25.5V170.5H15.5Z"
              fill="#707070"
              mask="url(#path-39-inside-14_28_439)"
            />
          </g>
          <g className="right-top">
            <mask id="path-41-inside-15_28_439" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.5 170.5H28C28 166.358 24.6421 163 20.5 163V170.5Z"
              />
            </mask>
            <path
              d="M20.5 170.5H15.5V175.5H20.5V170.5ZM28 170.5V175.5H33V170.5H28ZM20.5 163V158H15.5V163H20.5ZM20.5 175.5H28V165.5H20.5V175.5ZM33 170.5C33 163.596 27.4036 158 20.5 158V168C21.8807 168 23 169.119 23 170.5H33ZM15.5 163V170.5H25.5V163H15.5Z"
              fill="#515151"
              mask="url(#path-41-inside-15_28_439)"
            />
          </g>
          <g className="left-top">
            <mask id="path-43-inside-16_28_439" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.5 163C16.3579 163 13 166.358 13 170.5H20.5V163Z"
              />
            </mask>
            <path
              d="M20.5 163H25.5V158H20.5V163ZM13 170.5H8V175.5H13V170.5ZM20.5 170.5V175.5H25.5V170.5H20.5ZM20.5 158C13.5964 158 8 163.596 8 170.5H18C18 169.119 19.1193 168 20.5 168V158ZM13 175.5H20.5V165.5H13V175.5ZM25.5 170.5V163H15.5V170.5H25.5Z"
              fill="#212121"
              mask="url(#path-43-inside-16_28_439)"
            />
          </g>
          <circle
            className="center"
            cx="20.5"
            cy="170.5"
            r="5"
            fill="#191919"
          />
        </g>
        <g className="IO In-3" onMouseDown={(e) => {StartEndWire(e, id, "7segmentdisplay", 3, "input")} }>
          <g className="left-bottom">
            <mask id="path-46-inside-17_28_439" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.5 145.5H13C13 149.642 16.3579 153 20.5 153V145.5Z"
              />
            </mask>
            <path
              d="M20.5 145.5H25.5V140.5H20.5V145.5ZM13 145.5V140.5H8V145.5H13ZM20.5 153V158H25.5V153H20.5ZM20.5 140.5H13V150.5H20.5V140.5ZM8 145.5C8 152.404 13.5964 158 20.5 158V148C19.1193 148 18 146.881 18 145.5H8ZM25.5 153V145.5H15.5V153H25.5Z"
              fill="#262626"
              mask="url(#path-46-inside-17_28_439)"
            />
          </g>
          <g className="right-bottom">
            <mask id="path-48-inside-18_28_439" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.5 153C24.6421 153 28 149.642 28 145.5H20.5V153Z"
              />
            </mask>
            <path
              d="M20.5 153H15.5V158H20.5V153ZM28 145.5H33V140.5H28V145.5ZM20.5 145.5V140.5H15.5V145.5H20.5ZM20.5 158C27.4036 158 33 152.404 33 145.5H23C23 146.881 21.8807 148 20.5 148V158ZM28 140.5H20.5V150.5H28V140.5ZM15.5 145.5V153H25.5V145.5H15.5Z"
              fill="#707070"
              mask="url(#path-48-inside-18_28_439)"
            />
          </g>
          <g className="right-top">
            <mask id="path-50-inside-19_28_439" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.5 145.5H28C28 141.358 24.6421 138 20.5 138V145.5Z"
              />
            </mask>
            <path
              d="M20.5 145.5H15.5V150.5H20.5V145.5ZM28 145.5V150.5H33V145.5H28ZM20.5 138V133H15.5V138H20.5ZM20.5 150.5H28V140.5H20.5V150.5ZM33 145.5C33 138.596 27.4036 133 20.5 133V143C21.8807 143 23 144.119 23 145.5H33ZM15.5 138V145.5H25.5V138H15.5Z"
              fill="#515151"
              mask="url(#path-50-inside-19_28_439)"
            />
          </g>
          <g className="left-top">
            <mask id="path-52-inside-20_28_439" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.5 138C16.3579 138 13 141.358 13 145.5H20.5V138Z"
              />
            </mask>
            <path
              d="M20.5 138H25.5V133H20.5V138ZM13 145.5H8V150.5H13V145.5ZM20.5 145.5V150.5H25.5V145.5H20.5ZM20.5 133C13.5964 133 8 138.596 8 145.5H18C18 144.119 19.1193 143 20.5 143V133ZM13 150.5H20.5V140.5H13V150.5ZM25.5 145.5V138H15.5V145.5H25.5Z"
              fill="#212121"
              mask="url(#path-52-inside-20_28_439)"
            />
          </g>
          <circle
            className="center"
            cx="20.5"
            cy="145.5"
            r="5"
            fill="#191919"
          />
        </g>
        <g className="IO In-2" onMouseDown={(e) => {StartEndWire(e, id, "7segmentdisplay", 2, "input")} }>
          <g className="left-bottom">
            <mask id="path-55-inside-21_28_439" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.5 120.5H13C13 124.642 16.3579 128 20.5 128V120.5Z"
              />
            </mask>
            <path
              d="M20.5 120.5H25.5V115.5H20.5V120.5ZM13 120.5V115.5H8V120.5H13ZM20.5 128V133H25.5V128H20.5ZM20.5 115.5H13V125.5H20.5V115.5ZM8 120.5C8 127.404 13.5964 133 20.5 133V123C19.1193 123 18 121.881 18 120.5H8ZM25.5 128V120.5H15.5V128H25.5Z"
              fill="#262626"
              mask="url(#path-55-inside-21_28_439)"
            />
          </g>
          <g className="right-bottom">
            <mask id="path-57-inside-22_28_439" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.5 128C24.6421 128 28 124.642 28 120.5H20.5V128Z"
              />
            </mask>
            <path
              d="M20.5 128H15.5V133H20.5V128ZM28 120.5H33V115.5H28V120.5ZM20.5 120.5V115.5H15.5V120.5H20.5ZM20.5 133C27.4036 133 33 127.404 33 120.5H23C23 121.881 21.8807 123 20.5 123V133ZM28 115.5H20.5V125.5H28V115.5ZM15.5 120.5V128H25.5V120.5H15.5Z"
              fill="#707070"
              mask="url(#path-57-inside-22_28_439)"
            />
          </g>
          <g className="right-top">
            <mask id="path-59-inside-23_28_439" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.5 120.5H28C28 116.358 24.6421 113 20.5 113V120.5Z"
              />
            </mask>
            <path
              d="M20.5 120.5H15.5V125.5H20.5V120.5ZM28 120.5V125.5H33V120.5H28ZM20.5 113V108H15.5V113H20.5ZM20.5 125.5H28V115.5H20.5V125.5ZM33 120.5C33 113.596 27.4036 108 20.5 108V118C21.8807 118 23 119.119 23 120.5H33ZM15.5 113V120.5H25.5V113H15.5Z"
              fill="#515151"
              mask="url(#path-59-inside-23_28_439)"
            />
          </g>
          <g className="left-top">
            <mask id="path-61-inside-24_28_439" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.5 113C16.3579 113 13 116.358 13 120.5H20.5V113Z"
              />
            </mask>
            <path
              d="M20.5 113H25.5V108H20.5V113ZM13 120.5H8V125.5H13V120.5ZM20.5 120.5V125.5H25.5V120.5H20.5ZM20.5 108C13.5964 108 8 113.596 8 120.5H18C18 119.119 19.1193 118 20.5 118V108ZM13 125.5H20.5V115.5H13V125.5ZM25.5 120.5V113H15.5V120.5H25.5Z"
              fill="#212121"
              mask="url(#path-61-inside-24_28_439)"
            />
          </g>
          <circle
            className="center"
            cx="20.5"
            cy="120.5"
            r="5"
            fill="#191919"
          />
        </g>
        <g className="IO In-1" onMouseDown={(e) => {StartEndWire(e, id, "7segmentdisplay", 1, "input")} }>
          <g className="left-bottom">
            <mask id="path-64-inside-25_28_439" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.5 95.5H13C13 99.6421 16.3579 103 20.5 103V95.5Z"
              />
            </mask>
            <path
              d="M20.5 95.5H25.5V90.5H20.5V95.5ZM13 95.5V90.5H8V95.5H13ZM20.5 103V108H25.5V103H20.5ZM20.5 90.5H13V100.5H20.5V90.5ZM8 95.5C8 102.404 13.5964 108 20.5 108V98C19.1193 98 18 96.8807 18 95.5H8ZM25.5 103V95.5H15.5V103H25.5Z"
              fill="#262626"
              mask="url(#path-64-inside-25_28_439)"
            />
          </g>
          <g className="right-bottom">
            <mask id="path-66-inside-26_28_439" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.5 103C24.6421 103 28 99.6421 28 95.5H20.5V103Z"
              />
            </mask>
            <path
              d="M20.5 103H15.5V108H20.5V103ZM28 95.5H33V90.5H28V95.5ZM20.5 95.5V90.5H15.5V95.5H20.5ZM20.5 108C27.4036 108 33 102.404 33 95.5H23C23 96.8807 21.8807 98 20.5 98V108ZM28 90.5H20.5V100.5H28V90.5ZM15.5 95.5V103H25.5V95.5H15.5Z"
              fill="#707070"
              mask="url(#path-66-inside-26_28_439)"
            />
          </g>
          <g className="right-top">
            <mask id="path-68-inside-27_28_439" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.5 95.5H28C28 91.3579 24.6421 88 20.5 88V95.5Z"
              />
            </mask>
            <path
              d="M20.5 95.5H15.5V100.5H20.5V95.5ZM28 95.5V100.5H33V95.5H28ZM20.5 88V83H15.5V88H20.5ZM20.5 100.5H28V90.5H20.5V100.5ZM33 95.5C33 88.5964 27.4036 83 20.5 83V93C21.8807 93 23 94.1193 23 95.5H33ZM15.5 88V95.5H25.5V88H15.5Z"
              fill="#515151"
              mask="url(#path-68-inside-27_28_439)"
            />
          </g>
          <g className="left-top">
            <mask id="path-70-inside-28_28_439" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.5 88C16.3579 88 13 91.3579 13 95.5H20.5V88Z"
              />
            </mask>
            <path
              d="M20.5 88H25.5V83H20.5V88ZM13 95.5H8V100.5H13V95.5ZM20.5 95.5V100.5H25.5V95.5H20.5ZM20.5 83C13.5964 83 8 88.5964 8 95.5H18C18 94.1193 19.1193 93 20.5 93V83ZM13 100.5H20.5V90.5H13V100.5ZM25.5 95.5V88H15.5V95.5H25.5Z"
              fill="#212121"
              mask="url(#path-70-inside-28_28_439)"
            />
          </g>
          <circle className="center" cx="20.5" cy="95.5" r="5" fill="#191919" />
        </g>
        <g className="IO In-0" onMouseDown={(e) => {StartEndWire(e, id, "7segmentdisplay", 0, "input")} }>
          <g className="left-bottom">
            <mask id="path-73-inside-29_28_439" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.5 70.5H13C13 74.6421 16.3579 78 20.5 78V70.5Z"
              />
            </mask>
            <path
              d="M20.5 70.5H25.5V65.5H20.5V70.5ZM13 70.5V65.5H8V70.5H13ZM20.5 78V83H25.5V78H20.5ZM20.5 65.5H13V75.5H20.5V65.5ZM8 70.5C8 77.4036 13.5964 83 20.5 83V73C19.1193 73 18 71.8807 18 70.5H8ZM25.5 78V70.5H15.5V78H25.5Z"
              fill="#262626"
              mask="url(#path-73-inside-29_28_439)"
            />
          </g>
          <g className="right-bottom">
            <mask id="path-75-inside-30_28_439" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.5 78C24.6421 78 28 74.6421 28 70.5H20.5V78Z"
              />
            </mask>
            <path
              d="M20.5 78H15.5V83H20.5V78ZM28 70.5H33V65.5H28V70.5ZM20.5 70.5V65.5H15.5V70.5H20.5ZM20.5 83C27.4036 83 33 77.4036 33 70.5H23C23 71.8807 21.8807 73 20.5 73V83ZM28 65.5H20.5V75.5H28V65.5ZM15.5 70.5V78H25.5V70.5H15.5Z"
              fill="#707070"
              mask="url(#path-75-inside-30_28_439)"
            />
          </g>
          <g className="right-top">
            <mask id="path-77-inside-31_28_439" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.5 70.5H28C28 66.3579 24.6421 63 20.5 63V70.5Z"
              />
            </mask>
            <path
              d="M20.5 70.5H15.5V75.5H20.5V70.5ZM28 70.5V75.5H33V70.5H28ZM20.5 63V58H15.5V63H20.5ZM20.5 75.5H28V65.5H20.5V75.5ZM33 70.5C33 63.5964 27.4036 58 20.5 58V68C21.8807 68 23 69.1193 23 70.5H33ZM15.5 63V70.5H25.5V63H15.5Z"
              fill="#515151"
              mask="url(#path-77-inside-31_28_439)"
            />
          </g>
          <g className="left-top">
            <mask id="path-79-inside-32_28_439" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.5 63C16.3579 63 13 66.3579 13 70.5H20.5V63Z"
              />
            </mask>
            <path
              d="M20.5 63H25.5V58H20.5V63ZM13 70.5H8V75.5H13V70.5ZM20.5 70.5V75.5H25.5V70.5H20.5ZM20.5 58C13.5964 58 8 63.5964 8 70.5H18C18 69.1193 19.1193 68 20.5 68V58ZM13 75.5H20.5V65.5H13V75.5ZM25.5 70.5V63H15.5V70.5H25.5Z"
              fill="#212121"
              mask="url(#path-79-inside-32_28_439)"
            />
          </g>
          <circle className="center" cx="20.5" cy="70.5" r="5" fill="#191919" />
        </g>
        </g>
      </g>
  );
});

export default SevenSegmentDisplay;
