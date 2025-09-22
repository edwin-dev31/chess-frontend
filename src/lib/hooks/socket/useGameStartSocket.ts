import { useEffect, useRef } from 'react';
import { socketHelper } from '@/lib/helpers/socketHelper';
import { Color } from '@/lib/types/Definitions';
import { useColorStorage } from '@/lib/hooks/common/useColorStorage';

const INITIAL_COLOR_TOPIC = '/user/queue/start';

export const subscribeToInitialColor = (
    callback: (color: Color) => void
) => {
    if (!callback) return () => {};

    const unsubscribe = socketHelper.subscribe(INITIAL_COLOR_TOPIC, (message) => {
        try {
            alert("hola")
            const color: Color = JSON.parse(message.body);
            alert(color)
            if (color === Color.WHITE || color === Color.BLACK) {
                callback(color);
               // unsubscribe();
            } else {
                console.warn('Parsed color is not valid:', color);
            }
        } catch (error) {
            console.error('Failed to parse color from WebSocket message:', error);
        }
    });

    return unsubscribe;
};

export const useInitialColorSubscription = () => {
    const { saveColor } = useColorStorage();
    const unsubscribeRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        socketHelper.connect(() => {
            if (!unsubscribeRef.current) { 
                unsubscribeRef.current = subscribeToInitialColor(saveColor);
            }
        });

        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
                unsubscribeRef.current = null;
            }
            //socketHelper.disconnect(); 
        };
    }, [saveColor]);
};
