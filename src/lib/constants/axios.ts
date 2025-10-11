import axios from 'axios';
export const BACKEND_URL = 'https://localhost:8443/chess';

const javaAPI = axios.create({
    baseURL: BACKEND_URL,
});

const javaOauth = `${BACKEND_URL}/oauth2/authorization`;
export { javaAPI, javaOauth };
