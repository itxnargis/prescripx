import { useContext, useState, useEffect } from 'react'
import { assets } from "../assets/assets"
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

const Navbar = () => {
      const navigate = useNavigate();
      const [showMenu, setShowMenu] = useState(false);
      const [scrolled, setScrolled] = useState(false);
      const { token, setToken, userData } = useContext(AppContext)

      useEffect(() => {
            const handleScroll = () => {
                  setScrolled(window.scrollY > 20);
            };
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
      }, []);

      const logout = () => {
            setToken(false)
            localStorage.removeItem('token')
      }

      useEffect(() => {
            const handleClickOutside = (event) => {
                  if (showMenu && !event.target.closest('.mobile-menu')) {
                        setShowMenu(false);
                  }
            };
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
      }, [showMenu]);

      return (
            <>
                  <nav
                        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                                    ? 'bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200/50'
                                    : 'bg-white border-b border-gray-200'
                              }`}
                        role="navigation"
                        aria-label="Main navigation"
                  >
                        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                              <div className='flex items-center justify-between h-16'>
                                    <div className='flex-shrink-0'>
                                          <img
                                                onClick={() => navigate('/')}
                                                className='h-48 object-contain cursor-pointer hover:scale-105 transition-transform duration-200'
                                                src={assets.prescripx_logo}
                                                alt="PrescripX - Healthcare Platform"
                                          />
                                    </div>

                                    <div className='hidden md:block'>
                                          <ul className='flex items-center space-x-8'>
                                                <NavLink
                                                      to='/'
                                                      className={({ isActive }) =>
                                                            `relative group px-3 py-2 text-sm font-medium transition-colors duration-200 ${isActive
                                                                  ? 'text-primary'
                                                                  : 'text-gray-700 hover:text-primary'
                                                            }`
                                                      }
                                                >
                                                      Home
                                                      <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full'></span>
                                                </NavLink>
                                                <NavLink
                                                      to='/doctors'
                                                      className={({ isActive }) =>
                                                            `relative group px-3 py-2 text-sm font-medium transition-colors duration-200 ${isActive
                                                                  ? 'text-primary'
                                                                  : 'text-gray-700 hover:text-primary'
                                                            }`
                                                      }
                                                >
                                                      All Doctors
                                                      <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full'></span>
                                                </NavLink>
                                                <NavLink
                                                      to='/about'
                                                      className={({ isActive }) =>
                                                            `relative group px-3 py-2 text-sm font-medium transition-colors duration-200 ${isActive
                                                                  ? 'text-primary'
                                                                  : 'text-gray-700 hover:text-primary'
                                                            }`
                                                      }
                                                >
                                                      About
                                                      <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full'></span>
                                                </NavLink>
                                                <NavLink
                                                      to='/contact'
                                                      className={({ isActive }) =>
                                                            `relative group px-3 py-2 text-sm font-medium transition-colors duration-200 ${isActive
                                                                  ? 'text-primary'
                                                                  : 'text-gray-700 hover:text-primary'
                                                            }`
                                                      }
                                                >
                                                      Contact
                                                      <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full'></span>
                                                </NavLink>
                                          </ul>
                                    </div>

                                    <div className='flex items-center space-x-4'>
                                          {token && userData ? (
                                                <div className='relative group'>
                                                      <button
                                                            className='flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200'
                                                            aria-label="User menu"
                                                            aria-expanded="false"
                                                      >
                                                            <img
                                                                  className='w-8 h-8 rounded-full object-cover ring-2 ring-primary/20'
                                                                  src={userData.image}
                                                                  alt={`${userData.name || 'User'} profile`}
                                                            />
                                                            <svg
                                                                  className='w-4 h-4 text-gray-600 group-hover:text-primary transition-colors duration-200'
                                                                  fill="none"
                                                                  stroke="currentColor"
                                                                  viewBox="0 0 24 24"
                                                            >
                                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                      </button>

                                                      <div className='absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0'>
                                                            <div className='py-2'>
                                                                  <div className='px-4 py-2 border-b border-gray-100'>
                                                                        <p className='text-sm font-medium text-gray-900'>{userData.name || 'User'}</p>
                                                                        <p className='text-xs text-gray-500'>{userData.email || 'user@example.com'}</p>
                                                                  </div>
                                                                  <button
                                                                        onClick={() => navigate('my-profile')}
                                                                        className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors duration-200'
                                                                  >
                                                                        <span className='flex items-center'>
                                                                              <svg className='w-4 h-4 mr-3' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                              </svg>
                                                                              My Profile
                                                                        </span>
                                                                  </button>
                                                                  <button
                                                                        onClick={() => navigate('my-appointments')}
                                                                        className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors duration-200'
                                                                  >
                                                                        <span className='flex items-center'>
                                                                              <svg className='w-4 h-4 mr-3' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8a1 1 0 011-1h2z" />
                                                                              </svg>
                                                                              My Appointments
                                                                        </span>
                                                                  </button>
                                                                  <button
                                                                        onClick={logout}
                                                                        className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200'
                                                                  >
                                                                        <span className='flex items-center'>
                                                                              <svg className='w-4 h-4 mr-3' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                                              </svg>
                                                                              Logout
                                                                        </span>
                                                                  </button>
                                                            </div>
                                                      </div>
                                                </div>
                                          ) : (
                                                <button
                                                      onClick={() => navigate('/login')}
                                                      className='bg-primary text-white px-6 py-2.5 rounded-full font-medium hover:bg-primary/90 hover:shadow-lg transform hover:scale-105 transition-all duration-200 hidden md:block'
                                                >
                                                      Get Started
                                                </button>
                                          )}

                                          <button
                                                onClick={() => setShowMenu(true)}
                                                className='md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors duration-200'
                                                aria-label="Open mobile menu"
                                          >
                                                <svg className='w-6 h-6' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                                </svg>
                                          </button>
                                    </div>
                              </div>
                        </div>
                  </nav>

                  {showMenu && (
                        <div className='fixed inset-0 z-50 md:hidden'>
                              <div className='fixed inset-0 bg-black/50 backdrop-blur-sm' onClick={() => setShowMenu(false)}></div>
                              <div className='mobile-menu fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl transform transition-transform duration-300'>
                                    <div className='flex items-center justify-between p-6 border-b border-gray-200'>
                                          <img className='h-8 w-auto' src={assets.logo} alt="PrescripX" />
                                          <button
                                                onClick={() => setShowMenu(false)}
                                                className='p-2 rounded-full hover:bg-gray-100 transition-colors duration-200'
                                                aria-label="Close mobile menu"
                                          >
                                                <svg className='w-6 h-6' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                          </button>
                                    </div>

                                    <div className='p-6'>
                                          {token && userData && (
                                                <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
                                                      <div className='flex items-center space-x-3'>
                                                            <img className='w-10 h-10 rounded-full object-cover' src={userData.image} alt="Profile" />
                                                            <div>
                                                                  <p className='font-medium text-gray-900'>{userData.name || 'User'}</p>
                                                                  <p className='text-sm text-gray-500'>{userData.email || 'user@example.com'}</p>
                                                            </div>
                                                      </div>
                                                </div>
                                          )}

                                          <nav className='space-y-2'>
                                                <NavLink
                                                      to='/'
                                                      onClick={() => setShowMenu(false)}
                                                      className={({ isActive }) =>
                                                            `block px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${isActive
                                                                  ? 'bg-primary text-white'
                                                                  : 'text-gray-700 hover:bg-gray-100'
                                                            }`
                                                      }
                                                >
                                                      Home
                                                </NavLink>
                                                <NavLink
                                                      to='/doctors'
                                                      onClick={() => setShowMenu(false)}
                                                      className={({ isActive }) =>
                                                            `block px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${isActive
                                                                  ? 'bg-primary text-white'
                                                                  : 'text-gray-700 hover:bg-gray-100'
                                                            }`
                                                      }
                                                >
                                                      All Doctors
                                                </NavLink>
                                                <NavLink
                                                      to='/about'
                                                      onClick={() => setShowMenu(false)}
                                                      className={({ isActive }) =>
                                                            `block px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${isActive
                                                                  ? 'bg-primary text-white'
                                                                  : 'text-gray-700 hover:bg-gray-100'
                                                            }`
                                                      }
                                                >
                                                      About
                                                </NavLink>
                                                <NavLink
                                                      to='/contact'
                                                      onClick={() => setShowMenu(false)}
                                                      className={({ isActive }) =>
                                                            `block px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${isActive
                                                                  ? 'bg-primary text-white'
                                                                  : 'text-gray-700 hover:bg-gray-100'
                                                            }`
                                                      }
                                                >
                                                      Contact
                                                </NavLink>
                                          </nav>

                                          {token && userData && (
                                                <div className='mt-6 pt-6 border-t border-gray-200 space-y-2'>
                                                      <button
                                                            onClick={() => { navigate('my-profile'); setShowMenu(false); }}
                                                            className='w-full text-left px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200'
                                                      >
                                                            My Profile
                                                      </button>
                                                      <button
                                                            onClick={() => { navigate('my-appointments'); setShowMenu(false); }}
                                                            className='w-full text-left px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200'
                                                      >
                                                            My Appointments
                                                      </button>
                                                      <button
                                                            onClick={() => { logout(); setShowMenu(false); }}
                                                            className='w-full text-left px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors duration-200'
                                                      >
                                                            Logout
                                                      </button>
                                                </div>
                                          )}

                                          {!token && (
                                                <div className='mt-6 pt-6 border-t border-gray-200'>
                                                      <button
                                                            onClick={() => { navigate('/login'); setShowMenu(false); }}
                                                            className='w-full bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200'
                                                      >
                                                            Get Started
                                                      </button>
                                                </div>
                                          )}
                                    </div>
                              </div>
                        </div>
                  )}
            </>
      )
}

export default Navbar