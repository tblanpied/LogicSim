import "../css/and_gate.css";
import React from "react";

class AndGate extends React.Component {
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
            inputs: props.inputs
        };
        this.output_state = false;
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
        if (this.state.new_component) {
            this.setState({
                diffX: 100,
                diffY: 50,
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
        if(prevProps.inputs != this.props.inputs){
            this.setState({
                inputs: this.props.inputs
            });
            if((this.props.inputs.a && this.props.inputs.b) != this.output_state){
                this.output_state = this.props.inputs.a && this.props.inputs.b;
                this.onStateChange(this.id, this.output_state, 0);
            }
        }
    }

    render() {
        return (
            <g opacity={this.state.opacity} onMouseDown={this._dragStart} onMouseMove={this._dragging} onMouseUp={this._dragEnd} className={"Component-andgate-" + this.id} transform={"translate(" + this.state.position.x + "," + this.state.position.y + ") rotate(" + this.state.rotation + ")"} width="206" height="106" viewBox="0 0 206 106" fill="none">
                <g className="AndGate">
                    <g opacity={this.state.selected?1:0} className="select-border">
                        <rect className="Rectangle 7" x="8" y="15" width="30" height="16" fill="#0A9DFF"/>
                        <circle className="Rectangle" cx="8" cy="23" r="8" fill="#0A9DFF"/>
                        <circle className="Rectangle" cx="8" cy="83" r="8" fill="#0A9DFF"/>
                        <rect className="Rectangle 1" x="35" width="83" height="106" rx="5" fill="#0A9DFF" stroke="#0A9DFF" strokeWidth="4"/>
                        <rect className="Rectangle 12" x="163" y="45" width="35" height="16" fill="#0A9DFF"/>
                        <circle className="Circle" cx="198" cy="53" r="8" fill="#0A9DFF"/>
                        <circle className="Ellipse 1" cx="118" cy="53" r="53" fill="#0A9DFF" stroke="#0A9DFF" strokeWidth="4"/>
                        <rect className="Rectangle 11" x="8" y="75" width="30" height="16" fill="#0A9DFF"/>
                    </g>
                    <rect className="Rectangle 6" x="8" y="78" width="35" height="10" fill="black"/>
                    <rect className="Rectangle 10" x="8" y="18" width="35" height="10" fill="black"/>
                    <rect className="Rectangle 4" x="163" y="48" width="35" height="10" fill="black"/>
                    <circle className="Circle" cx="8" cy="23" r="4" fill="black" stroke="black" strokeWidth="2"/>
                    <circle className="Circle_2" cx="8" cy="83" r="4" fill="black" stroke="black" strokeWidth="2"/>
                    <circle className="Circle_3" cx="198" cy="53" r="4" fill="black" stroke="black" strokeWidth="2"/>
                    <path className="Body" fillRule="evenodd" clipRule="evenodd" d="M118 3H43C40.2386 3 38 5.23858 38 8V98C38 100.761 40.2386 103 43 103H118C145.614 103 168 80.6142 168 53C168 25.3858 145.614 3 118 3Z" fill="#215FFF" stroke="black" strokeWidth="4"/>
                    <path className="AND" d="M85.9213 64.064C84.0653 64.064 83.0626 63.7653 82.9133 63.168L81.8573 59.04H76.7693L75.8413 63.008C75.7133 63.6693 74.6893 64 72.7693 64C71.7453 64 70.9879 63.9467 70.4973 63.84C70.0066 63.712 69.7613 63.616 69.7613 63.552L75.4253 41.888C75.4253 41.7173 76.8866 41.632 79.8093 41.632C82.7319 41.632 84.1933 41.7173 84.1933 41.888L89.7293 63.584C89.7293 63.7333 89.2386 63.8507 88.2573 63.936C87.2759 64.0213 86.4973 64.064 85.9213 64.064ZM77.5693 54.976H80.9293L79.4893 48.352H79.2973L77.5693 54.976ZM109.386 63.296C109.386 63.744 108.383 63.968 106.378 63.968C104.373 63.968 103.285 63.808 103.114 63.488L97.77 53.504V63.456C97.77 63.84 96.778 64.032 94.794 64.032C92.8313 64.032 91.85 63.84 91.85 63.456V42.048C91.85 41.728 92.6927 41.568 94.378 41.568C95.0393 41.568 95.8073 41.632 96.682 41.76C97.578 41.8667 98.122 42.08 98.314 42.4L103.434 52.256V42.208C103.434 41.8027 104.426 41.6 106.41 41.6C108.394 41.6 109.386 41.8027 109.386 42.208V63.296ZM112.6 62.528V43.328C112.6 42.7947 112.728 42.3787 112.984 42.08C113.261 41.76 113.613 41.6 114.04 41.6H119.384C122.776 41.6 125.347 42.4533 127.096 44.16C128.867 45.8667 129.752 48.5547 129.752 52.224C129.752 60.0747 126.403 64 119.704 64H114.232C113.144 64 112.6 63.5093 112.6 62.528ZM118.744 47.68V57.248C118.744 57.696 118.776 57.984 118.84 58.112C118.904 58.2187 119.096 58.272 119.416 58.272C120.589 58.272 121.475 57.8347 122.072 56.96C122.691 56.0853 123 54.6347 123 52.608C123 50.56 122.68 49.2267 122.04 48.608C121.421 47.9893 120.429 47.68 119.064 47.68H118.744Z" fill="black"/>
                    <circle onMouseDown={(e) => {this.StartEndWire(e,this.id, "andgate", 1, "input")} } className="IO In-1" cx="8" cy="83" r="9" fill="#FF0000" stroke="black" strokeWidth="4"/>
                    <circle onMouseDown={(e) => {this.StartEndWire(e,this.id, "andgate", 0, "input")} } className="IO In-0" cx="8" cy="23" r="9" fill="#FF0000" stroke="black" strokeWidth="4"/>
                    <circle onMouseDown={(e) => {this.StartEndWire(e,this.id, "andgate", 0, "output")} } className="IO Out-0" cx="198" cy="53" r="9" fill="#FF0000" stroke="black" strokeWidth="4"/>
                </g>
            </g>
        );
    }
}

export default AndGate;