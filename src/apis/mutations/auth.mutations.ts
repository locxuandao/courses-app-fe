import { useMutation } from "@tanstack/react-query";
import { http } from "../http";
import type { LoginData } from "../../store/app-control.store";

export const useGoogleLogin = () => {
  return useMutation({
    mutationFn: async (): Promise<LoginData> => {
      const response = await http.get("/auth/google");
      return response.data;
    },
  });
};
