import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Trophy, Clock, User } from 'lucide-react';
import { useGameHistory, GameRecord } from '../../hooks/useGameHistory';

const GameHistory = () => {
  const { games, loading } = useGameHistory();

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
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h2 className="text-2xl font-bold text-white">Historial de Partidas</h2>
        <div className="text-slate-400">
          Total: {games.length} partidas
        </div>
      </motion.div>

      <div className="grid gap-4">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            className="glass-effect rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  game.result === 'win' ? 'bg-green-500' : 
                  game.result === 'loss' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
                <span className="text-white font-semibold capitalize">
                  {game.result === 'win' ? 'Victoria' : 
                   game.result === 'loss' ? 'Derrota' : 'Empate'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 text-slate-400">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{game.date}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-white font-medium">vs {game.opponent}</p>
                  <p className="text-slate-400 text-sm">{game.opponentRating} ELO</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-white">{game.timeControl}</p>
                  <p className="text-slate-400 text-sm">Control de tiempo</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Trophy className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-white">{game.moves} movimientos</p>
                  <p className="text-slate-400 text-sm">{game.opening}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Precisión</span>
                <div className="flex space-x-4">
                  <span className="text-white">Tú: {game.accuracy.player}%</span>
                  <span className="text-slate-400">Oponente: {game.accuracy.opponent}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GameHistory; 
