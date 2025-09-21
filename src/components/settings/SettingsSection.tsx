import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
    ProfileSettings,
    AppearanceSettings,
    AudioSettings,
    GameSettings,
    AppSettings,
} from '@/lib/hooks/settings/useSettings';

type FieldType = 'text' | 'email' | 'select' | 'toggle' | 'range';

interface Field {
    key: string;
    label: string;
    type: FieldType;
    options?: string[];
    min?: number;
    max?: number;
}

interface SettingsSectionProps {
    title: string;
    icon: React.ElementType;
    settings:
        | ProfileSettings
        | AppearanceSettings
        | AudioSettings
        | GameSettings;
    onSettingChange: (key: string, value: any) => void;
    fields: Field[];
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
    title,
    icon: Icon,
    settings,
    onSettingChange,
    fields,
}) => {
    const { toast } = useToast();

    const handleInputChange = (key: string, value: any, type: FieldType) => {
        if (type === 'range') {
            onSettingChange(key, parseInt(value));
        } else if (type === 'toggle') {
            onSettingChange(key, !settings[key as keyof typeof settings]);
        } else {
            onSettingChange(key, value);
        }
    };

    const handleNotImplemented = () => {
        toast({
            title: '🚧 Esta función aún no está implementada',
            description:
                '¡Pero no te preocupes! Puedes solicitarla en tu próximo prompt! 🚀',
        });
    };

    const renderField = (field: Field) => {
        const value = settings[field.key as keyof typeof settings];

        switch (field.type) {
            case 'text':
            case 'email':
                return (
                    <input
                        type={field.type}
                        value={value || ''}
                        onChange={(e) =>
                            handleInputChange(
                                field.key,
                                e.target.value,
                                field.type
                            )
                        }
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={field.label}
                    />
                );

            case 'select':
                return (
                    <select
                        value={value || ''}
                        onChange={(e) =>
                            handleInputChange(
                                field.key,
                                e.target.value,
                                field.type
                            )
                        }
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {field.options?.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                );

            case 'toggle':
                return (
                    <Button
                        onClick={() =>
                            handleInputChange(field.key, null, field.type)
                        }
                        variant={value ? 'default' : 'outline'}
                        className={`w-16 h-8 ${value ? 'bg-blue-600' : 'bg-slate-600'}`}
                    >
                        {value ? 'ON' : 'OFF'}
                    </Button>
                );

            case 'range':
                return (
                    <div className="flex items-center space-x-3">
                        <input
                            type="range"
                            min={field.min || 0}
                            max={field.max || 100}
                            value={value || 0}
                            onChange={(e) =>
                                handleInputChange(
                                    field.key,
                                    e.target.value,
                                    field.type
                                )
                            }
                            className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-white font-medium w-12 text-center">
                            {value}%
                        </span>
                    </div>
                );

            default:
                return (
                    <Button onClick={handleNotImplemented} variant="outline">
                        Configurar
                    </Button>
                );
        }
    };

    return (
        <motion.div
            className="glass-effect rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">{title}</h3>
            </div>

            <div className="space-y-4">
                {fields.map((field) => (
                    <div
                        key={field.key}
                        className="flex items-center justify-between"
                    >
                        <label className="text-white font-medium">
                            {field.label}
                        </label>
                        <div className="w-48">{renderField(field)}</div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default SettingsSection;
