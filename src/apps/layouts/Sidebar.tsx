import React from "react";

type Props = {
  collapsed: boolean;
  selected?: string;
  onSelect?: (key: string) => void;
};

const Sidebar: React.FC<Props> = ({ collapsed, selected, onSelect }) => {
  const items = ["Home", "Subjects", "Settings"];

  return (
    <nav
      className={`h-full flex flex-col ${collapsed ? "items-center" : "items-stretch"} p-3`}
    >
      {items.map((i) => {
        const active = selected === i;
        return (
          <div
            key={i}
            onClick={() => onSelect?.(i)}
            className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer ${active ? "bg-primary font-semibold" : "hover:bg-secondary"}`}
          >
            <div
              className={`w-6 h-6 rounded ${active ? "bg-secondary text-text-primary" : "bg-indigo-200 text-text-secondary"}`}
            />
            {!collapsed && <div className="font-medium">{i}</div>}
          </div>
        );
      })}
    </nav>
  );
};

export default Sidebar;
