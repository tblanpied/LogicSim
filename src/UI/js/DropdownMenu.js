import "../css/dropdown_menu.css";
import React, { useState, useEffect, useRef, useCallback } from "react";

const DropdownMenu = React.memo((props) => {
    // Destructure props and set initial state using useState
    const {
        items,
        name
    } = props;

    const [state, setState] = useState({
        items,
        visible: false,
        is_transitioning: false,
        name
    });

    const dropdownRef = useRef(null);
    const menuRef = useRef(null);

    const stateRef = useRef(state);
    stateRef.current = state;

    const toggleDropdown= (e) => {
        setState((prevStates) => ({
            ...prevStates,
            visible: !prevStates.visible,
            is_transitioning: true
        }));
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setState((prevStates) => ({
                ...prevStates,
                visible: false,
                is_transitioning: prevStates.visible?true:false
            }));
        }
    };

    const handleTransitionEnd = () => {
        setState((prevStates) => ({
            ...prevStates,
            is_transitioning: false
        }));
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
          document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    return (
        <div className="dropdown-menu" ref={dropdownRef} onClick={toggleDropdown}>
            <div className="dropdown-name">
                {state.name}
            </div>
            <div className={"menu"} ref={menuRef} onTransitionEnd={handleTransitionEnd} style={{height: (state.visible?menuRef.current.scrollHeight:0), opacity:(state.visible ? 1 : state.is_transitioning ? 1 : 0)}}>
                {state.items.map((item, index) => (
                    <div key={index} className="menu-item">{item}</div>
                ))}
            </div>
        </div>
    );
});

export default DropdownMenu;