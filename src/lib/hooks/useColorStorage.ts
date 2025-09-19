import { useState } from "react";
const COLOR_STORAGE_KEY = 'color';

type PlayerColor = 'WHITE' | 'BLACK' | null;

export const useColorStorage = () => {
  const [color, setColor] = useState<PlayerColor>(() => {
    try {
      const storedColor = localStorage.getItem(COLOR_STORAGE_KEY);
      return storedColor as PlayerColor;
    } catch (error) {
      console.error("Error reading color from localStorage:", error);
      return null;
    }
  });

  const saveColor = (newColor: PlayerColor) => {
    try {
      if (newColor) {
        localStorage.setItem(COLOR_STORAGE_KEY, newColor.toLocaleLowerCase());
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
