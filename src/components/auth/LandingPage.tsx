import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 text-foreground">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl px-8"
      >
        {/* Imagen */}
        <div className="flex justify-center md:justify-start w-full md:w-1/2">
          <img
            src="/icon.png"
            alt="Chess Icon"
            className="w-64 h-64 md:w-80 md:h-80"
          />
        </div>

        {/* Texto y botones */}
        <div className="flex flex-col items-center md:items-start w-full md:w-1/2 mt-8 md:mt-0 space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center md:text-left leading-snug">
            Play chess.<br />Improve your game.<br />Have fun!
          </h1>

          {/* Botón principal */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/register")}
            className="px-10 py-3 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-xl shadow-lg transition-all"
          >
            Get Started
          </motion.button>

          {/* Botones secundarios */}
          <div className="flex gap-4 mt-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/register")}
              className="px-6 py-2 bg-white text-sky-600 font-semibold rounded-xl shadow-md hover:bg-slate-100 transition-all"
            >
              Register
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/login")}
              className="px-6 py-2 bg-slate-800 text-sky-400 font-semibold rounded-xl shadow-md hover:bg-slate-700 transition-all"
            >
              Login
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
