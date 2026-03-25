import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { mapAuthResponse } from "../api/auth";

/**
 * Landing page after the backend redirects back from Google OAuth.
 *
 * Backend redirects to this page with query params:
 *   /auth/callback?access_token=xxx&refresh_token=xxx&user=<json-encoded>
 *
 * Saves auth info to localStorage via AuthContext.login() then navigates to "/".
 */
export const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      // Build a plain object from all query params so mapAuthResponse can normalise it
      const raw: Record<string, any> = {};
      searchParams.forEach((value, key) => {
        try {
          // Backend may JSON-encode the user object as a query param value
          raw[key] = JSON.parse(decodeURIComponent(value));
        } catch {
          raw[key] = decodeURIComponent(value);
        }
      });

      const authData = mapAuthResponse(raw);

      if (!authData.accessToken) {
        throw new Error("No access token received from server.");
      }

      // Save accessToken, user, and optionally refreshToken to localStorage
      const refreshToken =
        raw.refresh_token ?? raw.refreshToken ?? authData.refreshToken;

      login(authData.accessToken, authData.user, refreshToken || undefined);
      navigate("/", { replace: true });
    } catch (err: any) {
      console.error("[AuthCallback] Error:", err);
      setError(err.message || "Authentication failed.");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-[oklch(15%_0.02_250)] text-white flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-red-400 text-lg">{error}</p>
          <button
            onClick={() => navigate("/login", { replace: true })}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition-all"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[oklch(15%_0.02_250)] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
};
