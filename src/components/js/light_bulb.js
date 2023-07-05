import "../css/light_bulb.css";
import React, { useState, useEffect, useRef, useCallback } from "react";

const LightBulb = React.memo((props) => {
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
        offset,
        onClick,
        setCoord,
        onStateChange,
        id,
        StartEndWire,
        input
    } = props;

    const [state, setState] = useState({
        new_component,
        dragging,
        position: {
            x: parseInt(x),
            y: parseInt(y),
        },
        diffX: 46 * zoom,
        diffY: 95 * zoom,
        selected,
        opacity,
        rotation: rotation !== undefined ? rotation : 0,
        zoom,
        offset,
        input
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
                if(stateRef.current.rotation == 0){
                    diff = {x: e.pageX - rect.left, y: e.pageY - rect.top};
                } else if(stateRef.current.rotation == 90){
                    diff = {x: e.pageX - rect.right, y: e.pageY - rect.top};
                } else if(stateRef.current.rotation == 180){
                    diff = {x: e.pageX - rect.right, y: e.pageY - rect.bottom};
                } else if(stateRef.current.rotation == 270){
                    diff = {x: e.pageX - rect.left, y: e.pageY - rect.bottom};
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
        if (input !== state.input) {
            setState((prevState) => ({
                ...prevState,
                input: input
            }));
        }
        if(rotation !== undefined && rotation !== state.rotation){
            setState((prevState) => ({
              ...prevState,
              rotation: rotation
            }));
        }
        // eslint-disable-next-line
    }, [selected, zoom, offset, input, rotation]);

    return (
        <g
            opacity={state.opacity}
            onMouseDown={dragStart}
            className={"Component-lightbulb-" + id}
            transform={`translate(${state.position.x},${state.position.y}) rotate(${state.rotation})`}
            width="92"
            height="186"
            viewBox="0 0 92 186"
            fill="none"
        >
            <g className="LightBulb">
                <rect className="Rectangle 5" strokeWidth={state.selected ? 3 : 0} stroke="#0A9DFF" x="41" y="143.154" width="10" height="35" rx="5" fill="black" />
                <path className="light" filter="drop-shadow(0px 0px 6px #FFEF27)" opacity={state.input ? 0.6 : 0} d="M46 114.585C43.6056 114.585 22.5963 114.415 22.3955 108.529C22.3646 107.737 22.4573 106.758 22.5654 105.609C22.9053 101.913 23.3687 96.8348 20.7425 92.1759C20.0165 90.8869 18.7497 89.1476 17.1432 86.9578C11.103 78.6804 1 64.8433 1 48.2419C1 36.7808 4.90834 25.3042 11.7209 16.7628C17.4521 9.57248 28.0649 1 46 1C63.9351 1 74.5479 9.57248 80.2791 16.7628C87.0917 25.3042 91 36.7808 91 48.2419C91 64.8433 80.897 78.6804 74.8568 86.9578C73.2657 89.1476 71.999 90.8714 71.2575 92.1759C68.6313 96.8348 69.0947 101.913 69.4346 105.609C69.5427 106.758 69.6354 107.737 69.6045 108.529C69.4037 114.415 48.3944 114.585 46 114.585Z" fill="#FFEF27" />
                <path className="Vector" d="M27 49L38.8433 82.702L40 114" stroke="#696969" strokeMiterlimit="10" />
                <path className="Vector_2" d="M63.6107 49.6432L52.155 82.7018L50.9983 114.5" stroke="#696969" strokeMiterlimit="10" />
                <path className="filament" fill={state.input ? "#FFFFFF" : "#696969"} fillRule="evenodd" clipRule="evenodd" d="M28.8118 48.6924C28.335 48.1898 27.8553 47.8381 27.2599 48.0888C26.6556 48.3433 26.3379 49.1201 26.6114 49.601C26.9188 50.216 32.9748 55.3417 33.7602 55.3417C34.5457 55.3417 36.902 50.5431 37.6874 49.8948C38.8241 50.5431 39.1739 55.19 40.8292 55.3417C42.8219 55.5244 43.6127 51.1688 44.7393 49.7585C46.1743 49.8209 47.8982 55.3417 49.469 55.3417C51.0399 55.3417 52.8056 50.5871 53.5911 49.7585C54.3765 50.5871 55.6763 55.4419 56.9025 55.3417C57.5158 55.2916 61.9585 51.857 61.9585 51.857C62.3569 51.525 62.682 51.2847 62.9844 50.9823L63.6647 50.3451C63.8197 50.134 64.2975 49.8434 64.4314 49.4269C64.4314 49.0277 64.4314 48.6713 64.2695 48.4553L63.8502 48.0666L63.0492 47.991C62.7297 48.0666 62.304 48.5849 62.1421 48.7469C61.906 48.9829 57.2465 53.972 56.9025 54.0001C56.5586 54.0282 54.9081 48.165 53.3822 48.098C52.7447 48.299 51.0399 52.8559 49.469 53.6845C48.1011 53.5972 46.3101 48.1007 44.7393 48.1007C43.1684 48.1007 42.4001 53.6845 40.8292 53.6845C40.0438 52.8559 39.2383 48.0888 37.6874 48.0888C36.3859 48.0888 34.5457 52.8559 33.7602 53.6845C32.9748 52.8559 28.8118 48.6924 28.8118 48.6924Z" />
                <path className="bulb" strokeWidth={state.selected ? 3 : 0} stroke="#0A9DFF" d="M46 1.56461C77.003 1.56461 90.4475 27.5371 90.4475 48.3777C90.4475 69.2182 74.3172 85.8344 70.7155 92.2493C67.1137 98.6641 69.0543 105.908 68.9457 109.084C68.8215 112.652 57.4107 114.435 46 114.435C34.5893 114.435 23.1785 112.652 23.0543 109.084C22.9457 105.924 24.8863 98.6798 21.2845 92.2493C17.6828 85.8344 1.55248 69.2182 1.55248 48.3777C1.55248 27.5371 14.997 1.56461 46 1.56461ZM46 0C27.6652 0 16.8134 8.79309 10.945 16.178C3.98987 24.9242 0 36.6588 0 48.3777C0 65.3537 10.2464 79.4351 16.3787 87.8527C17.9001 89.9493 19.2352 91.7642 19.9338 93.0316C22.4489 97.522 21.9986 102.482 21.6726 106.112C21.564 107.285 21.4708 108.302 21.5019 109.147C21.7192 115.515 40.3024 116 46 116C51.6976 116 70.2808 115.499 70.4981 109.147C70.5292 108.302 70.436 107.285 70.3274 106.112C70.0013 102.482 69.5511 97.522 72.0661 93.0316C72.7803 91.7642 74.0999 89.9493 75.6213 87.8527C81.7536 79.4351 92 65.3693 92 48.3777C92 36.6588 88.0101 24.9242 81.055 16.178C75.1866 8.80873 64.3348 0 46 0Z" fill="#696969" />
                <path className="base" strokeWidth={state.selected ? 3 : 0} stroke="#0A9DFF" d="M19 111.511V130.048L19.0391 131.044L19.1328 132.048L19.293 133.044L19.5234 134.055L19.8125 135.055L20.1836 136.048L20.6445 137.044L21.1875 138.048L21.8203 139.048L22.5742 140.044L23.457 141.055L24.4688 142.055L25.6484 143.059L27.0078 144.04L28.0049 144.674L28.6924 145.057L30.0114 145.737L30.9946 146.193L32.0019 146.608L32.9932 146.976L34.0052 147.311L34.9971 147.608L35.9939 147.871L37 148.11L37.9984 148.307L38.9996 148.49L40.0007 148.653L40.9893 148.76L42 148.88L43 148.954L44 149.005L44.9961 149.036H47.0039L48 149.005L49 148.954L50 148.88L51.0107 148.76L51.9993 148.653L53.0004 148.49L54.0016 148.307L55 148.11L56.0061 147.871L57.0029 147.608L57.9948 147.311L59.0068 146.976L59.9981 146.608L61.0054 146.193L61.9886 145.737L63.3076 145.057L63.9951 144.674L64.9922 144.04L66.3516 143.059L67.5312 142.055L68.543 141.055L69.4258 140.044L70.1797 139.048L70.8125 138.048L71.3555 137.044L71.8164 136.048L72.1875 135.055L72.4766 134.055L72.707 133.044L72.8672 132.048L72.9609 131.044L73 130.048V111.509L72.9688 111.196L72.9414 111.048L72.8984 110.868L72.8516 110.72L72.8047 110.591L72.7383 110.442L72.6562 110.298L72.5742 110.157L72.4492 109.989L72.3125 109.829L72.1992 109.716L72.0781 109.61L71.9453 109.509L71.793 109.407L71.6836 109.345L71.5547 109.278L71.4375 109.231L71.2891 109.173L71.1445 109.13L70.9766 109.091L70.8125 109.071L70.5553 109.052H21.4449L21.1878 109.071L21.0237 109.091L20.8557 109.13L20.7112 109.173L20.5628 109.231L20.4456 109.278L20.3167 109.345L20.2073 109.407L20.055 109.509L19.9221 109.61L19.8011 109.716L19.6878 109.829L19.5511 109.989L19.4261 110.157L19.344 110.298L19.262 110.442L19.1956 110.591L19.1487 110.72L19.1018 110.868L19.0589 111.048L19.0315 111.196L19 111.511Z" fill="black" />
                <circle className="IO In-0" onMouseDown={(e) => { StartEndWire(e, id, "lightbulb", 0, "input") }} cx="46" cy="172.998" r="11" fill="#FF0000" stroke="black" strokeWidth="4" />
            </g>
        </g>
    );
});

export default LightBulb;