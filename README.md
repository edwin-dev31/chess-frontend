<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/STOMP-WebSocket-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="WebSocket">
  <img src="https://img.shields.io/badge/MIT-License-green?style=for-the-badge" alt="MIT License">
</p>

# 🎟 Chess Frontend

A modern web-based chess application that lets you play real-time chess against other players. Built with **React 19** and **Vite**, it connects to the backend via **STOMP WebSockets** for live gameplay.

## 🊨 Features

| Feature | Description |
|---------|--------------|
| **Real-Time Play** | Live chess games via WebSocket communication |
| **Move History** | Full move log with algebraic notation |
| **Player Info** | See opponent details and game status |
| **Game Controls** | Resign, draw offers, and more |
| **Responsive UI** | Works on desktop and mobile |
| **Modern Design** | Tailwind CSS + Radix UI + Framer Motion |

## 🛨 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework |
| **TypeScript** | Type-safe JavaScript |
| **Vite 6** | Build tool & dev server |
| **Tailwind CSS 4** | Utility-first styling |
| **Radix UI** | Accessible headless components |
| **Framer Motion** | Declarative animations |
| **Lucide React** | Icon library |
| **SockJS + STOMP.js** | WebSocket communication |
| **Axios** | REST API client |

## 📁 Folder Structure

```
src/
├── components/
│   ├── chess/       # Chess board & pieces
│   ├── game/        # Game logic & controls
│   ├── layout/      # Layout components
│   ├── player/      # Player info & profiles
│   ├── settings/    # Settings panels
│   └── ui/          # Reusable UI primitives
├── data/            # Mock & static data
├── hooks/           # Custom React hooks
└── lib/             # Utility functions
```

## 📋 Prerequisites

- Node.js 18+
- npm / pnpm / yarn

## ⚙️ Getting Started

### 1. Clone & install

```bash
git clone https://github.com/edwin-dev31/chess-frontend.git
cd chess-frontend
npm install
```

### 2. Run development server

```bash
npm run dev
```

The app will open at **`http://localhost:5173`**.

### 3. Connect to backend

Make sure [chess-backend](https://github.com/edwin-dev31/chess-backend) is running for full real-time functionality.

## 🌐 Backend

This frontend connects to the [**Chess Backend**](https://github.com/edwin-dev31/chess-backend) — a Spring Boot 3 API with WebSocket support, JWT auth, and PostgreSQL (fully functional gameplay requires both running).

## 🔄 License

Distributed under the **MIT Licenee**. See [LICENSE](./LICENSE) for more information.

---

<p align="center">
  <a href="https://github.com/edwin-dev31/chess-frontend/issues">Report a bug</a> .·
  <a href="https://github.com/edwin-dev31/chess-frontend/pulls">Request a feature</a>
</p>
