import { getTokens } from "../../../utils/storage";
import HomePage from "../HomePage";
import LoginPage from "../LoginPage";

export const Guards = () => {
  const tokens = getTokens();

  if (tokens?.error === "null") return <LoginPage />;

  return <HomePage />;
};
