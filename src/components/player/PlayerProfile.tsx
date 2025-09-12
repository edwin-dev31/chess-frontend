import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Target, Calendar } from 'lucide-react';
import { usePlayerProfile, PlayerProfile as PlayerProfileType, PlayerStats } from '../../hooks/usePlayerProfile';
import StatsCard from './StatsCard';
import SkillLevel from './SkillLevel';
import RecentAchievements from './RecentAchievements';

const PlayerProfile = () => {
  const { profile, stats, loading } = usePlayerProfile();


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
        className="glass-effect rounded-lg p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-white">
              {profile.name.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{profile.name}</h1>
            <div className="flex items-center space-x-4 text-slate-400">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Miembro desde {profile.joinDate}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Trophy className="h-4 w-4" />
                <span>{profile.country}</span>
              </div>
            </div>
          </div>
          
          <SkillLevel level={profile.skillLevel} />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Rating Actual"
          value={stats.currentRating}
          icon={Trophy}
          color="blue"
          trend={stats.ratingChange}
        />
        <StatsCard
          title="Partidas Jugadas"
          value={stats.gamesPlayed}
          icon={Target}
          color="green"
        />
        <StatsCard
          title="Porcentaje de Victoria"
          value={`${stats.winRate}%`}
          icon={TrendingUp}
          color="purple"
        />
        <StatsCard
          title="Mejor Rating"
          value={stats.peakRating}
          icon={Trophy}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="glass-effect rounded-lg p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4">Estadísticas por Modalidad</h3>
          <div className="space-y-4">
            {stats.gameTypes.map((type, index) => (
              <div key={type.name} className="flex justify-between items-center">
                <div>
                  <p className="text-white font-medium">{type.name}</p>
                  <p className="text-slate-400 text-sm">{type.games} partidas</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{type.rating}</p>
                  <p className={`text-sm ${type.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {type.change >= 0 ? '+' : ''}{type.change}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <RecentAchievements achievements={profile.achievements} />
      </div>
    </div>
  );
};

export default PlayerProfile;
