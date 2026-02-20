import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../api/authRoutes";
import { useState } from "react";

const style = {

  nav:
    "bg-black text-white border-b border-gray-800",

  container:
    "max-w-6xl mx-auto px-4 py-3 flex justify-between items-center",

  logo:
    "text-lg sm:text-xl md:text-2xl font-bold text-white hover:text-gray-300 transition",

  desktopMenu:
    "hidden md:flex items-center gap-6",

  mobileButton:
    "md:hidden text-gray-300 hover:text-white",

  mobileMenu:
    "md:hidden border-t border-gray-800 px-4 py-4 flex flex-col gap-4",

  primaryButton:
    "bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition font-medium text-center",

  secondaryLink:
    "text-gray-300 hover:text-white transition",

  username:
    "text-gray-400 text-sm",

  logout:
    "text-gray-400 hover:text-white font-medium transition text-left"

};

const Navbar = () => {

  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {

    try {

      await logoutUser();
      setUser(null);
      navigate("/login");
      setMenuOpen(false);

    } catch (error) {

      console.error("Logout failed:", error);

    }

  };

  const toggleMenu = () => {

    setMenuOpen(prev => !prev);

  };

  return (

    <nav className={style.nav}>

      <div className={style.container}>

        <Link
          to="/dashboard"
          className={style.logo}
        >
          CreatorConnect
        </Link>

        {/* Desktop Menu */}
        <div className={style.desktopMenu}>

          {user ? (

            <>

              {/* Create FIRST */}
              <Link to="/create-asset" className={style.primaryButton}>
                Create Asset
              </Link>

              <Link to="/dashboard" className={style.secondaryLink}>
                Dashboard
              </Link>

              <Link to="/my-assets" className={style.secondaryLink}>
                My Assets
              </Link>

              <span className={style.username}>
                {user.name}
              </span>

              <button
                onClick={handleLogout}
                className={style.logout}
              >
                Logout
              </button>

            </>

          ) : (

            <>

              <Link to="/login" className={style.secondaryLink}>
                Login
              </Link>

              <Link to="/signup" className={style.primaryButton}>
                Signup
              </Link>

            </>

          )}

        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={toggleMenu}
          className={style.mobileButton}
        >
          ☰
        </button>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (

        <div className={style.mobileMenu}>

          {user ? (

            <>

              {/* Create FIRST */}
              <Link
                to="/create-asset"
                className={style.primaryButton}
                onClick={() => setMenuOpen(false)}
              >
                Create Asset
              </Link>

              <Link
                to="/dashboard"
                className={style.secondaryLink}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>

              <Link
                to="/my-assets"
                className={style.secondaryLink}
                onClick={() => setMenuOpen(false)}
              >
                My Assets
              </Link>

              <span className={style.username}>
                {user.name}
              </span>

              <button
                onClick={handleLogout}
                className={style.logout}
              >
                Logout
              </button>

            </>

          ) : (

            <>

              <Link
                to="/login"
                className={style.secondaryLink}
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>

              <Link
                to="/signup"
                className={style.primaryButton}
                onClick={() => setMenuOpen(false)}
              >
                Signup
              </Link>

            </>

          )}

        </div>

      )}

    </nav>

  );

};

export default Navbar;