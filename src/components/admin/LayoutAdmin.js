import React from "react";
import SidebarAdmin from "./SidebarAdmin";

const LayoutAdmin = ({ children }) => {
  return (
    <div className="flex">
      <SidebarAdmin />
      <div className="ml-[400px] w-full p-[30px]">
        <div>LayoutAdmin</div>
        {children}
      </div>
    </div>
  );
};

export default LayoutAdmin;
