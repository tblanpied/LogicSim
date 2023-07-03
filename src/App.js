import "./App.css";
import Header from "./UI/js/header";
import { createContext, useState } from "react";
import ToolBar from "./UI/js/toolbar";
import SideBar from "./UI/js/sidebar";
import BreadBoard from "./UI/js/breadboard";

export const ThemeContext = createContext(null);

function App() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      <div className="App" id={theme}>
        <Header></Header>
        <ToolBar></ToolBar>
        <SideBar></SideBar>
        <BreadBoard></BreadBoard>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
