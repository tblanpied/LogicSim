import "../css/sidebar.css";
import React from 'react';
import {ReactComponent as ArrowLeft} from '../svg/simple-arrow-left.svg';
import ComponentPicker from "./component_picker";
import ComponentPickerGroup from "./component_picker_group";
import ComponentPickerSearch from "./component_picker_search";

class SideBar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            open: true,
            styles_sidebar: {
                left: 0
            },
            styles_btn: {
                transform: "scaleX(1)"
            }
        };

        this._click = this._click.bind(this);
    }

    _click(){
        if(this.state.open){
            this.setState({
                open: false,
                styles_sidebar: {
                    left: "-265px"
                },
                styles_btn: {
                    transform: "scaleX(-1)"
                }
            });
        }
        else{
            this.setState({
                open: true,
                styles_sidebar: {
                    left: "0px"
                },
                styles_btn: {
                    transform: "scaleX(1)"
                }
            });
        }
    }

    render(){
        return(
            <div style={this.state.styles_sidebar} className="sidebar">
                <ComponentPickerGroup></ComponentPickerGroup>
                <ComponentPickerSearch></ComponentPickerSearch>
                <ComponentPicker></ComponentPicker>
                <button onClick={this._click} className="open_close_sidebar_btn">
                    <ArrowLeft style={this.state.styles_btn}></ArrowLeft>
                </button>
            </div>
        );
    }
}

export default SideBar;