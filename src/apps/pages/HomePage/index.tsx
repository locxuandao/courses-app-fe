import { LogOut } from "lucide-react";
import { useAppControlStore } from "../../../store/app-control.store";
import { removeItemFromStorage } from "../../../utils/storage";

const HomePage = () => {
  const loginData = useAppControlStore((state) => state.loginData);

  const handleLogout = () => {
    removeItemFromStorage("tokens");
    window.location.replace("/");
  };

  return (
    <div className="p-4 border-t border-[oklch(30%_0.02_250)]">
      <div className="flex items-center gap-3 px-4 py-3 mb-2">
        {loginData?.user?.avatarUrl ? (
          <img
            src={loginData?.user?.avatarUrl}
            className="w-10 h-10 rounded-full border border-blue-500/30 object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center  font-bold text-sm">
            {loginData?.user?.username?.charAt(0) || "?"}
          </div>
        )}
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-semibold truncate">
            {loginData?.user?.username}
          </p>
          <p className="text-[10px] text-[oklch(60%_0.02_250)] truncate uppercase tracking-wider">
            {(() => {
              const role = loginData?.user?.role as any;
              if (!role) return "";
              return typeof role === "string"
                ? role
                : (role.name ?? JSON.stringify(role));
            })()}
          </p>
          <p className="text-xs text-[oklch(60%_0.02_250)] truncate mt-0.5">
            {loginData?.user?.email}
          </p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Logout</span>
      </button>
    </div>
  );
};
export default HomePage;
