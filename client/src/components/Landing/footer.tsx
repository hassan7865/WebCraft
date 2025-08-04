import { Link as ScrollLink } from 'react-scroll';

const Footer = () => {
  return (
    <div className="bg-[#f5f5f5]">
      {/* Flex Container */}
      <div className="container flex flex-col justify-between px-6 py-12 mx-auto space-y-8 md:flex-row md:space-y-0 md:items-center">
        {/* Logo Container */}
        <div className="flex items-center space-x-2">
                        <div
                            className="flex items-center justify-center rounded-lg p-2"
                            style={{ backgroundColor: "#00B8E9" }}
                        >
                            <span className="text-xl font-bold text-white">
                                {"{W}"}
                            </span>
                        </div>
                    </div>

        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
          <ScrollLink
            to="about-us"
            smooth={true}
            duration={500}
            className="text-[#333] hover:text-[#00B8E9] cursor-pointer transition-colors duration-200"
          >
            About Us
          </ScrollLink>
          <ScrollLink
            to="features"
            smooth={true}
            duration={500}
            className="text-[#333] hover:text-[#00B8E9] cursor-pointer transition-colors duration-200"
          >
            Features
          </ScrollLink>
         
        </div>

        {/* Copyright */}
        <div className="text-center md:text-right">
          <div className="text-[#666] text-sm">
            Copyright © 2024, All Rights Reserved
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
