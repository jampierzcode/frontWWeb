import React, { useState } from "react";
import SidebarAdmin from "./SidebarAdmin";

const LayoutAdmin = ({ children }) => {
  const [showMenu, setShowMenu] = useState(true);
  return (
    <div className="flex">
      <SidebarAdmin showMenu={showMenu} setShowMenu={setShowMenu} />
      <div className="w-full">
        <div className="w-full bg-gray-100 text-white p-2">LayoutAdmin</div>
        <div
          className={`${
            showMenu ? "ml-[300px]" : "mx-[96px]"
          } max-w-full p-[30px]`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default LayoutAdmin;
