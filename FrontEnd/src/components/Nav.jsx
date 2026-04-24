import React, { useState } from 'react'
import { Container, Box, DropdownMenu, Avatar, IconButton, Tooltip, Heading, Button, Badge, Flex } from '@radix-ui/themes';
import { SunIcon, MoonIcon, HamburgerMenuIcon, Cross1Icon } from '@radix-ui/react-icons';
import Dropdown from './Dropdown';
import { toast } from 'react-hot-toast';
import { Link, useLocation } from 'react-router-dom';
import { IoSpeedometerOutline, IoBookOutline, IoFlashOutline, IoTrophyOutline, IoPeopleOutline, IoMailOutline } from "react-icons/io5";
import { FaLock } from "react-icons/fa";
import { FiLogIn } from 'react-icons/fi';
import { getLoggedIn } from '../services/authService';

function Nav({ onThemeChange, getCurrentTheme }) {
  const loggedIn = getLoggedIn();
  const theme = getCurrentTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Home', icon: null },
    { to: '/explore', label: 'Explore', icon: IoBookOutline },
    { to: '/leaderboard', label: 'Leaderboard', icon: IoTrophyOutline, locked: !loggedIn },
    { to: '/community', label: 'Community', icon: IoPeopleOutline, locked: !loggedIn },
    { to: '/contact', label: 'Contact', icon: IoMailOutline },
  ];

  return (
    <div className="sticky top-0 z-50">
      <Box 
        style={{ 
          background: 'var(--color-background)', 
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--gray-a4)',
        }}
      >
        <Container size="4" py="3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 group-hover:scale-105 transition-transform">
                <IoSpeedometerOutline className="text-white" size={22} />
              </div>
              <div className="hidden sm:block">
                <Heading size="4" className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-bold">
                  ReadSpeed
                </Heading>
                <span className="text-xs text-gray-500 -mt-1 block">Interactive Reading</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.to}
                  to={link.to} 
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isActive(link.to) 
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' 
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  {link.label}
                  {link.locked && <FaLock className="text-xs text-gray-400" />}
                </Link>
              ))}
              
              {/* Practice Dropdown */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <button className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                    location.pathname.includes('exercise') || location.pathname.includes('instruction')
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' 
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}>
                    <IoFlashOutline className="text-lg" />
                    Practice
                    <DropdownMenu.TriggerIcon />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content variant="soft" className="min-w-[180px]">
                  <Link to="/instruction">
                    <DropdownMenu.Item className="cursor-pointer">
                      📖 Instructions
                    </DropdownMenu.Item>
                  </Link>
                  <Link to="/general-exercise">
                    <DropdownMenu.Item className="cursor-pointer">
                      🎯 Exercises
                      {!loggedIn && <FaLock className="ml-auto text-gray-400" />}
                    </DropdownMenu.Item>
                  </Link>
                  <DropdownMenu.Separator />
                  <Link to="/generative-exercise">
                    <DropdownMenu.Item className="cursor-pointer">
                      <span className="flex items-center gap-2">
                        ✨ AI Generated
                        <Badge color="purple" size="1">New</Badge>
                      </span>
                    </DropdownMenu.Item>
                  </Link>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </nav>

            {/* Right Side Actions */}
            <Flex align="center" gap="3">
              {/* Theme Toggle */}
              <Tooltip content={theme === 'light' ? 'Dark mode' : 'Light mode'}>
                <IconButton 
                  size="2" 
                  variant="ghost" 
                  className="cursor-pointer"
                  onClick={onThemeChange}
                >
                  {theme === 'light' 
                    ? <MoonIcon height="18" width="18" /> 
                    : <SunIcon height="18" width="18" />
                  }
                </IconButton>
              </Tooltip>

              {/* Auth Buttons */}
              {!loggedIn ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/signup">
                    <Button variant="outline" radius="full" className="cursor-pointer">
                      Sign Up
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="solid" color="blue" radius="full" className="cursor-pointer">
                      Login <FiLogIn className="ml-1" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <Dropdown />
              )}

              {/* Mobile Menu Toggle */}
              <IconButton 
                size="2" 
                variant="ghost" 
                className="md:hidden cursor-pointer"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <Cross1Icon /> : <HamburgerMenuIcon />}
              </IconButton>
            </Flex>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t pt-4 space-y-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.to}
                  to={link.to} 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.to) 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                  {link.locked && <FaLock className="inline ml-2 text-xs text-gray-400" />}
                </Link>
              ))}
              <Link 
                to="/general-exercise" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                Practice
              </Link>
              {!loggedIn && (
                <div className="flex gap-2 px-4 pt-2">
                  <Link to="/login" className="flex-1">
                    <Button variant="solid" color="blue" className="w-full cursor-pointer">Login</Button>
                  </Link>
                  <Link to="/signup" className="flex-1">
                    <Button variant="outline" className="w-full cursor-pointer">Sign Up</Button>
                  </Link>
                </div>
              )}
            </nav>
          )}
        </Container>
      </Box>
    </div>
  )
}

export default Nav