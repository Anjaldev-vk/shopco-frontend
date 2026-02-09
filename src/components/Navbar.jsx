import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../hooks/reduxHooks";
import { selectCartItemCount } from "../features/cart/selectors";
import { selectWishlistCount } from "../features/wishlist/selectors";
import { selectCurrentUser } from "../features/auth/selectors";
import { logout } from "../features/auth/authSlice";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  const cartItemCount = useAppSelector(selectCartItemCount);
  const wishlistCount = useAppSelector(selectWishlistCount);
  const currentUser = useAppSelector(selectCurrentUser);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // Redirect to login if user is not authenticated
  const handleProtectedClick = (path) => {
    if (!currentUser) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  // Hide navbar on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 80) { // Only hide after scrolling a bit
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-transform duration-300 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        } bg-[#F2F0F1] shadow-sm`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-4xl font-extrabold tracking-tighter flex items-center gap-1 text-black">
                SHOP.CO
              </Link>
            </div>

            {/* Desktop Menu - Centered */}
            <div className="hidden md:flex flex-grow justify-center items-center space-x-10">
              {['Home', 'Products', 'About', 'Contact'].map((item) => (
                <Link
                  key={item}
                  to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  className="text-gray-600 hover:text-black transition-colors font-medium text-base relative group"
                >
                  {item}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-black transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                </Link>
              ))}
            </div>

            {/* Icons / Login */}
            <div className="hidden md:flex items-center space-x-6">
              <div onClick={() => handleProtectedClick("/cart")} className="relative text-gray-700 hover:text-black transition cursor-pointer group">
                <svg className="w-6 h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                {cartItemCount > 0 && currentUser && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {cartItemCount}
                  </span>
                )}
              </div>

              <div onClick={() => handleProtectedClick("/wishlist")} className="relative text-gray-700 hover:text-black transition cursor-pointer group">
                <svg className="w-6 h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                {wishlistCount > 0 && currentUser && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {wishlistCount}
                  </span>
                )}
              </div>

              {!currentUser ? (
                <Link to="/login" className="px-5 py-2.5 rounded-full text-sm font-medium transition shadow-lg hover:shadow-xl bg-black text-white hover:bg-gray-800">
                  Login
                </Link>
              ) : (
                <>
                  <Link to="/profile" className="text-gray-700 hover:text-black transition font-medium">Profile</Link>
                  <button onClick={handleLogout} className="text-gray-700 hover:text-red-600 transition font-medium">Logout</button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={toggleMenu} className="p-2 focus:outline-none text-black">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-xl">
            <div className="px-4 pt-4 pb-6 space-y-2">
              <Link to="/" className="block px-3 py-3 rounded-lg text-lg font-medium text-gray-900 hover:bg-gray-50" onClick={toggleMenu}>Home</Link>
              <Link to="/products" className="block px-3 py-3 rounded-lg text-lg font-medium text-gray-900 hover:bg-gray-50" onClick={toggleMenu}>Products</Link>
              <Link to="/about" className="block px-3 py-3 rounded-lg text-lg font-medium text-gray-900 hover:bg-gray-50" onClick={toggleMenu}>About</Link>
              <Link to="/contact" className="block px-3 py-3 rounded-lg text-lg font-medium text-gray-900 hover:bg-gray-50" onClick={toggleMenu}>Contact</Link>
              <div className="border-t border-gray-100 my-2"></div>
              <div onClick={() => { toggleMenu(); handleProtectedClick("/cart"); }} className="block px-3 py-3 rounded-lg text-lg font-medium text-gray-900 hover:bg-gray-50 cursor-pointer">Cart</div>
              <div onClick={() => { toggleMenu(); handleProtectedClick("/wishlist"); }} className="block px-3 py-3 rounded-lg text-lg font-medium text-gray-900 hover:bg-gray-50 cursor-pointer">Wishlist</div>
              <div className="border-t border-gray-100 my-2"></div>
              {!currentUser ? (
                <Link to="/login" onClick={toggleMenu} className="block w-full text-center px-4 py-3 bg-black text-white rounded-lg text-lg font-medium hover:bg-gray-800 transition">Login</Link>
              ) : (
                <>
                  <Link to="/profile" onClick={toggleMenu} className="block px-3 py-3 rounded-lg text-lg font-medium text-gray-900 hover:bg-gray-50">Profile</Link>
                  <button onClick={() => { toggleMenu(); handleLogout(); }} className="block w-full text-left px-3 py-3 rounded-lg text-lg font-medium text-red-600 hover:bg-red-50">Logout</button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
      {/* Spacer removed from here */}
    </>
  );
};

export default Navbar;
