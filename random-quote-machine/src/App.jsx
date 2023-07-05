import { useEffect, useState } from "react";
import "./App.css";
import QuoteWrapper from "./components/QuoteWrapper";
import useGenerateRandomColor from "./hooks/useGenerateRandomColor";

function App() {
  const { color, generateColor } = useGenerateRandomColor();
  useEffect(() => {
    generateColor();
    console.log("color generated", color);
  }, []);

  if (!color) {
    return null;
  }

  const styles = {
    backgroundColor: color,
    color: color,
  };

  return (
    <div
      id="quote-box"
      className={`h-screen w-full flex justify-center items-center transition-colors duration-500`}
      style={styles}
    >
      <QuoteWrapper styles={styles} generateColor={generateColor} />
    </div>
  );
}

export default App;
