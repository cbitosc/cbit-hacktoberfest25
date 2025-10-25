import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { Menu, X, LogOut, UserPlus } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useTeamAuth } from "../hooks/useTeamAuth";
import { auth } from "../firebase";
import Logo from "../assets/TransparentLogo.svg";
import HacktoberLogo from "../assets/hacktober.svg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, loading } = useAuth();
  const { teamNumber } = useTeamAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Base routes that are always visible
  const baseRoutes = [
    { name: "Home", path: "/" },
    { name: "Preptember", path: "/preptember" },
  ];

  // Conditionally add Problem Statements if user has team number
  const routes = teamNumber
    ? [...baseRoutes, { name: "Problem Statements", path: "/prob" }]
    : baseRoutes;

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Handle register button click
  const handleRegisterClick = () => {
    navigate("/signin");
    setIsOpen(false);
    // Scroll to top when navigating to signin page
    window.scrollTo(0, 0);
  };

  // Scroll detection for navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset active state on page load
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const pathname = window.location.pathname;

    // Find matching route based on pathname or hash
    const matchingRoute = routes.find((route) => {
      if (route.path.startsWith("/#")) {
        return hash === route.path.slice(2);
      }
      return pathname === route.path;
    });

    if (matchingRoute) {
      setActive(matchingRoute.name);
    }
    // Handle specific page routes that should highlight Team Details
    else if (
      pathname === "/registration-success" ||
      pathname === "/register" ||
      pathname === "/edit-team"
    ) {
      setActive("TeamDetails");
    }
    // Handle other routes
    else {
      setActive(null);
    }
  }, []);

  // Listen for route changes
  useEffect(() => {
    const pathname = location.pathname;
    const hash = location.hash.slice(1);

    // Find matching route based on pathname or hash
    const matchingRoute = routes.find((route) => {
      if (route.path.startsWith("/#")) {
        return hash === route.path.slice(2);
      }
      return pathname === route.path;
    });

    if (matchingRoute) {
      setActive(matchingRoute.name);
    }
    // Handle specific page routes that should highlight Team Details
    else if (
      pathname === "/registration-success" ||
      pathname === "/register" ||
      pathname === "/edit-team"
    ) {
      setActive("TeamDetails");
    }
    // Handle other routes
    else {
      setActive(null);
    }
  }, [location, routes]);

  return (
    <>
      <nav
        id="main-navbar"
        className={`fixed top-0 left-0 w-full z-50 font-atkinson transition-all duration-500 ${
          isScrolled
            ? "backdrop-blur-md bg-[#1C1C3F]/80 border-b border-[#8A86FF33] shadow-lg"
            : "bg-transparent border-b border-transparent"
        }`}
        style={{ fontFamily: '"Atkinson Hyperlegible", sans-serif' }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between min-h-[40px]">
            {/* Logo - Left */}
            <div className="flex items-center space-x-2 sm:space-x-3 text-2xl font-bold cursor-pointer flex-shrink-0">
              <a href="/#Hero">
                <div className="flex items-center space-x-2 sm:space-x-3 text-2xl font-bold cursor-pointer transform transition-all duration-500 hover:scale-105">
                  <img src={Logo} className="h-8 sm:h-10 w-auto" />
                  <img
                    src={HacktoberLogo}
                    alt="Extra Logo"
                    className="h-8 sm:h-10 w-auto"
                  />
                </div>
              </a>
            </div>

            {/* Navigation Links - Center */}
            <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-1 xl:space-x-2">
                {routes.map((route, i) => (
                  <a
                    key={route.name}
                    href={route.path}
                    onClick={(e) => {
                      setActive(route.name);
                      // For non-hash routes, use navigate and scroll to top
                      if (!route.path.startsWith("/#")) {
                        e.preventDefault();
                        navigate(route.path);
                        window.scrollTo(0, 0);
                      }
                    }}
                    className={`relative px-3 xl:px-5 py-2 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] ${
                      active === route.name
                        ? "bg-[#8A86FF33] text-white border border-[#8A86FF66]"
                        : `text-white border border-transparent hover:border-[#D6DDE533] hover:bg-white/5`
                    }`}
                  >
                    {route.name}

                    {/* Corner brackets for desktop navigation */}
                    <div className="absolute inset-0 opacity-0 hover:opacity-70 transition-opacity duration-300">
                      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white"></div>
                      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white"></div>
                      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white"></div>
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white"></div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Authentication Buttons - Right */}
            <div className="hidden lg:flex items-center flex-shrink-0 space-x-3 ml-auto">
              {!loading && (
                <>
                  {user ? (
                    <>
                      {/* Sign Out Button - Icon only, red accent */}
                      <button
                        onClick={handleSignOut}
                        title="Sign Out"
                        aria-label="Sign Out"
                        className="relative p-2 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] text-red-300 border border-transparent hover:border-red-400/60 hover:bg-red-500/10 flex items-center rounded"
                      >
                        <LogOut className="w-4 h-4" />

                        {/* Corner brackets */}
                        <div className="absolute inset-0 opacity-0 hover:opacity-70 transition-opacity duration-300">
                          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-red-300"></div>
                          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-red-300"></div>
                          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-red-300"></div>
                          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-red-300"></div>
                        </div>
                      </button>
                    </>
                  ) : (
                    /* Register Button */
                    <button
                      onClick={handleRegisterClick}
                      className={`relative px-6 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105 text-white flex items-center space-x-2 rounded-[4px] ${
                        isScrolled
                          ? "bg-[#6F6BDA]" // lighter vibrant purple when scrolled
                          : "bg-[#3F3F89]" // darker muted tone at top
                      }`}
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Sign in</span>

                      {/* Corner brackets */}
                      <div className="absolute inset-0 opacity-0 hover:opacity-70 transition-opacity duration-300">
                        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white"></div>
                        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white"></div>
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white"></div>
                      </div>
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 sm:p-3 border border-[#D6DDE533] text-white focus:outline-none flex-shrink-0"
            >
              {isOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-100 ${
            isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pt-4 pb-6 space-y-3 backdrop-blur-md bg-[#1C1C3F]/80 border-t border-[#8A86FF33]">
            <div className="flex flex-col w-full">
              {/* Navigation Routes */}
              {routes.map((route) => (
                <a
                  key={route.name}
                  href={route.path}
                  onClick={(e) => {
                    setActive(route.name);
                    setIsOpen(false);
                    // For non-hash routes, use navigate and scroll to top
                    if (!route.path.startsWith("/#")) {
                      e.preventDefault();
                      navigate(route.path);
                      window.scrollTo(0, 0);
                    }
                  }}
                  className="relative w-full text-left px-6 py-3 text-base font-semibold hover:scale-[1.02] hover:bg-white/5 transition-transform duration-300 text-white"
                >
                  {route.name}

                  {/* Corner brackets for mobile dropdown */}
                  <div className="absolute inset-0 opacity-0 hover:opacity-70 transition-opacity duration-300">
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white"></div>
                  </div>
                </a>
              ))}

              {/* Divider */}
              <div className="w-full h-px bg-[#8A86FF33] my-2"></div>

              {/* Authentication Buttons */}
              {/* Authentication Buttons */}
              {!loading && (
                <>
                  {user ? (
                    <>
                      {/* Sign Out Button (mobile) */}
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsOpen(false);
                        }}
                        className="relative w-full text-left px-6 py-3 text-base font-semibold hover:scale-[1.02] hover:bg-white/5 transition-transform duration-300 text-white flex items-center space-x-3"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>

                        <div className="absolute inset-0 opacity-0 hover:opacity-70 transition-opacity duration-300 pointer-events-none">
                          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white"></div>
                          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white"></div>
                          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white"></div>
                          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white"></div>
                        </div>
                      </button>
                    </>
                  ) : (
                    /* Mobile Register Button (already present in your code) */
                    <button
                      onClick={handleRegisterClick}
                      className="relative w-full text-left px-6 py-3.5 text-base font-bold transition-transform duration-300 hover:scale-[1.02] bg-gradient-to-r from-[#8A86FF] to-[#6B67D8] border-2 border-[#8A86FF] hover:border-[#A29DFF] hover:shadow-[0_0_20px_rgba(138,134,255,0.5)] text-white flex items-center space-x-3 mx-2 rounded-md"
                    >
                      <UserPlus className="w-5 h-5" />
                      <span>
                        {window.location.pathname === "/"
                          ? "Register"
                          : "Sign In"}
                      </span>

                      <div className="absolute inset-0 opacity-0 hover:opacity-70 transition-opacity duration-300 pointer-events-none">
                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white"></div>
                        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white"></div>
                        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white"></div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white"></div>
                      </div>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <style>{`@keyframes gradient-shift{0%,100%{background-position:0 50%}50%{background-position:100% 50%}}`}</style>
      </nav>

      {/* Secondary navbar removed */}
    </>
  );
};

export default Navbar;
