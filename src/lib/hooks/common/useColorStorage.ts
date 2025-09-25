import { useState } from "react";
import { Color } from "@/lib/types/Definitions";
const COLOR_STORAGE_KEY = 'color';

export const useColorStorage = () => {
  const [color, setColor] = useState<Color | null>(() => {
    try {
      alert("aqui esta el color" + color)
      const storedColor = localStorage.getItem(COLOR_STORAGE_KEY);
      return storedColor as Color | null;
    } catch (error) {
      console.error("Error reading color from localStorage:", error);
      return null;
    }
  });

  const saveColor = (newColor: Color | null) => {
    try {
      if (newColor) {
      alert("guardar el color" + color)
        localStorage.setItem(COLOR_STORAGE_KEY, newColor);
      } else {
        localStorage.removeItem(COLOR_STORAGE_KEY);
      }
      setColor(newColor);
    } catch (error) {
      console.error("Error saving color to localStorage:", error);
    }
  };

  const removeColor = () => {
    saveColor(null);
  };

  return { color, saveColor, removeColor };
};
