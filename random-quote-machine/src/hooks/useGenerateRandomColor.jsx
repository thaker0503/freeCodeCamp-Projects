import { useState } from "react";

const useGenerateRandomColor = () => {
  const [color, setColor] = useState("");
  const generateColor = () => {
    setColor(`#${Math.random().toString(16).substr(-6)}`);
  };
  if (color === "") {
    generateColor();
  }
  return { color, generateColor };
};
export default useGenerateRandomColor;
