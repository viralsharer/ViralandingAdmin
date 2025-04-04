// import React from "react";

import { FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-primary-950 text-white py-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12">
                {/* Left Column */}
                <div className="md:w-5/12 space-y-5">
                    {/* Logo and Brand Name */}
                    <div className="flex items-center">
                        {/* <img src={images.viralLogo} alt="ViraShare Logo" className="h-8 w-8" /> */}
                        <span className="font-semibold text-primary-100 text-xl ml-2">ViraShare</span>
                    </div>

                    <p className="text-primary-300 text-sm leading-relaxed">Lorem ipsum dolor sit amet consectetur. Id enim cursus risus interdum mattis tellus cursus suspendisse. Sed tristique enim nibh vehicula.</p>

                    <div className="flex gap-4">
                        <a href="#" className="text-primary-300 hover:text-primary-100 transition-colors">
                            <FaTwitter className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-primary-300 hover:text-primary-100 transition-colors">
                            <FaLinkedin className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-primary-300 hover:text-primary-100 transition-colors">
                            <FaFacebook className="w-5 h-5" />
                        </a>
                    </div>

                    <p className="text-primary-300 text-sm mt-6">© 2025 ViraShare. All rights reserved</p>
                </div>

                {/* Right Columns */}
                <div className="md:w-7/12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    <div className="space-y-3">
                        <h4 className="font-semibold text-primary-100 mb-2">Company</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-primary-300 hover:text-primary-100 text-sm transition-colors">
                                    About
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-primary-300 hover:text-primary-100 text-sm transition-colors">
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-primary-300 hover:text-primary-100 text-sm transition-colors">
                                    Careers
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-semibold text-primary-100 mb-2">Support</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-primary-300 hover:text-primary-100 text-sm transition-colors">
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-primary-300 hover:text-primary-100 text-sm transition-colors">
                                    Contact
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-primary-300 hover:text-primary-100 text-sm transition-colors">
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-semibold text-primary-100 mb-2">Legal</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-primary-300 hover:text-primary-100 text-sm transition-colors">
                                    Privacy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-primary-300 hover:text-primary-100 text-sm transition-colors">
                                    Terms
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-primary-300 hover:text-primary-100 text-sm transition-colors">
                                    Security
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-semibold text-primary-100 mb-2">Developers</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-primary-300 hover:text-primary-100 text-sm transition-colors">
                                    API
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-primary-300 hover:text-primary-100 text-sm transition-colors">
                                    Documentation
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-primary-300 hover:text-primary-100 text-sm transition-colors">
                                    Status
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
