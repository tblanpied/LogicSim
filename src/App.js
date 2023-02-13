import "./App.css";
import Header from "./components/UI/js/header";
import { createContext, useState } from "react";
import ToolBar from "./components/UI/js/toolbar";

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
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
