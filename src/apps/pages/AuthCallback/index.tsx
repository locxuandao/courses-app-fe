import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useAppControlStore,
  type LoginData,
} from "../../../store/app-control.store";
import { setTokens } from "../../../utils/storage";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setLoginData = useAppControlStore((state) => state.setLoginData);

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");
    const userStr = searchParams.get("user");

    if (accessToken && refreshToken && userStr) {
      try {
        const user = JSON.parse(userStr);
        const loginData: LoginData = {
          accessToken,
          refreshToken,
          user,
        };

        setTokens(loginData);
        navigate("/");
      } catch (error) {
        console.error("Failed to parse user data", error);
        navigate("/?error=auth_failed");
      }
    } else {
      navigate("/?error=missing_tokens");
    }
  }, [searchParams, setLoginData, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
        <p className="text-text-primary font-medium">Đang xác thực...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
