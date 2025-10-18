import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Trophy, Clock, User } from 'lucide-react';
import { useGameSummary } from '@/lib/hooks/game/useGameSummary';

const GameHistory = () => {
    const { loading, error, summary, fetchSummary } = useGameSummary();

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-400 bg-red-950/30 p-4 rounded-lg">
                ⚠️ Error al cargar el historial: {error}
            </div>
        );
    }

    if (summary.length === 0) {
        return (
            <div className="p-6 rounded-lg bg-slate-800 text-center text-slate-300">
                <p>No tienes partidas registradas aún.</p>
                <p className="mt-2 text-sm text-slate-500">
                    Ejemplo: vs <b>ChessMaster2024</b> (ELO 1250) — victoria en 42 movimientos.
                </p>
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
                <h2 className="text-2xl font-bold text-white">
                    Historial de Partidas
                </h2>
                <div className="text-slate-400">
                    Total: {summary.length} partidas
                </div>
            </motion.div>

            <div className="grid gap-4">
                {summary.map((game, index) => (
                    <motion.div
                        key={game.gameId}
                        className="glass-effect rounded-lg p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div
                                    className={`w-3 h-3 rounded-full ${
                                        game.result === 'win'
                                            ? 'bg-green-500'
                                            : game.result === 'loss'
                                            ? 'bg-red-500'
                                            : 'bg-yellow-500'
                                    }`}
                                ></div>
                                <span className="text-white font-semibold capitalize">
                                    {game.result === 'win'
                                        ? 'Victoria'
                                        : game.result === 'loss'
                                        ? 'Derrota'
                                        : 'Empate'}
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
                                    <p className="text-white font-medium">
                                        vs {game.opponent}
                                    </p>
                                    <p className="text-slate-400 text-sm">
                                        {game.opponentRating} ELO
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Clock className="h-5 w-5 text-slate-400" />
                                <div>
                                    <p className="text-white">
                                        {game.timeControl}
                                    </p>
                                    <p className="text-slate-400 text-sm">
                                        Control de tiempo
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Trophy className="h-5 w-5 text-slate-400" />
                                <div>
                                    <p className="text-white">
                                        {game.moves} movimientos
                                    </p>
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
