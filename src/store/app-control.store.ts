import { create } from "zustand";

export interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl: string;
  role: string;
}

export interface LoginData {
  atExpireAt?: Date;
  rtExpireAt?: Date;
  accessToken: string;
  refreshToken: string;
  user?: User;
}

export interface AppControlState {
  loginData?: LoginData;

  setLoginData: (loginData: LoginData) => void;
}

export const useAppControlStore = create<AppControlState>()((set) => ({
  loginData: undefined,

  setLoginData: (loginData) => set({ loginData }),
}));
