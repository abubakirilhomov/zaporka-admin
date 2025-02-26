import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Navbar, Footer, Sidebar, ThemeSettings } from './Components';
import './App.css';

import { useStateContext } from './Contexts/ContextProvider';
import { ToastContainer } from 'react-toastify';

const App = () => {
  const { setCurrentMode, currentMode, activeMenu, themeSettings, setThemeSettings } = useStateContext();

  useEffect(() => {
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeMode) {
      setCurrentMode(currentThemeMode);
    }
  }, [setCurrentMode]);

  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex relative">
        <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
          <TooltipComponent content="Settings" position="Top">
            <button
              type="button"
              onClick={() => setThemeSettings(true)}
              className="text-3xl p-3 hover:drop-shadow-xl bg-primary text-white rounded-full"
            >
              <FiSettings />
            </button>
          </TooltipComponent>
        </div>
        {activeMenu ? (
          <div className="w-72 fixed sidebar">
            <Sidebar />
          </div>
        ) : (
          <div className="w-0 bg-base-100">
            <Sidebar />
          </div>
        )}
        <div
          className={
            activeMenu
              ? 'bg-base-300 min-h-screen md:ml-72 w-full'
              : 'bg-base-300 w-full min-h-screen flex-2'
          }
        >
          <div className="fixed md:static shadow bg-base-200 navbar w-full">
            <Navbar />
          </div>
          <div className="pl-5 pt-5">
            {themeSettings && <ThemeSettings />}
            <Outlet /> {/* Render nested routes here */}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default App;