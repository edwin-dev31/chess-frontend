import SockJS from 'sockjs-client';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { BACKEND_URL } from '../constants/axios';

let stompClient: Client | null = null;
let reconnectTimeout: NodeJS.Timeout | null = null;
let currentReconnectInterval = 1000;
const MAX_RECONNECT_INTERVAL = 30000;
const RECONNECT_MULTIPLIER = 2;

const onConnectCallbacks: (() => void)[] = [];
const onDisconnectCallbacks: (() => void)[] = [];

const resetReconnectInterval = () => {
  currentReconnectInterval = 1000;
};

const scheduleReconnect = () => {
  if (reconnectTimeout) clearTimeout(reconnectTimeout);

  reconnectTimeout = setTimeout(() => {
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
      if (onConnected) onConnected();
      onConnectCallbacks.forEach(cb => cb());
      resetReconnectInterval();
      return;
    }

    if (stompClient) {
      try {
        stompClient.deactivate();
        stompClient = null;
        onDisconnectCallbacks.forEach(cb => cb());
      } catch (e) {
        console.warn('Could not deactivate existing client:', e);
        stompClient = null;
        onDisconnectCallbacks.forEach(cb => cb());
      }
    }

    const socket = new SockJS(`${BACKEND_URL}/ws`);
    const token = localStorage.getItem('token');
    const connectHeaders: Record<string, string> = {};
    if (token) {
      connectHeaders.Authorization = `Bearer ${token}`;
    }

    stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders,
      reconnectDelay: 0, // usamos nuestro sistema de reconexión manual
      onConnect: () => {
        if (onConnected) onConnected();
        onConnectCallbacks.forEach(cb => cb());
        resetReconnectInterval();
        if (reconnectTimeout) clearTimeout(reconnectTimeout);
        console.log('✅ WebSocket connected');
      },
      onDisconnect: () => {
        console.log('⚠️ Disconnected');
        onDisconnectCallbacks.forEach(cb => cb());
        scheduleReconnect();
      },
      onStompError: (frame) => {
        console.error('❌ STOMP error:', frame.headers['message']);
        scheduleReconnect();
      },
      onWebSocketClose: () => {
        console.warn('🔌 WebSocket closed');
        scheduleReconnect();
      },
      debug: (str) => console.log(str),
    });

    stompClient.activate();
  },

  subscribe: (topic: string, callback: (msg: IMessage) => void) => {
    if (!stompClient || !stompClient.connected) {
      console.warn(`⚠️ Not connected to WebSocket, cannot subscribe to ${topic}`);
      return () => {};
    }

    const subscription: StompSubscription = stompClient.subscribe(topic, callback);
    return () => subscription.unsubscribe();
  },

  send: (destination: string, body: any, headers: { [key: string]: any } = {}) => {
    if (!stompClient || !stompClient.connected) {
      console.warn('⚠️ Not connected to WebSocket, cannot send message.');
      return;
    }

    stompClient.publish({
      destination,
      headers,
      body: JSON.stringify(body),
    });
  },

  disconnect: () => {
    if (reconnectTimeout) clearTimeout(reconnectTimeout);
    if (stompClient && stompClient.active) {
      stompClient.deactivate();
      stompClient = null;
      onDisconnectCallbacks.forEach(cb => cb());
      console.log('🔌 WebSocket disconnected');
    } else {
      console.log('⚠️ No active WebSocket connection to disconnect.');
    }
    resetReconnectInterval();
  },

  isConnected: () => {
    return stompClient?.connected || false;
  },

  onConnect: (callback: () => void) => {
    onConnectCallbacks.push(callback);
  },

  offConnect: (callback: () => void) => {
    const index = onConnectCallbacks.indexOf(callback);
    if (index > -1) onConnectCallbacks.splice(index, 1);
  },

  onDisconnect: (callback: () => void) => {
    onDisconnectCallbacks.push(callback);
  },

  offDisconnect: (callback: () => void) => {
    const index = onDisconnectCallbacks.indexOf(callback);
    if (index > -1) onDisconnectCallbacks.splice(index, 1);
  },
};
