import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { api, unwrap } from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser =
        localStorage.getItem("splitpay_user");

      return storedUser
        ? JSON.parse(storedUser)
        : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() =>
    localStorage.getItem("splitpay_token")
  );

  const saveAuth = (data) => {
    if (!data?.token) {
      throw new Error(
        "Authentication token was not returned by the server."
      );
    }

    localStorage.setItem(
      "splitpay_token",
      data.token
    );

    localStorage.setItem(
      "splitpay_user",
      JSON.stringify(data)
    );

    setToken(data.token);
    setUser(data);
  };

  const login = async (data) => {
    const response = await api.post(
      "/auth/login",
      data
    );

    const result = unwrap(response);

    saveAuth(result);

    return result;
  };

  const register = async (data) => {
    const response = await api.post(
      "/auth/register",
      data
    );

    const result = unwrap(response);

    saveAuth(result);

    return result;
  };

  const logout = () => {
    localStorage.removeItem("splitpay_token");
    localStorage.removeItem("splitpay_user");

    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    api
      .get("/auth/me")
      .then((response) => {
        const currentUser = unwrap(response);

        setUser(currentUser);

        localStorage.setItem(
          "splitpay_user",
          JSON.stringify(currentUser)
        );
      })
      .catch(() => {
        localStorage.removeItem(
          "splitpay_token"
        );

        localStorage.removeItem(
          "splitpay_user"
        );

        setToken(null);
        setUser(null);
      });
  }, [token]);

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: Boolean(token),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}