import { useState } from "react";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <nav className="relative z-50 container mx-auto p-6">
      {/* Flex Container */}
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="pt-2">
          <div className="flex items-center space-x-2">
            <div
              className="flex items-center justify-center rounded-lg p-2"
              style={{ backgroundColor: "#00B8E9" }}
            >
              <span className="text-xl font-bold text-white">{"{W}"}</span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="hidden space-x-6 md:flex">
          <ScrollLink
            className="hover:text-darkGrayishBlue cursor-pointer"
            to="about-us"
            smooth={true}
            duration={500}
          >
            About Us
          </ScrollLink>
          <ScrollLink
            className="hover:text-darkGrayishBlue cursor-pointer"
            to="features"
            smooth={true}
            duration={500}
          >
            Features
          </ScrollLink>
        </div>

        {/* Button */}
        <Link
          to="/auth"
          className="baseline hidden rounded-full p-3 px-6 pt-2 text-white hover:opacity-90 md:block"
          style={{ backgroundColor: "#00B8E9" }}
        >
          Get Started
        </Link>

        {/* Hamburger Icon */}
        <button
          className={`hamburger block focus:outline-none md:hidden ${
            toggleMenu ? "open" : ""
          }`}
          onClick={() => setToggleMenu(!toggleMenu)}
          aria-label="Toggle Menu"
        >
          <span className="hamburger-top"></span>
          <span className="hamburger-middle"></span>
          <span className="hamburger-bottom"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute left-0 right-0 top-full mt-4 mx-6 z-50 transition-all duration-300 ${
          toggleMenu ? "flex" : "hidden"
        } flex-col items-center space-y-6 bg-[#f5f5f5] p-6 rounded-lg shadow-lg`}
      >
        <ScrollLink
          className="hover:text-darkGrayishBlue cursor-pointer"
          to="about-us"
          smooth={true}
          duration={500}
          onClick={() => setToggleMenu(false)}
        >
          About Us
        </ScrollLink>
        <ScrollLink
          className="hover:text-darkGrayishBlue cursor-pointer"
          to="features"
          smooth={true}
          duration={500}
          onClick={() => setToggleMenu(false)}
        >
          Features
        </ScrollLink>
        <Link
          to="/auth"
          className="rounded-full p-3 px-6 pt-2 text-white hover:opacity-90"
          style={{ backgroundColor: "#00B8E9" }}
          onClick={() => setToggleMenu(false)}
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
