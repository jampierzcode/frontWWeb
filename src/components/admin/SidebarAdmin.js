import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";

import { HiHome } from "react-icons/hi";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdWifi } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { BsRobot } from "react-icons/bs";

const SidebarAdmin = ({ showMenu, setShowMenu }) => {
  const { user, logout } = useContext(AuthContext);

  const menu = [
    {
      title: "Dashboard",
      icon: <HiHome className={`text-xl ${showMenu ? "w-max" : "wfull"}`} />,
      url: "/dashboard",
    },
    {
      title: (
        <div className="flex items-center gap-2">
          WhatsAppBot BsRobot{" "}
          <MdWifi className={`text-xl ${showMenu ? "w-max" : "wfull"}`} />
        </div>
      ),
      // icon: <MdWifi className={`text-xl ${showMenu ? "w-max" : "wfull"}`} />,
      icon: <BsRobot className={`text-xl ${showMenu ? "w-max" : "wfull"}`} />,
      url: "/bot",
    },
    {
      title: "Clientes",
      icon: <FiUser className={`text-xl ${showMenu ? "w-max" : "wfull"}`} />,
      url: "/clientes",
    },
  ];
  const handlerMenu = () => {
    setShowMenu(!showMenu);
  };
  return (
    <div
      className={`${
        showMenu ? "max-w-[300px]" : "max-w-[96px]"
      } w-full bg-main shadow h-svh absolute`}
    >
      <div id="header" className="py-14">
        <div className="flex gap-4 justify-beetween items-center relative px-6">
          <img
            className={`${
              showMenu ? "w-10 h-10" : "w-5 h-5"
            } p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500`}
            src="https://static.vecteezy.com/system/resources/previews/019/896/008/original/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png"
            alt="Bordered avatar"
          />
          <div className={`${showMenu ? "flex flex-col" : "hidden"}`}>
            <h1 className="text-white font-bold mt-1 text-sm">
              {user?.nombres}
            </h1>
            <span className="text-white my-2 text-xs">{user?.email}</span>
          </div>
          <button
            onClick={handlerMenu}
            className="absolute top-1/2 -translate-y-1/2 p-2 rounded-l-2xl bg-green-600 text-white right-0"
          >
            {showMenu ? <FaArrowLeft /> : <FaArrowRight />}
          </button>
        </div>
      </div>
      <div id="body"></div>
      <ul className="px-6 gap-1 flex flex-col">
        {menu.map((m, index) => {
          return (
            <Link key={index} to={m.url} className="p-2">
              <li className="w-full flex gap-6 items-center text-white text-sm">
                {m.icon}
                <span className={`${showMenu ? "block" : "hidden"}`}>
                  {m.title}
                </span>
              </li>
            </Link>
          );
        })}
        <button
          onClick={() => logout()}
          className="rounded-full p-2 mt-2 text-white  text-sm border border-white font-bold"
        >
          Cerrar Sesion
        </button>
      </ul>
    </div>
  );
};

export default SidebarAdmin;
