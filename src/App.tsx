import { Route, Routes } from "react-router-dom";
import { Guards } from "./apps/pages/Guards";
import AuthCallback from "./apps/pages/AuthCallback";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Guards />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
    </Routes>
  );
}
