import axios from 'axios';
export const BACKEND_URL = 'https://chess-hub.up.railway.app/chess';

const javaAPI = axios.create({
    baseURL: BACKEND_URL,
});

const javaOauth = `${BACKEND_URL}/oauth2/authorization`;
export { javaAPI, javaOauth };
