import SockJS from "sockjs-client";
import Stomp from "stompjs";

let stompClient: Stomp.Client | null = null;

export const socketHelper = {
  connect: (onConnect?: () => void, onError?: (err: any) => void) => {
    const socket = new SockJS("http://localhost:1788/chess/ws");
    stompClient = Stomp.over(socket);

    const token = localStorage.getItem("token");

    console.log("token", token)
  //  console.warn("Attempting to connect to WebSocket...");
    stompClient.connect(
      {
        Authorization: `Bearer ${token}`, 
      },
      () => {
      //  console.log("✅ Connected to WebSocket");
        if (onConnect) onConnect();
      },
      (err) => {
       // console.error("❌ WebSocket error", err);
        if (onError) onError(err);
      }
    );
  },

disconnect: () => {
  if (stompClient && stompClient.connected) {
    stompClient.disconnect(() => console.log("🔌 Disconnected"));
  } else {
   // console.log("⚠️ stompClient not connected, skip disconnect");
  }
  stompClient = null;
},

subscribe: (topic: string, callback: (message: any) => void) => {
  if (!stompClient || !stompClient.connected) {
    //console.warn("⚠️ stompClient not ready for subscribe");
    return;
  }
  stompClient.subscribe(topic, (msg) => {
    callback(JSON.parse(msg.body));
  });
},

send: (destination: string, body: any, headers: Stomp.Headers = {}) => {
  if (!stompClient || !stompClient.connected) {
    return;
  }
  const token = localStorage.getItem("token");
  stompClient.send(
    destination,
    { Authorization: `Bearer ${token}`, ...headers },
    JSON.stringify(body)
  );
},


};
