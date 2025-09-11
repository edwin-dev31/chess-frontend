import { useState, useEffect } from 'react';

// Configuración por defecto
const defaultSettings = {
  profile: {
    displayName: 'edwin_dev',
    email: 'edwin@example.com',
    country: 'España',
    publicProfile: true
  },
  appearance: {
    theme: 'Oscuro',
    boardTheme: 'Clásico',
    pieceSet: 'Clásico',
    animations: true
  },
  audio: {
    soundEnabled: true,
    moveSound: true,
    captureSound: true,
    volume: 75
  },
  game: {
    autoQueen: true,
    showCoordinates: true,
    highlightMoves: true,
    confirmMoves: false
  }
};

export const useSettings = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de configuración desde localStorage o API
    const loadSettings = async () => {
      setLoading(true);
      
      // Intentar cargar desde localStorage
      const savedSettings = localStorage.getItem('chessSettings');
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings({ ...defaultSettings, ...parsedSettings });
        } catch (error) {
          console.error('Error parsing saved settings:', error);
          setSettings(defaultSettings);
        }
      } else {
        setSettings(defaultSettings);
      }
      
      setLoading(false);
    };

    loadSettings();
  }, []);

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    
    // Guardar en localStorage
    try {
      localStorage.setItem('chessSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return {
    settings,
    updateSettings,
    loading
  };
};