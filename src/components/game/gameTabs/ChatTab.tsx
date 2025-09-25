import { usePlayerStatus } from "@/lib/contexts/PlayerStatusContext";
import { useProfile } from "@/lib/hooks/player/useProfile";
import { useState } from "react";

const ChatTab: React.FC = () => {
  const { chatMessages, sendChatMessage, onlinePlayers } = usePlayerStatus();
  const { profile } = useProfile();
  const [message, setMessage] = useState("");

  const opponent = onlinePlayers.find((p) => p.id !== profile?.id);

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

  return (
    <div className="bg-indigo-600 shadow-2xl rounded-2xl p-2">
      <div className="flex flex-col h-full bg-slate-800/70 backdrop-blur-md rounded-xl overflow-hidden border border-slate-700">
        {/* Cabecera */}
        <div className="px-4 py-2 border-b border-slate-700 shadow-sm">
          <h2 className="text-lg font-semibold text-white">
            Chat with {opponent?.username || "Opponent"}
          </h2>
        </div>

        {/* Lista de mensajes con fondo igual al panel */}
        <div className="flex-grow p-4 overflow-y-auto space-y-6 bg-slate-800/90">
          {chatMessages.map((chatMessage, index) => {
            const isMine = chatMessage.from === profile?.id;
            const user = isMine ? profile : opponent;

            return (
              <div
                key={index}
                className={`flex items-start space-x-3 ${
                  isMine ? "justify-end space-x-reverse" : ""
                }`}
              >
                {!isMine && (
                  <img
                    src={user?.profileImage || "/icon.png"}
                    alt={user?.username}
                    className="w-8 h-8 rounded-full"
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
                    <p className="font-semibold mb-1">{user?.username}</p>
                    <p>{chatMessage.content}</p>
                  </div>
                  <span className="block mt-1 text-xs text-slate-400 text-right">
                    {formatTime(new Date())}
                  </span>
                </div>

                {isMine && (
                  <img
                    src={user?.profileImage || "/icon.png"}
                    alt={user?.username}
                    className="w-8 h-8 rounded-full"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Input */}
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
