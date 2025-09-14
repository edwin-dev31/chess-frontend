import { useState, useEffect } from 'react';

// Type Definitions
export interface ProfileSettings {
    displayName: string;
    email: string;
    country: string;
    publicProfile: boolean;
}

export interface AppearanceSettings {
    theme: string;
    boardTheme: string;
    pieceSet: string;
    animations: boolean;
}

export interface AudioSettings {
    soundEnabled: boolean;
    moveSound: boolean;
    captureSound: boolean;
    volume: number;
}

export interface GameSettings {
    autoQueen: boolean;
    showCoordinates: boolean;
    highlightMoves: boolean;
    confirmMoves: boolean;
}

export interface AppSettings {
    profile: ProfileSettings;
    appearance: AppearanceSettings;
    audio: AudioSettings;
    game: GameSettings;
}

// Configuración por defecto
const defaultSettings: AppSettings = {
    profile: {
        displayName: 'edwin_dev',
        email: 'edwin@example.com',
        country: 'España',
        publicProfile: true,
    },
    appearance: {
        theme: 'Oscuro',
        boardTheme: 'Clásico',
        pieceSet: 'Clásico',
        animations: true,
    },
    audio: {
        soundEnabled: true,
        moveSound: true,
        captureSound: true,
        volume: 75,
    },
    game: {
        autoQueen: true,
        showCoordinates: true,
        highlightMoves: true,
        confirmMoves: false,
    },
};

export const useSettings = () => {
    const [settings, setSettings] = useState<AppSettings>(defaultSettings);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Simular carga de configuración desde localStorage o API
        const loadSettings = async () => {
            setLoading(true);

            // Intentar cargar desde localStorage
            const savedSettings = localStorage.getItem('chessSettings');
            if (savedSettings) {
                try {
                    const parsedSettings: AppSettings =
                        JSON.parse(savedSettings);
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

    const updateSettings = (newSettings: AppSettings) => {
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
        loading,
    };
};
