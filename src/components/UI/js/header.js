import "../css/header.css";
import React, { useContext } from 'react';
import ReactSwitch from "react-switch";
import { ThemeContext } from "../../../App";
import {ReactComponent as SunLogo} from '../svg/sun.svg';
import {ReactComponent as MoonLogo} from '../svg/moon.svg';

function Header(){
        const context = useContext(ThemeContext);
        return(
            <div className="App-header">
                <ReactSwitch onChange={context.toggleTheme} checked={context.theme === "dark"} height={20} width={48} onHandleColor="#888" onColor="#fff" activeBoxShadow="0 0 0px 0px #aaa" uncheckedIcon={<SunLogo style={{padding:"2px 0px 0px 0px", fill: "white"}} height="80%"></SunLogo>} checkedIcon={<MoonLogo style={{padding:"2px 0px 0px 7px", fill: "#888"}} height="80%"></MoonLogo>} className="react-switch"/>
            </div>
        );
    

}

export default Header;