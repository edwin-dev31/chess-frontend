import { useMemo } from "react";

export function useAuthStorage() {
  const token = localStorage.getItem("token");

  const authHeaders = useMemo(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  const clearAuth = () => {
    localStorage.clear();
  };

  const setAuth = (token: string) => {
    localStorage.setItem("token", token);
  };

  return {
    token,
    authHeaders,
    clearAuth,
    setAuth,
  };
}
