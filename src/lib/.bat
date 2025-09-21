@echo off
REM === Crear carpetas destino si no existen ===
mkdir hooks\common
mkdir hooks\auth
mkdir hooks\game
mkdir hooks\invitation
mkdir hooks\settings
mkdir hooks\socket

REM === Mover hooks comunes ===
move /Y hooks\useColorStorage.ts hooks\common\
REM Si tuvieras useLocalStorage.ts también:
REM move /Y hooks\useLocalStorage.ts hooks\common\

REM === Auth ===
move /Y hooks\useAuth.ts hooks\auth\
move /Y hooks\useAuthStorage.ts hooks\auth\
move /Y hooks\usePlayerProfile.ts hooks\auth\

REM === Game ===
move /Y hooks\useChessGame.ts hooks\game\
move /Y hooks\useGameHistory.ts hooks\game\
move /Y hooks\useStartGame.ts hooks\game\

REM === Invitation ===
move /Y hooks\invitation\useInvitation.ts hooks\invitation\
REM ya está dentro de invitation, por si acaso:
move /Y hooks\useNotificationsSocket.ts hooks\invitation\

REM === Settings ===
move /Y hooks\useSettings.ts hooks\settings\

REM === Socket ===
move /Y hooks\useChessSocket.ts hooks\socket\
move /Y hooks\useGameStartSocket.ts hooks\socket\
move /Y hooks\index.ts hooks\socket\
move /Y hooks\color.ts hooks\socket\useSocketColor.ts
move /Y hooks\fen.ts hooks\socket\useSocketFen.ts
move /Y hooks\moves.ts hooks\socket\useSocketMoves.ts
move /Y hooks\notifications.ts hooks\socket\useSocketNotifications.ts

echo.
echo ====== Archivos movidos correctamente ======
pause
