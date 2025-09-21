import { useState, useEffect } from 'react';
import { apiRoutes } from '@/lib/constants/apiRoutes';
import { PlayerProfileDTO } from '@/lib/types/PlayerProfileDTO';
import { apiHelper } from '@/lib/helpers/apiHelper';

export const useProfile = () => {
    const [profile, setProfile] = useState<PlayerProfileDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const userProfile = await apiHelper<PlayerProfileDTO>(
                    apiRoutes.player.profile(),
                    {
                        method: 'GET',
                        token: token,
                    }
                );
                setProfile(userProfile);
            } catch (error) { 
                console.error('Failed to fetch player profile:', error);
                setProfile(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return { profile, loading };
};
