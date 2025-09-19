# Plan de Implementación: Almacenamiento de Color del Jugador vía WebSockets

## 1. Objetivo

El objetivo de esta tarea es implementar la lógica necesaria para que, al iniciar una partida de ajedrez, el color asignado a cada jugador (blanco o negro) por el backend sea recibido a través de una conexión WebSocket y almacenado de forma persistente en el `localStorage` del navegador de cada jugador.

Esto permitirá que la interfaz de usuario pueda consultar el color del jugador en cualquier momento para renderizar componentes o aplicar lógicas específicas sin necesidad de solicitar esta información repetidamente.

## 2. Arquitectura y Flujo de Datos

El flujo de datos completo para esta funcionalidad es el siguiente:

1.  **Inicio de la Acción (Frontend):**
    *   Un jugador (Jugador A) hace clic en el botón "Start Game" dentro del componente `PlayTab.tsx`.
    *   Esta acción invoca la función `startGame`, probablemente gestionada por el hook `useStartGame.ts`.
    *   El hook `useStartGame` realiza una llamada `POST` a la API del backend, al endpoint `/{id}/start`.

2.  **Procesamiento (Backend):**
    *   El backend recibe la solicitud para iniciar la partida.
    *   El `gameService` asigna los colores a cada jugador (Jugador A y Jugador B).
    *   El `messagingTemplate` de Spring Boot envía dos mensajes privados a través de WebSocket:
        *   Un mensaje al **Jugador A** con el payload `Color.WHITE` al tópico `/queue/start`.
        *   Un mensaje al **Jugador B** con el payload `Color.BLACK` al mismo tópico `/queue/start`.

3.  **Recepción y Almacenamiento (Frontend):**
    *   En el frontend de **ambos jugadores**, el hook `useGameStartSocket.ts` está escuchando activamente en el tópico `/user/queue/start`.
    *   Al recibir el mensaje, el callback de la suscripción se activa.
    *   Este callback extraerá el color (`"WHITE"` o `"BLACK"`) del cuerpo del mensaje.
    *   Finalmente, invocará una función del hook `useColorStorage.ts` para guardar este valor en el `localStorage` del navegador.

## 3. Plan de Acción Detallado

Para llevar a cabo la implementación, seguiremos estos pasos:

### Paso 1: Análisis y Diagnóstico del Código Actual

Antes de modificar cualquier archivo, es crucial entender la estructura existente para asegurar una integración limpia y eficiente.

*   **Acción:** Leer y analizar los siguientes archivos:
    1.  **`src/lib/hooks/useSocket/useGameStartSocket.ts`**:
        *   **Propósito:** Entender cómo se gestiona la conexión STOMP/WebSocket. Se verificará si ya existe una suscripción al tópico `/user/queue/start` y qué hace el callback actual al recibir un mensaje. Este es el punto central de nuestra modificación.
    2.  **`src/lib/hooks/useColorStorage.ts`**:
        *   **Propósito:** Identificar la función exacta que debemos usar para guardar el color. Se espera encontrar una función exportada como `setColor` o `saveColor` que acepte un string como parámetro.

### Paso 2: Implementación de la Lógica de Almacenamiento

La modificación principal se realizará en el hook responsable de la comunicación WebSocket para el inicio del juego.

*   **Archivo a Modificar:** `src/lib/hooks/useSocket/useGameStartSocket.ts`

*   **Acciones de Implementación:**

    1.  **Importar `useColorStorage`**: Añadir la siguiente línea al inicio del archivo para tener acceso al hook de almacenamiento:
        ```typescript
        import { useColorStorage } from '''@/lib/hooks/useColorStorage''';
        ```

    2.  **Instanciar el Hook**: Dentro de la función principal `useGameStartSocket`, obtener la función para guardar el color:
        ```typescript
        const { setColor } = useColorStorage();
        ```

    3.  **Actualizar el Callback de la Suscripción**: Localizar el bloque de código donde se realiza la suscripción al tópico. Se verá similar a esto:
        ```typescript
        stompClient.subscribe(`/user/queue/start`, (message) => {
            // Lógica actual (si existe)
        });
        ```

    4.  **Implementar la Nueva Lógica**: Modificar el cuerpo del callback para procesar el mensaje y guardar el color.

        *   **Antes:**
          ```typescript
          // Ejemplo de cómo podría estar ahora
          stompClient.subscribe(`/user/queue/start`, (message) => {
              console.log('Game start message received:', message);
          });
          ```

        *   **Después:**
          ```typescript
          stompClient.subscribe(`/user/queue/start`, (message) => {
              const color = message.body;
              if (color && (color === 'WHITE' || color === 'BLACK')) {
                  console.log(`Color asignado por el servidor: ${color}. Guardando en localStorage...`);
                  setColor(color);
              } else {
                  console.error('Mensaje de inicio de juego recibido con formato inesperado:', message);
              }
          });
          ```

### Paso 3: Guía de Verificación

Una vez completada la implementación, es fundamental verificar que la funcionalidad opera correctamente para ambos jugadores.

*   **Procedimiento de Prueba:**

    1.  **Entorno:** Asegúrate de que tanto el servidor backend como el de desarrollo de frontend (`npm run dev`) estén en ejecución.
    2.  **Simular Jugadores:** Abre dos ventanas de navegador (ej. una normal y una en modo incógnito) para simular al Jugador A y al Jugador B.
    3.  **Inicio de Sesión:** Inicia sesión con dos cuentas de usuario diferentes y navega a la misma sala de juego en ambas ventanas.
    4.  **Herramientas de Desarrollador:** En ambas ventanas, abre las Herramientas de Desarrollador (F12) y ve a la pestaña **Application** (en Chrome/Edge) o **Storage** (en Firefox).
    5.  **Observar `localStorage`**: En el panel izquierdo, expande la sección `Local Storage` y selecciona la URL de tu aplicación (ej. `http://localhost:5173`).
    6.  **Iniciar Partida:** En una de las dos ventanas, haz clic en el botón **"Start Game"**.
    7.  **Verificar Resultado:**
        *   **Inmediatamente**, observa el `localStorage` en ambas ventanas.
        *   **Ventana 1 (Iniciador):** Debería aparecer una clave (ej. `player-color`) con el valor `"WHITE"` (o `"BLACK"`).
        *   **Ventana 2 (Oponente):** Debería aparecer la misma clave con el color opuesto (`"BLACK"` o `"WHITE"`).
