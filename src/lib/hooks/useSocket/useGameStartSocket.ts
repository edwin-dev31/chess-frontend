import { useEffect, useRef } from 'react';
import { socketHelper } from '../../helpers/socketHelper';
import { Color } from '../../types/Definitions';
import { useColorStorage } from '../useColorStorage';

const INITIAL_COLOR_TOPIC = '/user/queue/start';

export const subscribeToInitialColor = (
    callback: (color: Color) => void
) => {
    if (!callback) return () => {};

    const unsubscribe = socketHelper.subscribe(INITIAL_COLOR_TOPIC, (message) => {
        try {
            const parsedBody = JSON.parse(message.body);
            // Handles both { "color": "WHITE" } and "WHITE" as payload
            const color: Color = parsedBody.color || parsedBody;
            
            if (color === 'WHITE' || color === 'BLACK') {
                console.log('Received initial color from server:', color);
                callback(color);
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
        // Connect WebSocket when component mounts
        socketHelper.connect(() => {
            // Subscribe only after connection is established
            if (!unsubscribeRef.current) { // Ensure we don't subscribe multiple times
                unsubscribeRef.current = subscribeToInitialColor(saveColor);
            }
        });

        return () => {
            // Disconnect WebSocket and unsubscribe when component unmounts
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
                unsubscribeRef.current = null;
            }
            socketHelper.disconnect(); // Disconnect the socket
        };
    }, [saveColor]);
};
