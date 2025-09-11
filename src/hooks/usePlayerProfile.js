import { useState, useEffect } from 'react';

// Simulación de datos del perfil del jugador
const mockPlayerProfile = {
  name: 'edwin_dev',
  joinDate: 'Enero 2024',
  country: 'España',
  skillLevel: 'intermediate',
  achievements: [
    {
      id: 1,
      title: 'Primera Victoria',
      description: 'Ganaste tu primera partida',
      date: '15 Ene',
      type: 'milestone'
    },
    {
      id: 2,
      title: 'Racha de 3',
      description: 'Ganaste 3 partidas consecutivas',
      date: '14 Ene',
      type: 'streak'
    },
    {
      id: 3,
      title: 'Jugador Activo',
      description: 'Jugaste 10 partidas esta semana',
      date: '13 Ene',
      type: 'activity'
    }
  ]
};

const mockPlayerStats = {
  currentRating: 1200,
  ratingChange: +25,
  gamesPlayed: 47,
  winRate: 64,
  peakRating: 1285,
  gameTypes: [
    {
      name: 'Blitz (5+0)',
      rating: 1200,
      games: 25,
      change: +15
    },
    {
      name: 'Rápidas (10+0)',
      rating: 1180,
      games: 15,
      change: -5
    },
    {
      name: 'Clásicas (30+0)',
      rating: 1250,
      games: 7,
      change: +35
    }
  ]
};

export const usePlayerProfile = () => {
  const [profile, setProfile] = useState(mockPlayerProfile);
  const [stats, setStats] = useState(mockPlayerStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos de la API
    const fetchPlayerData = async () => {
      setLoading(true);
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setProfile(mockPlayerProfile);
      setStats(mockPlayerStats);
      setLoading(false);
    };

    fetchPlayerData();
  }, []);

  return {
    profile,
    stats,
    loading
  };
};