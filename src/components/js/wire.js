import "../css/wire.css";
import React from "react";

class Wire extends React.Component {
  constructor(props) {
    super(props);

    this.strokeWidth = props.strokeWidth == undefined ? 1 : props.strokeWidth;
    this.strokeColor =
      props.strokeColor == undefined ? "#000000" : props.strokeColor;
    this.strokeBorder =
      props.strokeBorder == undefined ? 0 : props.strokeBorder;

    this.state = {
      points: props.points,
      dragging: false
    };

    this._dragStart = this._dragStart.bind(this);
    this._dragging = this._dragging.bind(this);
    this._dragEnd = this._dragEnd.bind(this);
  }

  LightenDarkenColor(col, amt) {
    var usePound = false;
    if (col[0] == "#") {
      col = col.slice(1);
      usePound = true;
    }

    var num = parseInt(col, 16);

    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    var b = ((num >> 8) & 0x00ff) + amt;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    var g = (num & 0x0000ff) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    const res = (g | (b << 8) | (r << 16)).toString(16);
    return (usePound ? "#" : "") + "0".repeat(6 - res.length) + res;
  }

  _dragStart(e) {
    this.setState({
      dragging: true
    });
  }

  _dragging(e, i) {
    if (this.state.dragging) {
      let points = [...this.state.points];
      let point = {...points[i]};
      point.x = e.pageX;
      point.y = e.pageY;
      points[i] = point;
      this.setState({
        points: points
      });
    }
  }

  _dragEnd() {
    this.setState({
      dragging: false
    });
  }

  render() {
    const angle = (A, B, C) =>
        ((Math.atan2(C.y - B.y, C.x - B.x) -
          Math.atan2(A.y - B.y, A.x - B.x) +
          3 * Math.PI) %
          (2 * Math.PI)) -
        Math.PI;

    var data = "";
    var points = [];
    var key = 0;
    var radius = 20;
    data += "M" + this.state.points[0].x + "," + this.state.points[0].y;
    points.push(<g onMouseDown={this._dragStart} onMouseMove={(e) => {this._dragging(e, 0);}} onMouseUp={this._dragEnd} key={key++}><circle key={key++} fill={this.strokeColor} stroke={this.LightenDarkenColor(this.strokeColor, -50)} strokeWidth={2} cx={this.state.points[0].x} cy={this.state.points[0].y} r={7}/><circle key={key++} fill={this.LightenDarkenColor(this.strokeColor, -50)} cx={this.state.points[0].x} cy={this.state.points[0].y} r={3}/></g>);
    for (let i = 1; i < this.state.points.length - 1; i++) {
      var dxa = this.state.points[i].x - this.state.points[i - 1].x;
      var dya = this.state.points[i].y - this.state.points[i - 1].y;
      var dxb = this.state.points[i + 1].x - this.state.points[i].x;
      var dyb = this.state.points[i + 1].y - this.state.points[i].y;
      var va = {
        x: dxa / Math.sqrt(Math.pow(dxa, 2) + Math.pow(dya, 2)),
        y: dya / Math.sqrt(Math.pow(dxa, 2) + Math.pow(dya, 2)),
      };
      var vb = {
        x: dxb / Math.sqrt(Math.pow(dxb, 2) + Math.pow(dyb, 2)),
        y: dyb / Math.sqrt(Math.pow(dxb, 2) + Math.pow(dyb, 2)),
      };
      var angleBetweenLines = Math.acos((-va.x)*vb.x + (-va.y)*vb.y);
      console.log(angleBetweenLines);
      var r = radius/Math.tan((angleBetweenLines)/2);
      var ka = {
        x: this.state.points[i - 1].x + (dxa - va.x * r),
        y: this.state.points[i - 1].y + (dya - va.y * r),
      };
      var kb = {
        x: this.state.points[i].x + vb.x * r,
        y: this.state.points[i].y + vb.y * r,
      };
      var c = { x: ka.x + (ka.x - kb.x) / 2, y: ka.y + (ka.y - kb.y) / 2 };

      data += " L" + ka.x + "," + ka.y;
      data += " A" + radius  + " " + radius  + " " + 0 + " " + 0 + " " + (angle(kb, ka, this.state.points[i]) > 0 ? 0 : 1) + " " + kb.x + "," + kb.y;

      points.push(<g onMouseDown={this._dragStart} onMouseMove={(e) => {this._dragging(e, i);}} onMouseUp={this._dragEnd} key={key++}><circle key={key++} fill={this.strokeColor} stroke={this.LightenDarkenColor(this.strokeColor, -50)} strokeWidth={2} cx={this.state.points[i].x} cy={this.state.points[i].y} r={7}/><circle key={key++} fill={this.LightenDarkenColor(this.strokeColor, -50)} cx={this.state.points[i].x} cy={this.state.points[i].y} r={3}/></g>);
    }
    data += " L" + this.state.points[this.state.points.length - 1].x + "," + this.state.points[this.state.points.length - 1].y;
    points.push(<g onMouseDown={this._dragStart} onMouseMove={(e) => {this._dragging(e, this.state.points.length - 1);}} onMouseUp={this._dragEnd} key={key++}><circle key={key++} fill={this.strokeColor} stroke={this.LightenDarkenColor(this.strokeColor, -50)} strokeWidth={2} cx={this.state.points[this.state.points.length - 1].x} cy={this.state.points[this.state.points.length - 1].y} r={7}/><circle key={key++} fill={this.LightenDarkenColor(this.strokeColor, -50)} cx={this.state.points[this.state.points.length - 1].x} cy={this.state.points[this.state.points.length - 1].y} r={3}/></g>);

    return (
      <g>
        {this.strokeBorder != 0 ? (
          <path
            d={data}
            fill="none"
            stroke={this.LightenDarkenColor(this.strokeColor, -50)}
            strokeWidth={this.strokeWidth + this.strokeBorder}
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        ) : (
          ""
        )}
        <path
          d={data}
          fill="none"
          stroke={this.strokeColor}
          strokeWidth={this.strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        {points}
      </g>
    );
  }
}

export default Wire;
