 import React from 'react';
import { motion } from 'framer-motion';

export type SkillLevelType = 'beginner' | 'intermediate' | 'advanced';

interface SkillLevelProps {
  level: SkillLevelType;
}

interface SkillLevelDetail {
  label: string;
  color: string;
  icon: string;
}

const SkillLevel: React.FC<SkillLevelProps> = ({ level }) => {
  const skillLevels: Record<SkillLevelType, SkillLevelDetail> = {
    beginner: { label: 'Principiante', color: 'from-green-400 to-green-600', icon: '🌱' },
    intermediate: { label: 'Intermedio', color: 'from-blue-400 to-blue-600', icon: '⚡' },
    advanced: { label: 'Avanzado', color: 'from-purple-400 to-purple-600', icon: '👑' },
  };

  const currentLevel = skillLevels[level] || skillLevels.beginner;

  return (
    <motion.div
      className={`skill-badge bg-gradient-to-r ${currentLevel.color} rounded-lg px-4 py-2`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="flex items-center space-x-2">
        <span className="text-lg">{currentLevel.icon}</span>
        <span className="text-white font-semibold">{currentLevel.label}</span>
      </div>
    </motion.div>
  );
};

export default SkillLevel;