// RentX Navbar component
"use client";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Function to check login status
  const checkLoginStatus = () => {
    if (typeof window !== 'undefined') {
      setIsLoggedIn(!!localStorage.getItem('token'));
    }
  };

  useEffect(() => {
    // Check login status on component mount
    checkLoginStatus();
    
    // Add event listener for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        checkLoginStatus();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Create a custom event listener for login status changes
    const handleLoginEvent = () => checkLoginStatus();
    window.addEventListener('loginStatusChanged', handleLoginEvent);
    
    // Check login status on every render
    const interval = setInterval(checkLoginStatus, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('loginStatusChanged', handleLoginEvent);
      clearInterval(interval);
    };
  }, []);

  function handleLogout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      router.push('/login');
    }
  }

  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <header className="sticky top-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <nav className="flex flex-wrap items-center justify-between py-4 md:py-0">
          {/* Logo */}
          <Link href="/" className="flex items-center text-emerald-800 font-playfair text-2xl font-bold py-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            RentX
            <span className="ml-2 bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-sans">AI-POWERED</span>
          </Link>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-emerald-800 hover:bg-gray-100 focus:outline-none" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation - Centered */}
          <div className={`w-full md:flex md:items-center md:justify-center md:w-auto ${isMobileMenuOpen ? 'block' : 'hidden'} md:block`}>
            <ul className="flex flex-col md:flex-row md:items-center md:gap-1">
              <NavItem href="/" isActive={isActive('/')} label="Home" />
              <NavItem href="/category" isActive={isActive('/category')} label="Categories" />
              <NavItem href="/how-it-works" isActive={isActive('/how-it-works')} label="How it Works" />
              <NavItem href="/contact" isActive={isActive('/contact')} label="Contact" />
            </ul>
          </div>

          {/* Auth Buttons - Right Aligned */}
          <div className={`w-full md:w-auto mt-4 md:mt-0 ${isMobileMenuOpen ? 'block' : 'hidden'} md:block`}>
            {isLoggedIn ? (
              <div className="relative">
                <div className="flex flex-col md:flex-row items-center gap-2">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="w-full md:w-auto px-5 py-2 text-sm font-medium text-white bg-emerald-800 rounded-md hover:bg-emerald-900 transition-colors duration-300 flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Profile
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                {/* Dropdown menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center gap-2">
                <Link 
                  href="/signup" 
                  className="w-full md:w-auto px-5 py-2 text-sm font-medium text-emerald-800 bg-white border border-emerald-800 rounded-md hover:bg-emerald-800 hover:text-white transition-colors duration-300 text-center"
                >
                  Sign Up
                </Link>
                <Link 
                  href="/login" 
                  className="w-full md:w-auto px-5 py-2 text-sm font-medium text-white bg-emerald-800 rounded-md hover:bg-emerald-900 transition-colors duration-300 text-center"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

// NavItem component for consistent styling
function NavItem({ href, isActive, label, onClick }) {
  return (
    <li className="md:mx-1">
      <Link 
        href={href} 
        onClick={onClick}
        className={`block py-3 md:py-6 px-4 text-base font-medium transition-colors duration-300 border-b-2 md:hover:text-emerald-800 md:hover:border-emerald-800
          ${isActive 
            ? 'text-emerald-800 border-emerald-800' 
            : 'text-gray-700 border-transparent hover:bg-gray-50 md:hover:bg-transparent'
          }`}
      >
        {label}
      </Link>
    </li>
  );
}
