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
                <rect className="Rectangle 9"  x="169" y="35" width="35" height="10" rx="5" fill={state.selected ? "#0A9DFF" :"black"} />
                <rect className="Body" x="2.5" y="2.5" width="170" height="75" rx="37.5" fill={state.active ? "#1E701C" : "#AA2424"} stroke={state.selected ? "#0A9DFF" :"black"} strokeWidth="5" />
                <circle className="Ellipse 9" onMouseDown={toggleSwitch} cx={state.active ? "135" : "40"} cy="40" r="27.5" fill="#C9C9C9" stroke="#979797" strokeWidth="5" />
                <circle className="IO Out-0" onMouseDown={(e) => { StartEndWire(e, id, "switch", 0, "output") }} cx="199.5" cy="39.5" r="11.5" fill="#FF0000" stroke="black" strokeWidth="4"/>
            </g>
        </g>
    );
});

export default Switch;