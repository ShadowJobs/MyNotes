import { Result } from "@/services";
import axios from "@/utils/axios";
import cookie from "@/utils/cookie";

export type User = {
  user_id: number;
  user_name: string;
  token: string;
};

export type LoginParams = {
  username: string;
  password: string;
};

export type LogoutStatus = {
  status: boolean;
};

export type AdminInfo = {
  name: string;
  value: string | string[];
  sync: boolean;
};

const getUserFromCookie = (): User | null => {
  const { user_id, user_name, token } = cookie.getAll();

  if (!user_id || !user_name || !token) return null;

  return {
    user_id: Number(user_id),
    user_name,
    token
  };
};

const getUserFromLocalStorage = (): User | null => {
  const user = localStorage.getItem("user/info") ?? "null";
  return JSON.parse(user);
};

export const getUser = () => getUserFromCookie() ?? getUserFromLocalStorage();

export const login = (params: LoginParams) =>
axios.post<Result<User>>("/api/v1/login", params);