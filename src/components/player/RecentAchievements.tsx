import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Zap } from 'lucide-react';
import { Achievement } from '../../lib/hooks/usePlayerProfile';

interface RecentAchievementsProps {
    achievements: Achievement[];
}

const RecentAchievements: React.FC<RecentAchievementsProps> = ({
    achievements,
}) => {
    const getAchievementIcon = (type: string) => {
        switch (type) {
            case 'milestone':
                return Award;
            case 'streak':
                return Zap;
            default:
                return Star;
        }
    };

    return (
        <motion.div
            className="glass-effect rounded-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
        >
            <h3 className="text-xl font-semibold text-white mb-4">
                Logros Recientes
            </h3>

            <div className="space-y-3">
                {achievements.map((achievement, index) => {
                    const Icon = getAchievementIcon(achievement.type);

                    return (
                        <motion.div
                            key={achievement.id}
                            className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700/70 transition-colors"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                <Icon className="h-5 w-5 text-white" />
                            </div>

                            <div className="flex-1">
                                <p className="text-white font-medium">
                                    {achievement.title}
                                </p>
                                <p className="text-slate-400 text-sm">
                                    {achievement.description}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-slate-400 text-xs">
                                    {achievement.date}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default RecentAchievements;
