import { Link as ScrollLink } from "react-scroll"

const Footer = () => {
    return (
        <div className="bg-[#f5f5f5]">
            {/* Flex Container */}
            <div className="container mx-auto flex flex-col justify-between space-y-8 px-6 py-12 md:flex-row md:items-center md:space-y-0">
                {/* Logo Container */}
                <ScrollLink
                    className="hover:text-darkGrayishBlue cursor-pointer"
                    to="navbar"
                    smooth={true}
                    duration={500}
                >
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
                </ScrollLink>

                {/* Navigation Links */}
                <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-8 md:space-y-0">
                    <ScrollLink
                        to="about-us"
                        smooth={true}
                        duration={500}
                        className="cursor-pointer text-[#333] transition-colors duration-200 hover:text-[#00B8E9]"
                    >
                        About Us
                    </ScrollLink>
                    <ScrollLink
                        to="features"
                        smooth={true}
                        duration={500}
                        className="cursor-pointer text-[#333] transition-colors duration-200 hover:text-[#00B8E9]"
                    >
                        Features
                    </ScrollLink>
                </div>

                {/* Copyright */}
                <div className="text-center md:text-right">
                    <div className="text-sm text-[#666]">
                        Copyright © 2025, All Rights Reserved
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer
