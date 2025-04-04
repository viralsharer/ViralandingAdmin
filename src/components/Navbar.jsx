import { useState } from "react";
// import {images} from '../assets/index'


const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className="w-full flex items-center justify-center p-4 font-body overflow-clip">
            <div className="flex p-4 bg-primary-50 min-w-sm rounded-lg items-center justify-between lg:gap-x-20 gap-x-10 max-sm:gap-x-0 max-sm:min-w-full   max-w-6xl">
                {/* Logo and Brand Name */}
                <div className="flex items-center">
                    {/* <img src={images.viralLogo} alt="ViraShare Logo" className="h-6 w-6" /> */}
                    <p className="font-semibold text-primary-800 ps-1">ViraShare</p>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden sm:flex gap-x-3 text-sm font-light">
                    {["Home", "Service", "About", "Contact", "Resources", "Blog"].map((item) => (
                        <p key={item} className="hover:text-primary-600 cursor-pointer transition-colors duration-200">
                            {item}
                        </p>
                    ))}
                </div>

                {/* Mobile Menu Toggle Button */}
                <div className="sm:hidden">
                    <button onClick={toggleMobileMenu} className="text-primary-800 focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>

                {/* Get Started Button */}
                <div className="hidden sm:flex items-center">
                    <button className="px-3.5 py-1.5 text-white bg-primary-500 hover:bg-primary-700 rounded-full text-sm transition-colors duration-200">Get Started</button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="sm:hidden absolute top-22 rounded-lg  mx-auto w-sm bg-primary-50 z-50">
                    <div className="flex flex-col items-center gap-y-4 py-4">
                        {["Home", "Service", "About", "Contact", "Resources", "Blog"].map((item) => (
                            <p key={item} className="text-primary-800 hover:text-primary-600 cursor-pointer transition-colors duration-200">
                                {item}
                            </p>
                        ))}
                        <button className="px-3.5 py-1.5 text-white bg-primary-500 hover:bg-primary-700 rounded-full text-sm transition-colors duration-200">Get Started</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;
