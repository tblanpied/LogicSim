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
        diffX: 64 * zoom,
        diffY: 55 * zoom,
        selected,
        opacity,
        rotation: rotation !== undefined ? rotation : 0,
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
        if (rotation !== undefined && rotation !== state.rotation) {
            setState((prevState) => ({
                ...prevState,
                rotation: rotation
            }));
        }
        // eslint-disable-next-line
    }, [selected, zoom, offset, rotation]);

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
                <path className={`select-border ${state.selected ? "" : "display-none"}`} d="M13 0C5.8203 0 0 5.8203 0 13V103C0 110.18 5.8203 116 13 116H83C90.1797 116 96 110.18 96 103V66H117C121.418 66 125 62.4183 125 58C125 53.5817 121.418 50 117 50H96V13C96 5.8203 90.1797 0 83 0H13Z" fill="#0A9DFF" />
                <rect className="Output-rectangle" x="87" y="53" width="35" height="10" rx="5" fill="black" />
                <circle className="IO Out-0" onMouseDown={(e) => { StartEndWire(e, id, "switch", 0, "output") }} cx="117.5" cy="57.5" r="11.5" fill="#FF0000" stroke="black" strokeWidth="4" />
                <rect className="Body-exter" x="5.5" y="5.5" width="85" height="105" rx="7.5" fill="#FFC806" stroke="black" strokeWidth="5" />
                <rect className="Body-inter" x="20.5" y="20.5" width="55" height="75" rx="7.5" fill={state.active?"#2BCE3B":"#D52B2B"} stroke="black" strokeWidth="5" />
                <path className={"Button-side-top" + (state.active?" display-none":"")} onMouseDown={toggleSwitch} d="M28.372 26.5L25.672 35.5H70.328L67.628 26.5H28.372Z" fill="#B3B3B3" stroke="black" />
                <path className={"Button-side-bottom" + (state.active?"":" display-none")} onMouseDown={toggleSwitch} d="M28.372 89.5L25.672 80.5H70.328L67.628 89.5H28.372Z" fill="#B3B3B3" stroke="black" />
                <path className="Button-top-top" onMouseDown={toggleSwitch} d={"M28.4365 57.5L" + (state.active?"28.4364":"25.5728") + (state.active?" 26.5":" 36.5") + "H" + (state.active?"67.5636":"70.4272") + "L67.5636 57.5H28.4365Z"} fill="#E8E8E8" stroke="black" />
                <path className="Button-top-bottom" onMouseDown={toggleSwitch} d={"M28.4364 58.5L" + (state.active?"25.5728":"28.4364") + (state.active?" 79.5": " 89.5") + "H" + (state.active?"70.4272":"67.5636") + "L67.5636 58.5H28.4364Z"} fill="#E8E8E8" stroke="black" />
            </g>
        </g >
    );
});

export default Switch;