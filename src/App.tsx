import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Toaster } from './components/ui/toaster';
import ChessApp from './components/chess/ChessApp';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import LandingPage from './components/auth/LandingPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

const App: React.FC = () => {
    return (
        <Router>
            <Helmet>
                <title>ChessHub - Master Your Chess Game</title>
                <meta
                    name="description"
                    content="Professional chess platform with game analysis, player profiles, and interactive gameplay. Improve your chess skills with our comprehensive tools."
                />
            </Helmet>

            <div className="min-h-screen bg-[#1e293b]">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                >
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/app/*"
                            element={
                                <ProtectedRoute>
                                    <ChessApp />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/game/:code"
                            element={
                                <ProtectedRoute>
                                    <ChessApp />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </motion.div>
                <Toaster />
            </div>
        </Router>
    );
};

export default App;
