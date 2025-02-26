import React from "react";
import { Link, NavLink } from "react-router-dom";
import { SiShopware } from "react-icons/si";
import { MdOutlineCancel } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

import { useStateContext } from "../Contexts/ContextProvider";
import { FiShoppingBag } from "react-icons/fi";
import { IoMdContacts } from "react-icons/io";
import { AiOutlineCalendar, AiOutlineShoppingCart, AiOutlineStock } from "react-icons/ai";
import { RiContactsLine } from "react-icons/ri";
import { BsKanban } from "react-icons/bs";

const Sidebar = () => {
  const links = [
    {
      title: "Dashboard",
      links: [
        {
          name: "dashboard",
          icon: <FiShoppingBag />,
        },
      ],
    },
    {
      title: "Orders",
      links: [
        {
          name: "orders",
          icon: <FiShoppingBag />,
        },
      ],
    },
    {
      title: "Users",
      links: [
        {
          name: "all-users",
          icon: <IoMdContacts />,
        },
        {
          name: "customers",
          icon: <AiOutlineShoppingCart />,
        },
        {
          name: "workers",
          icon: <RiContactsLine />,
        },
      ],
    },
    {
      title: "Products",
      links: [
        {
          name: "products-dashboard",
          icon: <AiOutlineCalendar />,
        },
        {
          name: "create-products",
          icon: <BsKanban />,
        },
      ],
    },
    {
      title: "Reviews",
      links: [
        {
          name: "reviews",
          icon: <AiOutlineStock />,
        },
      ],
    },
  ];

  const { activeMenu, setActiveMenu, screenSize } = useStateContext();

  const handleCloseSidebar = () => {
    if (activeMenu && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg bg-primary text-white hover:bg-primary-focus text-md m-2";
  const normalLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-base-content hover:bg-base-300 text-md m-2";

  return (
    <div className="ml-3 h-screen overflow-auto md:overflow-auto pb-10 bg-base-100">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link
              to="/"
              onClick={handleCloseSidebar}
              className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight text-base-content"
            >
              <div className="max-w-[60%]">
                <img src="/images/logo.png" alt="zaporka" />
              </div>
            </Link>
            <TooltipComponent content="Menu" position="BottomCenter">
              <button
                type="button"
                onClick={() => setActiveMenu(!activeMenu)}
                className="text-xl rounded-full p-3 hover:bg-base-300 text-base-content mt-4 block md:hidden"
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>
          <div className="mt-10">
            {links.map((item) => (
              <div key={item.title}>
                <p className="m-3 mt-4 uppercase text-base-content">
                  {item.title}
                </p>
                {item.links.map((link) => (
                  <NavLink
                    to={`/${link.name}`}
                    key={link.name}
                    onClick={handleCloseSidebar}
                    className={({ isActive }) =>
                      isActive ? activeLink : normalLink
                    }
                  >
                    {link.icon}
                    <span className="capitalize">{link.name}</span>
                  </NavLink>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;