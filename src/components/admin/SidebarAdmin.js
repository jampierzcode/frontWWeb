import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";
import { MdAssessment, MdDashboard } from "react-icons/md";

const SidebarAdmin = () => {
  const { user, logout } = useContext(AuthContext);

  const menu = [
    {
      title: "Dashboard",
      icon: <MdDashboard />,
      url: "/dashboard",
    },
    {
      title: "WhatsappBot",
      icon: <MdAssessment />,
      url: "/bot",
    },
  ];
  console.log(user);
  return (
    <div className="max-w-[400px] w-full bg-white shadow h-svh absolute">
      <div id="header" className="py-14">
        <div className="flex flex-col justify-center items-center">
          <img
            className="w-14"
            src="https://static.vecteezy.com/system/resources/previews/019/896/008/original/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png"
            alt="avatar-user"
          />
          <h1 className="text-gray-800 font-bold mt-1">{user?.nombres}</h1>
          <span className="text-gray-800 my-2">{user?.email}</span>
        </div>
      </div>
      <div id="body"></div>
      <ul className="px-6 gap-1 flex flex-col">
        {menu.map((m, index) => {
          return (
            <Link key={index} to={m.url} className="p-2">
              <li className="w-full flex gap-3 items-center">
                {m.icon} {m.title}
              </li>
            </Link>
          );
        })}
        <button
          onClick={() => logout()}
          className="bg-white text-green-800 font-bold"
        >
          Cerrar Sesion
        </button>
      </ul>
    </div>
  );
};

export default SidebarAdmin;
