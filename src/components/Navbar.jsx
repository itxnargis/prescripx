"use client"

import { useContext, useState, useEffect, useCallback, useRef, lazy, Suspense } from "react"
import { NavLink, useNavigate, useLocation } from "react-router-dom"
import { AppContext } from "../context/AppContext"
import { assets } from "../assets/assets"
import { Helmet } from "react-helmet" // For SEO

// Lazy-loaded components for better performance
const SearchBar = lazy(() => import("./SearchBar"))

// Analytics helper (implement based on your analytics provider)
const trackEvent = (eventName, properties = {}) => {
  try {
    // Example implementation - replace with your analytics provider
    if (window.analytics) {
      window.analytics.track(eventName, properties)
    }
  } catch (error) {
    console.error("Analytics error:", error)
  }
}

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [showMenu, setShowMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [isReducedMotion, setIsReducedMotion] = useState(false)
  const { token, setToken, userData } = useContext(AppContext)

  // Refs for click outside detection
  const profileDropdownRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const searchButtonRef = useRef(null)
  const scrollTimeoutRef = useRef(null)
  const navbarRef = useRef(null)

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setIsReducedMotion(mediaQuery.matches)

    const handleMotionPreferenceChange = (e) => setIsReducedMotion(e.matches)
    mediaQuery.addEventListener("change", handleMotionPreferenceChange)

    return () => mediaQuery.removeEventListener("change", handleMotionPreferenceChange)
  }, [])

  // Optimized scroll handler with debouncing and IntersectionObserver
  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setScrolled(window.scrollY > 20)
    }, 10)
  }, [])

  // Use IntersectionObserver for better performance
  useEffect(() => {
    if ("IntersectionObserver" in window && navbarRef.current) {
      const options = {
        rootMargin: "-20px 0px 0px 0px",
        threshold: [0, 0.5, 1],
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            setScrolled(true)
          } else if (entry.intersectionRatio > 0.5) {
            setScrolled(false)
          }
        })
      }, options)

      // Create a sentinel element to observe
      const sentinel = document.createElement("div")
      sentinel.style.position = "absolute"
      sentinel.style.top = "0"
      sentinel.style.height = "20px"
      sentinel.style.width = "100%"
      sentinel.style.pointerEvents = "none"
      document.body.prepend(sentinel)

      observer.observe(sentinel)

      return () => {
        observer.disconnect()
        sentinel.remove()
      }
    } else {
      // Fallback to scroll event for older browsers
      window.addEventListener("scroll", handleScroll, { passive: true })
      return () => {
        window.removeEventListener("scroll", handleScroll)
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current)
        }
      }
    }
  }, [handleScroll])

  // Track page views for analytics
  useEffect(() => {
    trackEvent("page_view", { path: location.pathname })
  }, [location.pathname])

  const logout = useCallback(() => {
    trackEvent("user_logout")
    setToken(false)
    localStorage.removeItem("token")
    setShowProfileDropdown(false)
    setShowMenu(false)
    navigate("/")
  }, [setToken, navigate])

  // Handle clicks outside dropdowns with event delegation
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Profile dropdown
      if (showProfileDropdown && profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false)
      }

      // Mobile menu
      if (
        showMenu &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest(".mobile-menu-button")
      ) {
        setShowMenu(false)
      }

      // Search bar
      if (
        showSearch &&
        searchButtonRef.current &&
        !searchButtonRef.current.contains(event.target) &&
        !event.target.closest(".search-container")
      ) {
        setShowSearch(false)
      }
    }

    // Use event delegation for better performance
    if (showProfileDropdown || showMenu || showSearch) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showProfileDropdown, showMenu, showSearch])

  // Handle escape key and body scroll
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (showSearch) setShowSearch(false)
        else if (showProfileDropdown) setShowProfileDropdown(false)
        else if (showMenu) setShowMenu(false)
      }
    }

    if (showMenu || showProfileDropdown || showSearch) {
      document.addEventListener("keydown", handleKeyDown)
      if (showMenu) {
        document.body.style.overflow = "hidden"
      }
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [showMenu, showProfileDropdown, showSearch])

  const toggleMenu = useCallback(() => {
    trackEvent("toggle_mobile_menu")
    setShowMenu((prev) => !prev)
    setShowProfileDropdown(false)
    setShowSearch(false)
  }, [])

  const toggleProfileDropdown = useCallback(() => {
    trackEvent("toggle_profile_dropdown")
    setShowProfileDropdown((prev) => !prev)
    setShowMenu(false)
    setShowSearch(false)
  }, [])

  const toggleSearch = useCallback(() => {
    trackEvent("toggle_search")
    setShowSearch((prev) => !prev)
    setShowMenu(false)
    setShowProfileDropdown(false)
  }, [])

  const handleNavigation = useCallback(
    (path) => {
      trackEvent("navigation", { destination: path })
      navigate(path)
      setShowMenu(false)
      setShowProfileDropdown(false)
      setShowSearch(false)
    },
    [navigate],
  )

  const getUserInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Navigation items with icons for better UX
  const navigationItems = [
    {
      path: "/",
      label: "Home",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      path: "/doctors",
      label: "All Doctors",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    { path: "/about", label: "About", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    {
      path: "/contact",
      label: "Contact",
      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    },
  ]

  // Get current page title for SEO and accessibility
  const getCurrentPageTitle = () => {
    const currentPath = location.pathname
    const currentItem = navigationItems.find((item) => item.path === currentPath)
    return currentItem ? `${currentItem.label} | PrescripX` : "PrescripX - Healthcare Platform"
  }

  return (
    <>
      {/* SEO Optimization */}
      <Helmet>
        <title>{getCurrentPageTitle()}</title>
        <meta
          name="description"
          content="PrescripX - Your trusted healthcare platform for connecting with doctors and managing appointments."
        />
        <link rel="canonical" href={`https://prescripx.com${location.pathname}`} />

        {/* Open Graph / Social Media */}
        <meta property="og:title" content={getCurrentPageTitle()} />
        <meta
          property="og:description"
          content="Connect with qualified healthcare professionals and manage your appointments with ease."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://prescripx.com${location.pathname}`} />
        <meta property="og:image" content="https://prescripx.com/og-image.jpg" />

        {/* Structured Data for SEO */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "PrescripX",
              "url": "https://prescripx.com",
              "logo": "https://prescripx.com/logo.png",
              "sameAs": [
                "https://facebook.com/prescripx",
                "https://twitter.com/prescripx",
                "https://instagram.com/prescripx"
              ]
            }
          `}
        </script>
      </Helmet>

      <header ref={navbarRef} className="relative z-50">
        {/* Announcement Banner - can be conditionally rendered */}
        {false && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 text-center text-sm">
            <p>
              <span className="font-semibold">New:</span> Schedule video consultations with our doctors.
              <button
                onClick={() => handleNavigation("/video-consult")}
                className="underline ml-2 font-medium hover:text-blue-100 focus:outline-none focus:text-blue-100"
              >
                Learn more
              </button>
            </p>
          </div>
        )}

        <nav
          className={`sticky top-0 z-50 transition-all duration-300 ${
            isReducedMotion ? "" : "motion-safe:animate-fadeIn"
          } ${
            scrolled
              ? "bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200/50"
              : "bg-white border-b border-gray-200"
          }`}
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => handleNavigation("/")}
                  className="flex items-center focus:outline-none group"
                  aria-label="PrescripX - Healthcare Platform"
                >
                  <img
                    className={`h-48 object-contain cursor-pointer ${
                      isReducedMotion ? "" : "group-hover:scale-105 transition-transform duration-200"
                    }`}
                    src={assets.prescripx_logo || "/placeholder.svg"}
                    alt="PrescripX Logo"
                    width="180"
                    height="100"
                    loading="eager" // Logo should load immediately
                  />
                </button>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:block">
                <ul className="flex items-center space-x-1" role="menubar">
                  {navigationItems.map((item) => (
                    <li key={item.path} role="none">
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `relative group px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg flex items-center space-x-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            isActive ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                          }`
                        }
                        role="menuitem"
                        onClick={() => trackEvent("nav_click", { item: item.label })}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                        <span>{item.label}</span>
                        <span
                          className={`absolute bottom-1 left-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-6 transform -translate-x-1/2 rounded-full ${
                            isReducedMotion ? "motion-reduce:transition-none" : ""
                          }`}
                          aria-hidden="true"
                        ></span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Desktop Actions: Search, User Menu, Auth Button */}
              <div className="hidden md:flex items-center space-x-4">
                {/* Search Button */}
                <button
                  ref={searchButtonRef}
                  onClick={toggleSearch}
                  className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label={showSearch ? "Close search" : "Open search"}
                  aria-expanded={showSearch}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>

                {/* User Menu / Auth Button */}
                {token && userData ? (
                  <div className="relative" ref={profileDropdownRef}>
                    <button
                      onClick={toggleProfileDropdown}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label="User menu"
                      aria-expanded={showProfileDropdown}
                      aria-haspopup="true"
                    >
                      <div className="relative">
                        {userData.image ? (
                          <img
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-100"
                            src={userData.image || "/placeholder.svg"}
                            alt=""
                            width="36"
                            height="36"
                            loading="lazy"
                            onError={(e) => {
                              e.target.style.display = "none"
                              e.target.nextElementSibling.style.display = "flex"
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-sm font-medium ring-2 ring-blue-100 ${userData.image ? "hidden" : "flex"}`}
                          aria-hidden="true"
                        >
                          {getUserInitials(userData.name)}
                        </div>
                        <div
                          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"
                          aria-hidden="true"
                        ></div>
                      </div>
                      <div className="hidden lg:block text-left">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{userData.name || "User"}</p>
                        <p className="text-xs text-blue-600">Online</p>
                      </div>
                      <svg
                        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showProfileDropdown ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Profile Dropdown */}
                    <div
                      className={`absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 transition-all duration-200 transform origin-top-right ${
                        isReducedMotion
                          ? ""
                          : showProfileDropdown
                            ? "opacity-100 visible scale-100 translate-y-0"
                            : "opacity-0 invisible scale-95 -translate-y-2"
                      }`}
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu"
                      hidden={!showProfileDropdown}
                    >
                      <div className="py-2">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            {userData.image ? (
                              <img
                                className="w-10 h-10 rounded-full object-cover"
                                src={userData.image || "/placeholder.svg"}
                                alt=""
                                width="40"
                                height="40"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-sm font-medium">
                                {getUserInitials(userData.name)}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{userData.name || "User"}</p>
                              <p className="text-xs text-gray-500 truncate">{userData.email || "user@example.com"}</p>
                              <div className="flex items-center mt-1">
                                <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                                <span className="text-xs text-green-600">Online</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                          <button
                            onClick={() => handleNavigation("/my-profile")}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-3"
                            role="menuitem"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            <span>My Profile</span>
                          </button>
                          <button
                            onClick={() => handleNavigation("/my-appointments")}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-3"
                            role="menuitem"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8a1 1 0 011-1h2z"
                              />
                            </svg>
                            <span>My Appointments</span>
                          </button>
                          <button
                            onClick={() => handleNavigation("/medical-records")}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-3"
                            role="menuitem"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <span>Medical Records</span>
                          </button>
                          <button
                            onClick={() => handleNavigation("/settings")}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-3"
                            role="menuitem"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span>Settings</span>
                          </button>
                        </div>

                        <div className="border-t border-gray-100 py-1">
                          <button
                            onClick={logout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center space-x-3"
                            role="menuitem"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleNavigation("/login")}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-full font-medium hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transform hover:scale-105 transition-all duration-200 hidden md:block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Get Started
                  </button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="flex items-center md:hidden space-x-2">
                {/* Mobile Search Button */}
                <button
                  ref={searchButtonRef}
                  onClick={toggleSearch}
                  className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label={showSearch ? "Close search" : "Open search"}
                  aria-expanded={showSearch}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>

                <button
                  onClick={toggleMenu}
                  className="mobile-menu-button p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 relative z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Toggle mobile menu"
                  aria-expanded={showMenu}
                >
                  <svg
                    className={`w-6 h-6 transition-transform duration-200 ${showMenu ? "rotate-90" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {showMenu ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Search Bar - Expandable */}
            <div
              className={`search-container overflow-hidden transition-all duration-300 ${
                showSearch ? "max-h-16 opacity-100 py-2" : "max-h-0 opacity-0 py-0"
              }`}
            >
              <Suspense fallback={<div className="w-full h-10 bg-gray-100 animate-pulse rounded-lg"></div>}>
                {showSearch && <SearchBar onSearch={(term) => handleNavigation(`/search?q=${term}`)} />}
              </Suspense>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          isReducedMotion ? "" : showMenu ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        aria-hidden={!showMenu}
      >
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowMenu(false)}
          aria-hidden="true"
        ></div>
        <div
          ref={mobileMenuRef}
          className={`mobile-menu fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 ${
            showMenu ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <img
              className="h-8 w-auto"
              src={assets.prescripx_logo || "/placeholder.svg"}
              alt="PrescripX"
              width="96"
              height="32"
            />
            <button
              onClick={() => setShowMenu(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Close mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(100vh-88px)]">
            {/* Mobile User Info */}
            {token && userData && (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {userData.image ? (
                    <img
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-200"
                      src={userData.image || "/placeholder.svg"}
                      alt=""
                      width="48"
                      height="48"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-sm font-medium ring-2 ring-blue-200">
                      {getUserInitials(userData.name)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{userData.name || "User"}</p>
                    <p className="text-sm text-gray-600 truncate">{userData.email || "user@example.com"}</p>
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                      <span className="text-xs text-green-600">Online</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Navigation */}
            <nav className="space-y-2 mb-6">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setShowMenu(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-3 ${
                      isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                    }`
                  }
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Mobile Quick Actions */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNavigation("/find-doctor")}
                  className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <svg className="w-6 h-6 text-blue-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span className="text-xs font-medium">Find Doctor</span>
                </button>
                <button
                  onClick={() => handleNavigation("/book-appointment")}
                  className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <svg className="w-6 h-6 text-blue-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-xs font-medium">Book Appointment</span>
                </button>
                <button
                  onClick={() => handleNavigation("/emergency")}
                  className="flex flex-col items-center justify-center p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
                >
                  <svg className="w-6 h-6 text-red-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-xs font-medium text-red-700">Emergency</span>
                </button>
                <button
                  onClick={() => handleNavigation("/help")}
                  className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <svg className="w-6 h-6 text-blue-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-xs font-medium">Help</span>
                </button>
              </div>
            </div>

            {/* Mobile User Actions */}
            {token && userData && (
              <div className="pt-6 border-t border-gray-200 space-y-2">
                <button
                  onClick={() => handleNavigation("/my-profile")}
                  className="w-full text-left px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>My Profile</span>
                </button>
                <button
                  onClick={() => handleNavigation("/my-appointments")}
                  className="w-full text-left px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8a1 1 0 011-1h2z"
                    />
                  </svg>
                  <span>My Appointments</span>
                </button>
                <button
                  onClick={() => handleNavigation("/medical-records")}
                  className="w-full text-left px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Medical Records</span>
                </button>
                <button
                  onClick={() => handleNavigation("/settings")}
                  className="w-full text-left px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>Settings</span>
                </button>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center space-x-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            )}

            {/* Mobile Auth Button */}
            {!token && (
              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={() => handleNavigation("/login")}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile Contact Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3 text-gray-500 mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a href="tel:+1234567890" className="text-sm hover:text-blue-600">
                  +1 (234) 567-890
                </a>
              </div>
              <div className="flex items-center space-x-3 text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a href="mailto:support@prescripx.com" className="text-sm hover:text-blue-600">
                  support@prescripx.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
