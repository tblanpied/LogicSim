import "../css/toolbar.css";
import React from 'react';
import {ReactComponent as Undo} from '../svg/undo.svg';
import {ReactComponent as Redo} from '../svg/redo.svg';
import {ReactComponent as Copy} from '../svg/copy.svg';
import {ReactComponent as Paste} from '../svg/paste.svg';
import {ReactComponent as Delete} from '../svg/delete.svg';
import {ReactComponent as RotateLeft} from '../svg/rotate-left.svg';
import {ReactComponent as RotateRight} from '../svg/rotate-right.svg';
import {ReactComponent as FlipHorizontal} from '../svg/flip-horizontal.svg';
import {ReactComponent as FlipVertical} from '../svg/flip-vertical.svg';
import {ReactComponent as ZoomIn} from '../svg/zoom-in.svg';
import {ReactComponent as ZoomOut} from '../svg/zoom-out.svg';
import {ReactComponent as Select} from '../svg/select.svg';
import {ReactComponent as SelectArea} from '../svg/select-area.svg';
import {ReactComponent as MoveHand} from '../svg/move-hand.svg';
import {ReactComponent as AnnotAdd} from '../svg/annot-add.svg';
import {ReactComponent as AnnotVisibility} from '../svg/annot-visibility.svg';

class ToolBar extends React.Component{

    render(){
        return(
            <div className="toolbar">
                <Undo className="toolbar-icon toolbar_active_btn"></Undo>
                <Redo className="toolbar-icon toolbar_borderright"></Redo>
                <Copy className="toolbar-icon"></Copy>
                <Paste className="toolbar-icon"></Paste>
                <Delete className="toolbar-icon delete-btn"></Delete>
                <RotateLeft className="toolbar-icon toolbar_borderleft"></RotateLeft>
                <RotateRight className="toolbar-icon toolbar_borderright"></RotateRight>
                <FlipHorizontal className="toolbar-icon"></FlipHorizontal>
                <FlipVertical className="toolbar-icon"></FlipVertical>
                <ZoomIn className="toolbar-icon toolbar_borderleft zoomin-btn toolbar_active_btn"></ZoomIn>
                <ZoomOut className="toolbar-icon toolbar_borderright zoomout-btn toolbar_active_btn"></ZoomOut>
                <Select className="toolbar-icon"></Select>
                <SelectArea className="toolbar-icon toolbar_active_btn"></SelectArea>
                <MoveHand className="toolbar-icon toolbar_active_btn"></MoveHand>
                <AnnotAdd className="toolbar-icon toolbar_borderleft toolbar_active_btn"></AnnotAdd>
                <AnnotVisibility className="toolbar-icon toolbar_borderright toolbar_active_btn"></AnnotVisibility>
            </div>
        );
    }
}

export default ToolBar;