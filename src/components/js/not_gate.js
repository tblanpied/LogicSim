import "../css/not_gate.css";
import React from "react";

class NotGate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            new_component: props.new_component === undefined ? false : props.new_component,
            dragging: false,
            position: {
                x: parseInt(props.x),
                y: parseInt(props.y)
            },
            diffX: 0,
            diffY: 0,
            selected: props.selected,
            opacity: props.opacity === undefined ? 1 : props.opacity,
            rotation: (props.rotation === undefined ? 0 : props.rotation),
            input: props.input
        };
        this.output_state = true;
        this.onClick = props.onClick;
        this.setCoord = props.setCoord;
        this.onStateChange = props.onStateChange;
        this.id = props.id;

        this.start_position = {x:0, y:0};

        this.StartEndWire = props.StartEndWire;

        this._dragStart = this._dragStart.bind(this);
        this._dragging = this._dragging.bind(this);
        this._dragEnd = this._dragEnd.bind(this);
    }

    componentDidMount() {
        this.onStateChange(this.id, !this.state.input, 0);
        if (this.state.new_component) {
            this.setState({
                diffX: 103,
                diffY: 94,
                dragging: true
            });
            document.addEventListener("mousemove", this._dragging);
            document.addEventListener("mouseup", this._dragEnd);
        }
    }

    _dragStart(e) {
        e.stopPropagation();
        if (e.button === 0) {
            this.onClick(this.id)
            if (!this.state.new_component) {
                this.start_position.x = e.pageX;
                this.start_position.y = e.pageY;
                this.setState({
                    diffX: e.pageX - e.currentTarget.getBoundingClientRect().left,
                    diffY: e.pageY - e.currentTarget.getBoundingClientRect().top,
                    dragging: true,
                });
                document.addEventListener("mousemove", this._dragging);
                document.addEventListener("mouseup", this._dragEnd);
            }
        }
    }

    _dragging(e) {
        if (this.state.dragging && (this.start_position.x !== e.pageX || this.start_position.y !== e.pageY)) {
            this.setState({
                position: {
                    x: e.pageX - this.state.diffX,
                    y: e.pageY - this.state.diffY
                }
            });
            this.setCoord(this.id, e.pageX - this.state.diffX, e.pageY - this.state.diffY);
        }
    }

    _dragEnd() {
        if (!this.state.new_component) {
            this.setState({
                diffX: 0,
                diffY: 0,
                dragging: false,
            });
            document.removeEventListener("mousemove", this._dragging);
            document.removeEventListener("mouseup", this._dragEnd);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selected !== this.props.selected) {
            this.setState({
                selected: this.props.selected
            });
        }
        if(prevProps.input != this.props.input){
            this.setState({
                inputs: this.props.inputs
            });
            if((!this.props.input) != this.output_state){
                this.output_state = (!this.props.input);
                this.onStateChange(this.id, this.output_state, 0);
            }
        }
    }

    render() {
        return (
            <g opacity={this.state.opacity} onMouseDown={this._dragStart} onMouseMove={this._dragging} onMouseUp={this._dragEnd} className={"Component-notgate-" + this.id} transform={"translate(" + this.state.position.x + "," + this.state.position.y + ") rotate(" + this.state.rotation + ")"} width="206" height="187" viewBox="0 0 206 187" fill="none">
                <g className="NotGate">
                    <g opacity={this.state.selected?1:0} className="select-border">
                        <path className="Polygon 2" d="M175 86.5718C180.333 89.651 180.333 97.349 175 100.428L58.75 167.545C53.4167 170.624 46.75 166.775 46.75 160.617L46.75 26.383C46.75 20.2246 53.4167 16.3756 58.75 19.4548L175 86.5718Z" fill="#0A9DFF"/>
                        <rect className="Rectangle 3" x="25" y="86" width="35" height="15" fill="#0A9DFF"/>
                        <rect className="Rectangle 4" x="161" y="86" width="35" height="15" fill="#0A9DFF"/>
                        <circle className="Ellipse 3" cx="25.5" cy="93.5" r="7.5" fill="#0A9DFF"/>
                        <circle className="Ellipse 4" cx="196.5" cy="93.5" r="7.5" fill="#0A9DFF"/>
                    </g>
                    <rect className="Rectangle 1" x="161" y="89" width="35" height="9" fill="black"/>
                    <circle className="Ellipse 1" cx="196.5" cy="93.5" r="4.5" fill="black"/>
                    <rect className="Rectangle 2" x="25" y="89" width="35" height="9" fill="black"/>
                    <circle className="Ellipse 2" cx="25.5" cy="93.5" r="4.5" fill="black"/>
                    <path className="Polygon 1" d="M172.25 95.6651L56 162.782C54.3333 163.744 52.25 162.541 52.25 160.617L52.25 26.383C52.25 24.4585 54.3333 23.2557 56 24.218L172.25 91.335C173.917 92.2972 173.917 94.7028 172.25 95.6651Z" fill="#9218F1" stroke="black" strokeWidth="5"/>
                    <path className="NOT" d="M89.136 104.296C89.136 104.744 88.1333 104.968 86.128 104.968C84.1227 104.968 83.0347 104.808 82.864 104.488L77.52 94.504V104.456C77.52 104.84 76.528 105.032 74.544 105.032C72.5813 105.032 71.6 104.84 71.6 104.456V83.048C71.6 82.728 72.4427 82.568 74.128 82.568C74.7893 82.568 75.5573 82.632 76.432 82.76C77.328 82.8667 77.872 83.08 78.064 83.4L83.184 93.256V83.208C83.184 82.8027 84.176 82.6 86.16 82.6C88.144 82.6 89.136 82.8027 89.136 83.208V104.296ZM101.854 105.32C98.8673 105.32 96.4247 104.339 94.526 102.376C92.6487 100.413 91.71 97.5547 91.71 93.8C91.71 90.024 92.6593 87.1653 94.558 85.224C96.478 83.2827 98.942 82.312 101.95 82.312C104.979 82.312 107.422 83.272 109.278 85.192C111.134 87.0907 112.062 89.9813 112.062 93.864C112.062 97.7253 111.113 100.605 109.214 102.504C107.315 104.381 104.862 105.32 101.854 105.32ZM101.886 88.456C100.862 88.456 99.998 88.9253 99.294 89.864C98.6113 90.8027 98.27 92.1253 98.27 93.832C98.27 95.5173 98.6007 96.8187 99.262 97.736C99.9233 98.632 100.787 99.08 101.854 99.08C102.942 99.08 103.817 98.6213 104.478 97.704C105.161 96.7867 105.502 95.4747 105.502 93.768C105.502 92.0613 105.15 90.7493 104.446 89.832C103.763 88.9147 102.91 88.456 101.886 88.456ZM124.263 104.488C124.263 104.915 123.207 105.128 121.095 105.128C118.983 105.128 117.927 104.915 117.927 104.488V88.424H114.087C113.725 88.424 113.469 87.9333 113.319 86.952C113.255 86.4827 113.223 86.0027 113.223 85.512C113.223 85.0213 113.255 84.5413 113.319 84.072C113.469 83.0907 113.725 82.6 114.087 82.6H128.007C128.37 82.6 128.626 83.0907 128.775 84.072C128.839 84.5413 128.871 85.0213 128.871 85.512C128.871 86.0027 128.839 86.4827 128.775 86.952C128.626 87.9333 128.37 88.424 128.007 88.424H124.263V104.488Z" fill="black"/>
                    <circle onMouseDown={(e) => {this.StartEndWire(e,this.id, "notgate", 0, "output")} } className="IO Out-0" cx="196.5" cy="93.5" r="9" fill="#FF0000" stroke="black" strokeWidth="4"/>
                    <circle onMouseDown={(e) => {this.StartEndWire(e,this.id, "notgate", 0, "input")} } className="IO In-0" cx="25.5" cy="93.5" r="9" fill="#FF0000" stroke="black" strokeWidth="4"/>
                </g>
            </g>
        );
    }
}

export default NotGate;