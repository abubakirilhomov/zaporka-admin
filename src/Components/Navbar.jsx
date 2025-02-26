import React, { useEffect } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { RiNotification3Line } from 'react-icons/ri';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import avatar from '../images/avatar2.png';
import { Notification, UserProfile } from '.';
import { useStateContext } from '../Contexts/ContextProvider';
import { useSelector } from 'react-redux';

const NavButton = ({ title, customFunc, icon, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={() => customFunc()}
      className="relative text-xl rounded-full p-3 text-base-content hover:bg-base-300"
    >
      <span
        style={{ background: dotColor }} // Kept inline style for dotColor as it's specific
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </TooltipComponent>
);

const Navbar = () => {
  const { activeMenu, setActiveMenu, handleClick, isClicked, setScreenSize, screenSize } = useStateContext();
  const username = useSelector((state) => state.auth.user.username)

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [setScreenSize]);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize, setActiveMenu]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  return (
    <div className="flex justify-between w-full p-1 md:ml-6 md:mr-6 relative">
      <NavButton
        title="Menu"
        customFunc={handleActiveMenu}
        icon={<AiOutlineMenu />}
      />
      <div className="flex">
        <NavButton
          title="Notification"
          dotColor="rgb(254, 201, 15)" // Specific dot color retained
          icon={<RiNotification3Line />}
        />
        <TooltipComponent content="Profile" position="BottomCenter">
          <div
            className="flex items-center gap-2 cursor-pointer p-1 hover:bg-base-300 rounded-lg"
            onClick={() => handleClick('userProfile')}
          >
            <img
              className="rounded-full w-12"
              src={avatar}
              alt="user-profile"
            />
            <p>
              <span className="text-base-content text-14">Hi,</span>{' '}
              <span className="text-base-content font-bold ml-1 text-14">
                {username}
              </span>
            </p>
            <MdKeyboardArrowDown className="text-base-content text-14" />
          </div>
        </TooltipComponent>
      </div>
    </div>
  );
};

export default Navbar;