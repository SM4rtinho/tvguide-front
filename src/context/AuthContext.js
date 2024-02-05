import React, { createContext, useState, useEffect, useContext } from "react";
import { api } from "../api/ApiServices";
import { axiosConfig, setupAxios } from "../api/setupAxios";

export const UserContext = createContext({
  token: "",
  user: {},
  me: () => {},
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const me = (dataToken) => {
    saveTokenToLocalStorage(dataToken);
    async function fetchData() {
      try {
        const response = await api.getMe();

        setUser(response.data);
      } catch (error) {
        console.error(error);
        logout();
      }
    }
    fetchData();
  };

  const saveTokenToLocalStorage = (token) => {
    localStorage.setItem("token", token);
  };

  const getTokenFromLocalStorage = () => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    }
  };

  useEffect(() => {
    getTokenFromLocalStorage();
  }, []);

  const login = (token) => {
    setToken(token);
    saveTokenToLocalStorage(token);
    me(token);

    // window.location.reload(false);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const userContextValue = {
    token,
    user,
    me,
    login,
    logout,
  };

  return (
    <UserContext.Provider value={userContextValue}>
      {children}
    </UserContext.Provider>
  );
};
