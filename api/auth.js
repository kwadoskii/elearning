import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";

import api from "./base";

const tokenKey = "token";

const loginApi = async (username, password) => api.post("/auth/login", { username, password });

const logoutApi = async (token) =>
  api.get("/logout", { headers: { Authorization: `Bearer ${token}` } });

const loginWithToken = (token) => Cookies.set(tokenKey, token);

const logout = () => Cookies.remove(tokenKey);

function getToken() {
  return Cookies.get(tokenKey);
}

const validToken = (token) => {
  token = token || Cookies.get(tokenKey);

  if (!token) return null;

  try {
    const { exp, ...decoded } = jwtDecode(token);

    if (Date.now() >= exp * 1000) return null;

    return decoded;
  } catch (err) {
    return null;
  }
};

const signUp = async (data) => api.post("/auth/signup", { ...data });

export { getToken, loginApi, logoutApi, loginWithToken, logout, validToken, signUp };
