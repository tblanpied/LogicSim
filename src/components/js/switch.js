import "../css/switch.css";
import React, { useState, useEffect, useRef, useCallback } from "react";

const Switch = React.memo((props) => {
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
        StartEndWire
    } = props;

    const [state, setState] = useState({
        active,
        new_component,
        dragging,
        position: {
            x: parseInt(x),
            y: parseInt(y),
        },
        diffX: 37 * zoom,
        diffY: 40 * zoom,
        selected,
        opacity,
        rotation,
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
                start_position.current.x = e.pageX;
                start_position.current.y = e.pageY;
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
        e.stopPropagation();
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
        e.stopPropagation();
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
        // eslint-disable-next-line
    }, [selected, zoom, offset]);

    const toggleSwitch = useCallback((e) => {
        if (!stateRef.current.new_component) {
            e.stopPropagation();
            onStateChange(id, !stateRef.current.active, 0);
            setState((prevState) => ({
                ...prevState,
                active: !(prevState.active)
            }));
        }
        // eslint-disable-next-line
    }, []);

    return (
        <g
            opacity={state.opacity}
            onMouseDown={dragStart}
            className={"Component-switch-" + id}
            transform={`translate(${state.position.x},${state.position.y}) rotate(${state.rotation})`}
            width="213"
            height="80"
            viewBox="0 0 213 80"
            fill="none"
        >
            <g className="Switch">
                <path className={`select-border ${state.selected ? "" : "display-none"}`} d="M35.5 0C15.8939 0 0 15.8939 0 35.5C0 55.1061 15.8939 71 35.5 71H114.5C131.176 71 145.167 59.5013 148.976 44H171C175.418 44 179 40.4183 179 36C179 31.5817 175.418 28 171 28H149.206C145.764 11.9958 131.533 0 114.5 0H35.5Z" fill="#0A9DFF" />
                <rect className="Rectangle 11" x="141" y="31" width="35" height="10" rx="5" fill="black" />
                <rect className="Body" x="5.5" y="5.5" width="139" height="60" rx="30" fill={state.active ? "#1E701C" : "#AA2424"} stroke="black" strokeWidth="5" />
                <circle className="Button" onMouseDown={toggleSwitch}  cx={state.active ? "114.5" : "35.5"} cy="35.5" r="21" fill="#D2D2D2" stroke="#A4A4A4" strokeWidth="5" />
                <circle className="IO Out-0" onMouseDown={(e) => { StartEndWire(e, id, "switch", 0, "output") }} cx="171.5" cy="35.5" r="11.5" fill="#FF0000" stroke="black" strokeWidth="4" />
            </g>
        </g>
    );
});

export default Switch;