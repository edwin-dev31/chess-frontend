import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { BACKEND_URL } from '../../axios';

let stompClient: Stomp.Client | null = null;
let isConnected = false;
let activeSubscribers = 0;

export const socketHelper = {
  connect: (onConnect?: () => void) => {
    if (isConnected) return; // evita reconectar

    const socket = new SockJS(`${BACKEND_URL}/ws`);
    stompClient = Stomp.over(socket);
    const token = localStorage.getItem('token');

    stompClient.connect(
      { Authorization: `Bearer ${token}` },
      () => {
        isConnected = true;
        if (onConnect) onConnect();
      }
    );
  },

  subscribe: (topic: string, callback: (msg: any) => void) => {
    if (!stompClient || !isConnected) return;
    activeSubscribers++;

    const subscription = stompClient.subscribe(topic, (msg) => {
      callback(JSON.parse(msg.body));
    });

    // devolver función para desuscribirse
    return () => {
      subscription.unsubscribe();
      activeSubscribers--;
    };
  },

  send: (destination: string, body: any, headers: Stomp.Headers = {}) => {
    if (!stompClient || !isConnected) return;
    const token = localStorage.getItem('token');
    stompClient.send(destination, { Authorization: `Bearer ${token}`, ...headers }, JSON.stringify(body));
  },

  disconnect: () => {
    if (!isConnected) return;
    // solo desconectar si no hay suscriptores activos
    if (activeSubscribers === 0) {
      stompClient?.disconnect(() => {
        console.log('🔌 Disconnected');
        isConnected = false;
      });
      stompClient = null;
    } else {
      console.log('⚠️ Hay suscriptores activos, no desconectando');
    }
  },
};
