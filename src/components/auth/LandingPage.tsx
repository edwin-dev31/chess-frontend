import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Home, Puzzle, BookOpen, Play } from "lucide-react"; // solo ejemplo de íconos

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/30 backdrop-blur-md flex flex-col p-4 justify-between border-r border-slate-700">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <img src="/logo.png" alt="Logo" className="w-8 h-8" />
            <span className="font-bold text-xl">Chess</span>
          </div>
          <nav className="flex flex-col gap-4">
            <button className="flex items-center gap-2 hover:text-indigo-400">
              <Play size={20} /> Play
            </button>
            <button className="flex items-center gap-2 hover:text-indigo-400">
              <Puzzle size={20} /> Puzzles
            </button>
            <button className="flex items-center gap-2 hover:text-indigo-400">
              <BookOpen size={20} /> Learn
            </button>
            <button className="flex items-center gap-2 hover:text-indigo-400">
              <Home size={20} /> News
            </button>
          </nav>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => navigate("/register")}
            className="bg-indigo-600 hover:bg-indigo-500 py-2 rounded-xl font-semibold"
          >
            Sign Up
          </button>
          <button
            onClick={() => navigate("/login")}
            className="bg-slate-700 hover:bg-slate-600 py-2 rounded-xl font-semibold"
          >
            Log In
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center gap-12"
        >
          <img
            src="/icon.png"
            alt="Chess Icon"
            className="w-64 h-64 md:w-80 md:h-80"
          />

          <div className="text-center md:text-left space-y-6">
            <h1 className="text-4xl font-bold leading-snug">
              Play chess.
              <br />
              Improve your game.
              <br />
              Have fun!
            </h1>

            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/register")}
              className="px-10 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-lg font-semibold shadow-lg"
            >
              Get Started
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
