import axios from "axios";
const BACKEND_URL = "http://localhost:1788/chess";

const javaAPI = axios.create({
  baseURL: BACKEND_URL,
});

const javaOauth = `${BACKEND_URL}/oauth2/authorization`;
export { javaAPI, javaOauth };