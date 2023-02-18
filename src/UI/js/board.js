import "../css/board.css";
import React from "react";
import SevenSegmentDisplay from "../../components/js/seven_segment_display";
import Wire from "../../components/js/wire";

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      points: props.points
    };
    
  }
  
  render(){
    return(
        <div className="board">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <g>
                <SevenSegmentDisplay x="350" y="150" segments={{a:true,b:true,c:true,d:true,e:false,f:false,g:true,h:true}}></SevenSegmentDisplay>
                <Wire strokeBorder={3} strokeWidth={5} strokeColor="#00ff00" points={[{x:100,y:150}, {x:150,y:300}, {x:200,y:150}, {x:400,y:150}, {x:400,y:500}]}></Wire>
                </g>
            </svg>
        </div>
    );
  }

}
 
export default Board;