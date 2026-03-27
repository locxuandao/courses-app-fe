import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { getTokens } from "../../utils/storage";
import SubjectsPage from "../pages/SubjectsPage";
import SettingPage from "../pages/SettingPage";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selected, setSelected] = useState<string>("Home");
  const tokens = getTokens();
  const user = {
    name: tokens?.user?.username,
    email: tokens?.user?.email,
    avatarUrl: tokens?.user?.avatarUrl,
  };

  const renderContent = () => {
    if (selected === "Home") return children;
    if (selected === "Subjects") return <SubjectsPage />;
    if (selected === "Settings") return <SettingPage />;
    return children;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <aside
        style={{ willChange: "width" }}
        className={`bg-white border-r transition-all duration-200 ${collapsed ? "w-20" : "w-64"}`}
      >
        <div
          className={
            collapsed
              ? "flex items-center justify-center p-3"
              : "flex items-center gap-3.5 p-3"
          }
          onClick={() => setCollapsed((s) => !s)}
        >
          <div className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-[11px] bg-primary shadow-[0_4px_14px_rgba(0,124,195,.3)]">
            <div className="h-5 w-5 rotate-15 rounded-[4px] border-[2.5px] border-white/85" />
          </div>
          <div
            className={`transition-all duration-200 ease-out overflow-hidden ${collapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-[240px]"}`}
          >
            <span className="font-playfair text-[1.4rem] tracking-tight text-text-primary whitespace-nowrap">
              Revise <span className="text-primary">Hou</span>
            </span>
          </div>
        </div>
        <Sidebar
          collapsed={collapsed}
          selected={selected}
          onSelect={setSelected}
        />
      </aside>

      <div className="flex-1 flex flex-col min-h-0">
        <Header
          onToggle={() => setCollapsed((s) => !s)}
          user={user}
          selected={selected}
        />
        <main className="flex-1 overflow-auto p-6 bg-secondary">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
