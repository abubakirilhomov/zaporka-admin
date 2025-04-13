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
import { MdOutlineInventory } from "react-icons/md";

const Sidebar = () => {
  const links = [
    {
      title: "Административная Панель",
      links: [
        {
          name: "Панель",
          route: "dashboard", // English route path
          icon: <FiShoppingBag />,
        },
      ],
    },
    {
      title: "Заказы",
      links: [
        {
          name: "Заказы",
          route: "orders", // English route path
          icon: <FiShoppingBag />,
        },
      ],
    },
    {
      title: "Пользователи",
      links: [
        {
          name: "Все-пользователи",
          route: "all-users", // English route path
          icon: <IoMdContacts />,
        },
        // Uncomment and update if needed
        // {
        //   name: "Клиенты",
        //   route: "customers",
        //   icon: <AiOutlineShoppingCart />,
        // },
        // {
        //   name: "Работники",
        //   route: "workers",
        //   icon: <RiContactsLine />,
        // },
      ],
    },
    {
      title: "Продукты",
      links: [
        {
          name: "Панель-продуктов",
          route: "products-dashboard", // English route path
          icon: <AiOutlineCalendar />,
        },
        {
          name: "Создать-продукт",
          route: "create-products", // English route path
          icon: <BsKanban />,
        },
      ],
    },
    {
      title: "Инвентаризация",
      links: [
        {
          name: "Приход",
          route: "inventory", // English route path (you may need to add this route in index.jsx)
          icon: <MdOutlineInventory />,
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
                    to={`/${link.route}`} // Use the English route path
                    key={link.name}
                    onClick={handleCloseSidebar}
                    className={({ isActive }) =>
                      isActive ? activeLink : normalLink
                    }
                  >
                    {link.icon}
                    <span className="capitalize">{link.name}</span> {/* Display the Russian name */}
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