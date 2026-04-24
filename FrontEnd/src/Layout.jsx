import React, { useEffect, useState } from 'react'
import { Theme } from '@radix-ui/themes';
import Nav from './components/Nav';
import toast, { Toaster } from "react-hot-toast";
import {
    Outlet
  } from "react-router-dom";
import Chatbot from './pages/Chatbot/Chatbot';
function Layout() {


    const [themeMode, setThemeMode] = useState(() => {
        // Check localStorage first, then system preference
        const saved = localStorage.getItem('theme');
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    // Sync theme with HTML element for Tailwind dark mode
    useEffect(() => {
        if (themeMode === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', themeMode);
    }, [themeMode]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            // Only auto-switch if user hasn't set a preference
            if (!localStorage.getItem('theme')) {
                setThemeMode(mediaQuery.matches ? 'dark' : 'light');
            }
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => {
          mediaQuery.removeEventListener('change', handleChange);
        };
      }, []);

    const getCurrentTheme = () => {
        return themeMode;
    }
    const toggleTheme = () => {
      toast.success('Theme Changed Successfully');
      console.log("Theme Changed Successfully")
     setThemeMode(prevMode => prevMode === "light" ? "dark" : "light");
   };
    return (
      <div>
        <Theme appearance={themeMode}>
        <Nav onThemeChange={toggleTheme} getCurrentTheme={getCurrentTheme} />
        <Chatbot/>
        <Outlet/>
        <Toaster/>
        </Theme>
        
      </div>
    )
  }

export default Layout
