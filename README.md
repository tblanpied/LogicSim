# LogicSim

A simple React web application for simulating digital logic circuits. This project allows users to build and test logic circuits using drag-and-drop components.

* **Author:** Timothée Blanpied
* **Created:** 2023/07

## Features

- Drag-and-drop logic gates (AND, NOT)
- Interactive components: Push Button, Switch, Light Bulb, Clock, 7-Segment Display
- Custom SVG-based wire connections that light up when signals pass through
- Zoom and pan functionality
- Dark/light theme toggle

## Tech Stack

- React 18
- JavaScript (ES6+)
- HTML5
- CSS3
- Custom SVG for components and wires

## Installation

### Prerequisites

- Node.js >= 8.10
- npm >= 5.6

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/tblanpied/LogicSim.git
   cd logicsim
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- Select components from the sidebar and drag them onto the breadboard.
- Connect components by drawing wires between connection points.
- Use the toolbar to select, delete, or rotate components.
- Toggle switches and buttons to see circuit behavior in real-time.

## Project Structure

```
src/
├── components/          # Logic gate and component implementations
│   ├── js/             # Component logic
│   ├── css/            # Component styles
│   ├── svg/            # Custom SVG assets
│   └── img/            # Images
├── UI/                 # User interface components
│   ├── js/             # UI component logic
│   ├── css/            # UI styles
│   └── svg/            # UI icons
├── App.js              # Main app component
├── index.js            # App entry point
└── config.js           # Configuration
```

## Limitations

- No saving/loading of circuits
- Limited to predefined components (no custom gates)
- Prototype-level implementation

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

This project is provided as-is for educational purposes and is not actively maintained for contributions.
