import "../css/push_button.css";
import React from "react";

class PushButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            active: props.active === undefined ? false : props.active,
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
            rotation: (props.rotation === undefined ? 0 : props.rotation)
        };
        this.onClick = props.onClick;
        this.setCoord = props.setCoord;
        this.onStateChange = props.onStateChange;
        this.id = props.id;

        this.start_position = {x:0, y:0};

        this.StartEndWire = props.StartEndWire;

        this._dragStart = this._dragStart.bind(this);
        this._dragging = this._dragging.bind(this);
        this._dragEnd = this._dragEnd.bind(this);
        this._buttonPress = this._buttonPress.bind(this);
        this._buttonRelease = this._buttonRelease.bind(this);
    }

    componentDidMount() {
        if (this.state.new_component) {
            this.setState({
                diffX: 37,
                diffY: 37,
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
    }

    _buttonPress(e) {
        if (!this.state.new_component) {
            this.setState({
                active: true
            });
            this.onStateChange(this.id, true, 0);
        }
    }

    _buttonRelease(e) {
        if (!this.state.new_component) {
            this.setState({
                active: false
            });
            this.onStateChange(this.id, false, 0);
        }
    }

    render() {
        return (
            <g opacity={this.state.opacity} onMouseDown={this._dragStart} onMouseMove={this._dragging} onMouseUp={this._dragEnd} className={"Component-pushbutton-" + this.id} transform={"translate(" + this.state.position.x + "," + this.state.position.y + ") rotate(" + this.state.rotation + ")"} width="137" height="86" viewBox="0 0 137 86" fill="none">
                <g className="PushButton">
                    <path opacity={this.state.selected?1:0} className="select-border" fillRule="evenodd" clipRule="evenodd" d="M81.3069 48C77.7897 66.7843 61.305 81 41.5 81C19.1325 81 1 62.8675 1 40.5C1 18.1325 19.1325 0 41.5 0C61.6549 0 78.3712 14.7226 81.4812 34H102.412C105.143 27.5361 111.542 23 119 23C128.941 23 137 31.0589 137 41C137 50.9411 128.941 59 119 59C111.542 59 105.143 54.4639 102.412 48H81.3069Z" fill="#0A9DFF" />
                    <path className="Line" d="M41 41H119" stroke="black" strokeWidth="8" strokeLinecap="round" />
                    <g className="button" filter="url(#filter0_d_3_2)">
                        <circle onMouseDown={this._buttonPress} onMouseUp={this._buttonRelease} cx="41.5" cy="40.5" r="37.5" fill={this.state.active?"#ea2828":"#531F21"} />
                        <circle cx="41.5" cy="40.5" r="35" stroke="black" strokeWidth="5" />
                    </g>
                    <circle onMouseDown={(e) => {this.StartEndWire(e,this.id, "pushbutton", 0, "output")} } className="IO Out-0" cx="119" cy="41" r="12.5" fill="black" stroke="black" strokeWidth="5" />
                </g>
                <defs>
                    <filter id="filter0_d_3_2" x="0" y="3" width="83" height="83" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy="4" />
                        <feGaussianBlur stdDeviation="2" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3_2" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3_2" result="shape" />
                    </filter>
                </defs>
            </g>
        );
    }
}

export default PushButton;