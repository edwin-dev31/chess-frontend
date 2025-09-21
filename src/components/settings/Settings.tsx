import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Palette, Volume2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import SettingsSection from '@/components/settings/SettingsSection';
import { useSettings, AppSettings } from '@/lib/hooks/settings/useSettings';

const Settings = () => {
    const { settings, updateSettings, loading } = useSettings();
    const { toast } = useToast();
    const [localSettings, setLocalSettings] = useState<AppSettings>(settings);

    const handleSave = () => {
        updateSettings(localSettings);
        toast({
            title: 'Configuración guardada',
            description:
                'Tus preferencias han sido actualizadas correctamente.',
        });
    };

    const handleSettingChange = (
        section: keyof AppSettings,
        key: string,
        value: any
    ) => {
        setLocalSettings((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value,
            },
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h2 className="text-2xl font-bold text-white">Configuración</h2>
                <Button
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                </Button>
            </motion.div>

            <div className="grid gap-6">
                <SettingsSection
                    title="Perfil"
                    icon={User}
                    settings={localSettings.profile}
                    onSettingChange={(key, value) =>
                        handleSettingChange('profile', key, value)
                    }
                    fields={[
                        {
                            key: 'displayName',
                            label: 'Nombre de usuario',
                            type: 'text',
                        },
                        {
                            key: 'email',
                            label: 'Correo electrónico',
                            type: 'email',
                        },
                        {
                            key: 'country',
                            label: 'País',
                            type: 'select',
                            options: [
                                'España',
                                'México',
                                'Argentina',
                                'Colombia',
                            ],
                        },
                        {
                            key: 'publicProfile',
                            label: 'Perfil público',
                            type: 'toggle',
                        },
                    ]}
                />

                <SettingsSection
                    title="Apariencia"
                    icon={Palette}
                    settings={localSettings.appearance}
                    onSettingChange={(key, value) =>
                        handleSettingChange('appearance', key, value)
                    }
                    fields={[
                        {
                            key: 'theme',
                            label: 'Tema',
                            type: 'select',
                            options: ['Oscuro', 'Claro', 'Auto'],
                        },
                        {
                            key: 'boardTheme',
                            label: 'Tema del tablero',
                            type: 'select',
                            options: ['Clásico', 'Moderno', 'Madera'],
                        },
                        {
                            key: 'pieceSet',
                            label: 'Conjunto de piezas',
                            type: 'select',
                            options: ['Clásico', 'Moderno', 'Minimalista'],
                        },
                        {
                            key: 'animations',
                            label: 'Animaciones',
                            type: 'toggle',
                        },
                    ]}
                />

                <SettingsSection
                    title="Audio"
                    icon={Volume2}
                    settings={localSettings.audio}
                    onSettingChange={(key, value) =>
                        handleSettingChange('audio', key, value)
                    }
                    fields={[
                        {
                            key: 'soundEnabled',
                            label: 'Sonidos habilitados',
                            type: 'toggle',
                        },
                        {
                            key: 'moveSound',
                            label: 'Sonido de movimiento',
                            type: 'toggle',
                        },
                        {
                            key: 'captureSound',
                            label: 'Sonido de captura',
                            type: 'toggle',
                        },
                        {
                            key: 'volume',
                            label: 'Volumen',
                            type: 'range',
                            min: 0,
                            max: 100,
                        },
                    ]}
                />

                <SettingsSection
                    title="Juego"
                    icon={Globe}
                    settings={localSettings.game}
                    onSettingChange={(key, value) =>
                        handleSettingChange('game', key, value)
                    }
                    fields={[
                        {
                            key: 'autoQueen',
                            label: 'Promoción automática a dama',
                            type: 'toggle',
                        },
                        {
                            key: 'showCoordinates',
                            label: 'Mostrar coordenadas',
                            type: 'toggle',
                        },
                        {
                            key: 'highlightMoves',
                            label: 'Resaltar movimientos',
                            type: 'toggle',
                        },
                        {
                            key: 'confirmMoves',
                            label: 'Confirmar movimientos',
                            type: 'toggle',
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export default Settings;
