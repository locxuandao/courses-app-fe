import React from "react";
import { Menu } from "lucide-react";

type Props = {
  selected?: string;
  onToggle: () => void;
  user?: { name?: string; email?: string; avatarUrl?: string } | null;
};

const Header: React.FC<Props> = ({ selected, onToggle, user }) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
      <div className="flex items-center gap-2">
        <button onClick={onToggle} className="p-2 rounded hover:bg-gray-100">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">{selected}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-sm font-medium">{user?.name ?? "User Name"}</div>
          <div className="text-xs text-gray-500 truncate max-w-[200px]">
            {user?.email ?? "user@example.com"}
          </div>
        </div>

        <img
          src={user?.avatarUrl}
          className="w-10 h-10 rounded-full border border-blue-500/30 object-cover"
        />
      </div>
    </div>
  );
};

export default Header;
