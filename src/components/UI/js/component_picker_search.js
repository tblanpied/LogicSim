import "../css/component_picker_search.css";
import React from 'react';
import {ReactComponent as SearchLogo} from '../svg/search.svg';

class ComponentPickerSearch extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="component_picker_search">
                <form acceptCharset="UTF-8" className="component_search_form" method="get">
                    <input className="component_search_input" type="text" placeholder="Search"></input>
                    <button className="component_search_btn" type="submit">
                        <SearchLogo className="component_search_logo"></SearchLogo>
                    </button>
                </form>
            </div>
        );
    }
}

export default ComponentPickerSearch;