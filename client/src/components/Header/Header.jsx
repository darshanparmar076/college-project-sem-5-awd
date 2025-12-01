import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaSearch } from "react-icons/fa";
import { Container, Logo } from "../index.js";

function Header() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.data);

  const navItems = [
    { name: "Home", link: "/", active: true },
    { name: "Blog", link: "/blogs", active: true },
    { name: "Write Post", link: "/create-post", active: isLoggedIn },
  ];

  return (
    <header className="sticky top-6 z-50">
      <Container>
        <nav className="flex items-center justify-between rounded-2xl border backdrop-blur-xl shadow-xl transition-colors duration-300 p-4 px-6 border-gray-300/50 bg-white/90">
          {/* Logo */}
          <div>
            <Link to="/">
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-3 md:flex">
            <div className="flex items-center justify-center gap-1">
              {navItems.map(
                (item) =>
                  item.active && (
                    <NavLink
                      key={item.name}
                      to={item.link}
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "active text-blue-600 bg-blue-50" : "text-gray-600"}`
                      }
                    >
                      {item.name}
                    </NavLink>
                  )
              )}
              <NavLink
                to={"/search"}
                className={({ isActive }) =>
                  `nav-link p-3 ${isActive ? "active text-blue-600 bg-blue-50" : "text-gray-600"}`
                }
              >
                <FaSearch />
              </NavLink>
            </div>

            {/* User Links */}
            {isLoggedIn ? (
              <Link to={`/u/${user.userName}`}>
                <img
                  className="h-10 w-10 cursor-pointer rounded-xl object-cover ring-2 ring-gray-300 transition-all duration-300 hover:ring-4 hover:ring-blue-500/50"
                  src={user.avtar}
                  alt="User avtar"
                />
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <NavLink
                  to="login"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active text-blue-600 bg-blue-50" : "text-gray-600"}`
                  }
                >
                  Login
                </NavLink>
                <button
                  className="btn-primary"
                  onClick={() => navigate("/register")}
                >
                  Get started
                </button>
              </div>
            )}
          </div>

          {/* Mobile button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 transition-all duration-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <FaBars className="text-xl" />
            </button>
          </div>
        </nav>

      </Container>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Content */}
          <div className="relative h-full w-full bg-white p-6">
            {/* Header with close button */}
            <div className="flex items-center justify-between mb-8">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <Logo />
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-2 transition-all duration-200 text-gray-700 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation Items */}
            <div className="flex flex-col gap-1">
              {navItems.map(
                (item) =>
                  item.active && (
                    <NavLink
                      key={item.name}
                      to={item.link}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `block rounded-xl px-4 py-3 text-lg font-medium transition-all duration-200 ${
                          isActive 
                            ? "text-blue-600 bg-blue-50" 
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  )
              )}
              
              <NavLink
                to={"/search"}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-lg font-medium transition-all duration-200 ${
                    isActive 
                      ? "text-blue-600 bg-blue-50" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <FaSearch className="text-base" />
                Search
              </NavLink>
            </div>

            {/* Bottom section */}
            <div className="absolute bottom-8 left-6 right-6">
              {/* User Profile / Auth */}
              {isLoggedIn ? (
                <Link
                  to={`/u/${user.userName}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-4 rounded-xl p-3 transition-all duration-200 hover:bg-gray-100"
                >
                  <img
                    className="h-12 w-12 rounded-xl object-cover ring-2 ring-gray-300"
                    src={user.avtar}
                    alt="User avatar"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">@{user.userName}</p>
                  </div>
                </Link>
              ) : (
                <div className="flex flex-col gap-3">
                  <NavLink
                    to="login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-xl bg-gray-100 px-4 py-3 text-center text-lg font-medium text-gray-700 transition-all duration-200 hover:bg-gray-200"
                  >
                    Login
                  </NavLink>
                  <button
                    className="rounded-xl bg-blue-600 px-4 py-3 text-lg font-medium text-white transition-all duration-200 hover:bg-blue-700"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/register");
                    }}
                  >
                    Get started
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
