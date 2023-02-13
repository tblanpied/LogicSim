import "../css/toolbar.css";
import React from 'react';
import {ReactComponent as Undo} from '../svg/undo.svg';
import {ReactComponent as Redo} from '../svg/redo.svg';

class ToolBar extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="toolbar">
                <Undo className="undo-icon toolbar_active_btn"></Undo>
                <Redo className="redo-icon toolbar_borderright"></Redo>
            </div>
        );
    }
}

export default ToolBar;