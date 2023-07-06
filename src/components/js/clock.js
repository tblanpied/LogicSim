import "../css/clock.css";
import React, { useState, useEffect, useRef, useCallback } from "react";

const Clock = React.memo((props) => {
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
        diffX: 95 * zoom,
        diffY: 58 * zoom,
        selected,
        opacity,
        rotation: rotation !== undefined ? rotation : 0,
        zoom,
        offset,
        input_hovered: "",
        period: 1000,
        signal_offset: (active?0:-10)
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
        if (stateRef.current.dragging && (start_position.current.x !== e.pageX || start_position.current.y !== e.pageY) && stateRef.current.selected || stateRef.current.new_component) {
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

    useEffect(() => {
        const interval = setInterval(() => {
            onStateChange(id, !stateRef.current.active, 0);
            setState((prevState) => ({
                ...prevState,
                active: !prevState.active,
                signal_offset: (!prevState.active?0:-10)
            }));
        }, state.period/2);

        const interval_animation = setInterval(() => {
            setState((prevState) => ({
                ...prevState,
                signal_offset: prevState.signal_offset-1
            }));
        }, state.period/20.0);
    
        return () => {clearInterval(interval); clearInterval(interval_animation);} 
      }, [props.period]); // Run effect whenever the frequency changes

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
        <g
            opacity={state.opacity}
            onMouseDown={dragStart}
            className={"Component-clock-" + id}
            transform={`translate(${state.position.x},${state.position.y}) rotate(${state.rotation})`}
            width="191"
            height="116"
            viewBox="0 0 191 116"
            fill="none"
        >
            <g className="Clock">
                <path className={`select-border ${state.selected ? "" : "display-none"}`} d="M18 0C8.05888 0 0 8.05888 0 18V98C0 107.941 8.05888 116 18 116H138C147.941 116 156 107.941 156 98V66H177C181.418 66 185 62.4183 185 58C185 53.5817 181.418 50 177 50H156V18C156 8.05888 147.941 0 138 0H18Z" fill="#0A9DFF"/>
                <rect className="Rectangle 3" x="18" y="45" width="120" height="55" fill="#121212"/>
                <path className="signal" transform={`translate(${state.signal_offset}, 0)`} d="M39 54V92H28V53H29V91H38V53H49V91H58V53H69V91H78V53H89V91H98V53H109V91H118V53H129V91H138V53H149V92H148V54H139V92H128V54H119V92H108V54H99V92H88V54H79V92H68V54H59V92H48V54H39Z" fill="#0D24F2"/>
                <path className="border" fillRule="evenodd" clipRule="evenodd" d="M138 3H18C9.71573 3 3 9.71572 3 18V98C3 106.284 9.71573 113 18 113H138C146.284 113 153 106.284 153 98V63H177C179.761 63 182 60.7614 182 58C182 55.2386 179.761 53 177 53H153V18C153 9.71573 146.284 3 138 3ZM10 18C10 13.5817 13.5817 10 18 10H138C142.418 10 146 13.5817 146 18V98C146 102.418 142.418 106 138 106H18C13.5817 106 10 102.418 10 98V18Z" fill="black"/>
                <g>
                    <circle className="IO Out-0" onMouseEnter={(e) => {handleHover(e, "Out-0")}} onMouseLeave={handleMouseLeave} onMouseDown={(e) => { StartEndWire(e, id, "clock", 0, "output") }} cx="177.5" cy="57.5" r="11.5" fill="#FF0000" stroke="black" strokeWidth="4" />
                    {state.input_hovered === "Out-0" && (
                    <g>
                        <rect x="205" y="46" width="70" height="23" fill="rgba(0, 0, 0, 0.6)" />
                        <text x="207" y="63"  fontWeight="700" letterSpacing="-2px" fontFamily='"Lucida Console", Monaco, monospace' fontSize="1.3em" fill="rgba(255, 255, 255)" className="input-name">output</text>
                    </g>
                    )}
                </g>
                <line className="Line" x1="78.5" y1="45" x2="78.5" y2="100" stroke="#AD1111"/>
                <path className="Body" fillRule="evenodd" clipRule="evenodd" d="M18 8C12.4772 8 8 12.4772 8 18V98C8 103.523 12.4772 108 18 108H138C143.523 108 148 103.523 148 98V18C148 12.4772 143.523 8 138 8H18ZM33 48C30.2386 48 28 50.2386 28 53V92C28 94.7614 30.2386 97 33 97H123C125.761 97 128 94.7614 128 92V53C128 50.2386 125.761 48 123 48H33Z" fill="#2CC73B"/>
                <path className="CLK" d="M62.752 17.312C64.3093 17.312 65.6747 17.536 66.848 17.984C68.0427 18.4107 68.64 18.9973 68.64 19.744C68.64 20.4907 68.352 21.4187 67.776 22.528C67.2213 23.616 66.752 24.16 66.368 24.16C66.2613 24.16 66.1333 24.1067 65.984 24C65.856 23.872 65.536 23.744 65.024 23.616C64.5333 23.4667 64.1067 23.392 63.744 23.392C62.5067 23.392 61.504 23.8293 60.736 24.704C59.9893 25.5787 59.616 26.9227 59.616 28.736C59.616 30.528 60 31.8613 60.768 32.736C61.5573 33.6107 62.5493 34.048 63.744 34.048C64.2347 34.048 64.7787 33.984 65.376 33.856C65.9947 33.7067 66.432 33.504 66.688 33.248C66.7307 33.2053 66.816 33.184 66.944 33.184C67.072 33.184 67.3067 33.4293 67.648 33.92C68.0107 34.3893 68.3413 35.0187 68.64 35.808C68.9387 36.576 69.088 37.1733 69.088 37.6C69.088 38.432 68.448 39.0933 67.168 39.584C65.888 40.0747 64.3733 40.32 62.624 40.32C59.808 40.32 57.4933 39.328 55.68 37.344C53.8667 35.36 52.96 32.5653 52.96 28.96C52.96 25.3333 53.888 22.4853 55.744 20.416C57.6213 18.3467 59.9573 17.312 62.752 17.312ZM71.2175 38.112V18.208C71.2175 17.76 72.2948 17.536 74.4495 17.536C76.6255 17.536 77.7135 17.76 77.7135 18.208V33.888H82.6415C83.0255 33.888 83.2922 34.3893 83.4415 35.392C83.5055 35.8827 83.5375 36.384 83.5375 36.896C83.5375 37.408 83.5055 37.9307 83.4415 38.464C83.2708 39.488 82.9935 40 82.6095 40H72.7535C72.2842 40 71.9108 39.808 71.6335 39.424C71.3562 39.04 71.2175 38.6027 71.2175 38.112ZM91.8438 39.552C91.8438 39.872 90.8411 40.032 88.8358 40.032L87.0438 39.936C85.9771 39.8507 85.4438 39.7013 85.4438 39.488V18.016C85.4438 17.6533 86.5104 17.472 88.6438 17.472C90.7771 17.472 91.8438 17.6533 91.8438 18.016V26.208L95.7478 18.016C95.8971 17.7173 96.7504 17.568 98.3078 17.568C101.145 17.568 102.638 17.8133 102.788 18.304C102.788 18.3467 102.777 18.3893 102.756 18.432L97.1878 28.48L103.652 37.408C103.652 37.4507 103.449 37.632 103.044 37.952C102.062 38.8053 100.91 39.4773 99.5878 39.968C99.1824 40.1173 98.7771 40.192 98.3718 40.192L97.6038 40.128C96.9211 39.9573 96.3878 39.52 96.0038 38.816L92.3558 31.84H91.8438V39.552Z" fill="black"/>
            </g>
        </g >
    );
});

export default Clock;