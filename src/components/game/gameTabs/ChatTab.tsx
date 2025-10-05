import { usePlayerStatus } from "@/lib/contexts/PlayerStatusContext";
import { useProfile } from "@/lib/hooks/player/useProfile";
import { useState, useEffect, useRef } from "react";

const ChatTab: React.FC = () => {
  const { chatMessages, sendChatMessage, onlinePlayers } = usePlayerStatus();
  const { profile } = useProfile();
  const [message, setMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendChatMessage(message);
      setMessage("");
    }
  };

  const formatTime = (date: string | Date) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  
const myId = Number(profile?.id);
let opponentName = "Opponent";

if (onlinePlayers?.length) {
  opponentName = onlinePlayers.find(p => Number(p.id) !== myId)?.username ?? "Opponent";
} else if (chatMessages?.length) {
  const lastMsg = [...chatMessages].reverse().find(m => Number(m.from) !== myId);
  const refMsg = lastMsg ?? chatMessages[0];
  opponentName =
    Number(refMsg.from) === myId
      ? refMsg.toUsername || "Opponent"
      : refMsg.fromUsername || "Opponent";
}

  return (
    <div className="bg-indigo-600 shadow-2xl rounded-2xl p-2">
      <div className="flex flex-col h-full bg-slate-800/70 backdrop-blur-md rounded-xl overflow-hidden border border-slate-700">
        {/* Cabecera */}
        <div className="px-4 py-2 border-b border-slate-700 shadow-sm">
          <h2 className="text-lg font-semibold text-white">
            Chat with {opponentName}
          </h2>
        </div>

        <div className="flex-grow p-4 space-y-6 bg-slate-800/90 overflow-y-auto max-h-[400px] scrollbar-hidden">
          {chatMessages.map((chatMessage, index) => {
            const isMine = chatMessage.from === profile?.id;

            const sender = onlinePlayers.find(
              (p) => p.id == chatMessage.from
            );

            const profileImage = sender?.imageUrl || "/icon.png";
            const username = chatMessage.fromUsername;

            return (
              <div
                key={index}
                className={`flex items-start space-x-3 ${
                  isMine ? "justify-end space-x-reverse" : ""
                }`}
              >
                {!isMine && (
                  <img
                    src={profileImage}
                    alt={username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}

                <div className="max-w-xs">
                  <div
                    className={`rounded-2xl px-4 py-2 shadow-sm text-sm ${
                      isMine
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-slate-700 text-slate-300 rounded-bl-none"
                    }`}
                  >
                    <p className="font-semibold mb-1">{username}</p>
                    <p>{chatMessage.content}</p>
                  </div>
                  <span className="block mt-1 text-xs text-slate-400 text-right">
                    {formatTime(new Date())}
                  </span>
                </div>

                {isMine && (
                  <img
                    src={profile?.imageUrl || "/icon.png"}
                    alt={profile?.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
              </div>
            );
          })}

          <div ref={chatEndRef} />
        </div>

        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-slate-700 flex items-center space-x-2 bg-slate-800/70"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message…"
            className="w-full pl-10 pr-4 py-2 bg-slate-900/80 text-white rounded-xl border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-md transition-all"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatTab;
