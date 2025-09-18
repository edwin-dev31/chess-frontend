import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { BACKEND_URL } from '../constants/axios';

let stompClient: Stomp.Client | null = null;
let reconnectTimeout: NodeJS.Timeout | null = null;
let currentReconnectInterval = 1000;
const MAX_RECONNECT_INTERVAL = 30000;
const RECONNECT_MULTIPLIER = 2;

const resetReconnectInterval = () => {
    currentReconnectInterval = 1000;
};

const scheduleReconnect = () => {
    if (reconnectTimeout) clearTimeout(reconnectTimeout);

    reconnectTimeout = setTimeout(() => {
        console.log(
            `Attempting to reconnect in ${currentReconnectInterval / 1000}s...`
        );
        socketHelper.connect();
        currentReconnectInterval = Math.min(
            currentReconnectInterval * RECONNECT_MULTIPLIER,
            MAX_RECONNECT_INTERVAL
        );
    }, currentReconnectInterval);
};

export const socketHelper = {
    connect: (onConnected?: () => void) => {
        if (stompClient && stompClient.connected) {
            console.log('✅ WebSocket already connected.');
            if (onConnected) onConnected();
            resetReconnectInterval();
            return;
        }

        if (stompClient) {
            try {
                stompClient.disconnect(() => {
                    console.log(
                        '🔌 Disconnected existing client before reconnecting.'
                    );
                    stompClient = null;
                });
            } catch (e) {
                console.warn(
                    'Could not disconnect existing client, it might be stale:',
                    e
                );
                stompClient = null;
            }
        }

        const socket = new SockJS(`${BACKEND_URL}/ws`);
        stompClient = Stomp.over(socket);
        const token = localStorage.getItem('token');

        stompClient.connect(
            { Authorization: `Bearer ${token}` },
            () => {
                console.log('✅ WebSocket Connected');
                if (onConnected) onConnected();
                resetReconnectInterval();
                if (reconnectTimeout) clearTimeout(reconnectTimeout); // Clear any pending reconnect
            },
            (error: any) => {
                console.error('❌ WebSocket connection error:', error);
                stompClient = null;
                scheduleReconnect(); // Schedule reconnect on error
            }
        );
    },

    subscribe: (topic: string, callback: (msg: any) => void) => {
        if (!stompClient || !stompClient.connected) {
            console.warn(
                `⚠️ Not connected to WebSocket, cannot subscribe to ${topic}`
            );
            return () => {};
        }

        const subscription = stompClient.subscribe(topic, (msg) => {
            callback(msg);
        });

        return () => {
            subscription.unsubscribe();
        };
    },

    send: (destination: string, body: any, headers: Stomp.Headers = {}) => {
        if (!stompClient || !stompClient.connected) {
            console.warn('⚠️ Not connected to WebSocket, cannot send message.');
            return;
        }
        const token = localStorage.getItem('token');
        stompClient.send(
            destination,
            { Authorization: `Bearer ${token}`, ...headers },
            JSON.stringify(body)
        );
    },

    disconnect: () => {
        if (reconnectTimeout) clearTimeout(reconnectTimeout);
        if (stompClient && stompClient.connected) {
            stompClient.disconnect(() => {
                console.log('🔌 Disconnected');
                stompClient = null;
            });
        } else {
            console.log('⚠️ No active WebSocket connection to disconnect.');
        }
        resetReconnectInterval();
    },

    isConnected: () => {
        return stompClient && stompClient.connected;
    },
};
