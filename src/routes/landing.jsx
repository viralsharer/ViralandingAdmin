// import React from 'react';
import { Navbar, Tag, ServiceCard, HowItWorksAccordion, Footer } from "@/components";
import { images } from "@/assets";
import { FaMobileAlt, FaGift, FaDatabase, FaCoins, FaLaptop, FaHeadphones } from "react-icons/fa";
import "@/App.css"

const App = () => {
    const services = [
        {
            icon: <FaMobileAlt className="w-6 h-6 text-primary-300" />,
            title: "Mobile Airtime",
            description: "Get instant mobile airtime rewards for sharing your favorite content. Stay connected with friends and family effortlessly.",
        },
        {
            icon: <FaGift className="w-6 h-6 text-primary-300" />,
            title: "Gift Cards",
            description: "Redeem gift cards from top brands and retailers. Enjoy shopping, dining, and entertainment with your earned rewards.",
        },
        {
            icon: <FaDatabase className="w-6 h-6 text-primary-300" />,
            title: "Mobile Data",
            description: "Never run out of data again! Earn mobile data bundles by sharing content and stay online wherever you go.",
        },
        {
            icon: <FaCoins className="w-6 h-6 text-primary-300" />,
            title: "Points",
            description: "Accumulate points and exchange them for exclusive rewards. The more you share, the more points you earn!",
        },
        {
            icon: <FaLaptop className="w-6 h-6 text-primary-300" />,
            title: "Electronics",
            description: "Win the latest gadgets and electronics. From smartphones to laptops, we’ve got you covered.",
        },
        {
            icon: <FaHeadphones className="w-6 h-6 text-primary-300" />,
            title: "Gadgets",
            description: "Earn cool gadgets like headphones, smartwatches, and more. Upgrade your tech game with Virashare.",
        },
    ];

    return (
        <div className="font-body">
            <div className="bg-image-cover relative min-h-200 lg:min-h-screen flex flex-col items-center justify-center" id="">
                <div className="absolute w-full top-0">
                    <Navbar />
                </div>
                <div className="flex flex-col items-center text-center  text-primary-50 px-4">
                    {/* Heading */}
                    <div className="max-w-3xl lg:max-w-4xl">
                        <h1 className="text-4xl max-sm:text-2xl font-medium mb-1">Earn Rewards From Anywhere</h1>
                        <h2 className="text-5xl max-sm:text-4xl font-semibold text-primary-100">Around The World With Virashare</h2>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-primary-200 max-w-md mt-6">Lorem ipsum dolor sit amet consectetur. Id enim cursus risus interdum mattis tellus cursus suspendisse. Sed tristique enim nibh.</p>

                    {/* App Store and Play Store Buttons */}
                    <div className="flex gap-4 mt-8">
                        <a href="#" aria-label="Download on the App Store">
                            <img src={images.appStore} alt="App Store" className="h-12" />
                        </a>
                        <a href="#" aria-label="Download on the Play Store">
                            <img src={images.googlePlay} alt="Play Store" className="h-12" />
                        </a>
                    </div>
                </div>
            </div>

            <div className="bg-image bg-contain">
                <div className="backdrop-blur-sm">
                    <div className=" py-20   text-white max-sm:text-center">
                        <div className="w-[85%] mx-auto">
                            <Tag text="Our Service" otherStyle="mb-3 " />
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                {/* Left Section */}
                                <div className="text-center md:basis-1/2 md:text-left font-heading">
                                    <h3 className="text-3xl max-lg:text-2xl bg-gradient-to-b from-primary-100 to-primary-600 bg-clip-text text-transparent">Unlock Exclusive Rewards</h3>
                                    <h3 className="text-4xl font-body font-medium">With Every Share You Make</h3>
                                </div>

                                {/* Right Section */}
                                <div className="text-center md:basis-1/2 md:text-left">
                                    <p className="text-primary-200">Join thousands of users who are earning amazing rewards by sharing their favorite content. Start today and enjoy the benefits!</p>
                                </div>
                            </div>

                            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {services.map((service, index) => (
                                    <ServiceCard key={index} icon={service.icon} title={service.title} description={service.description} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="py-20">
                        <div className="w-[85%] mx-auto max-sm:text-center">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-20">
                                {/* Left Section */}
                                <div className="text-center md:basis-7/12 md:text-left font-heading">
                                    <Tag text="How It Works" otherStyle="mb-3" />
                                    <h3 className="text-3xl max-lg:text-2xl bg-gradient-to-b from-primary-100 to-primary-600 bg-clip-text text-transparent">Unlock Exclusive Rewards</h3>
                                    <h3 className="text-4xl font-body font-medium text-white mb-8">With Every Share You Make</h3>

                                    {/* How It Works Accordion */}
                                    <HowItWorksAccordion />
                                </div>

                                {/* Right Section */}
                                <div className="relative md:basis-4/12 max-md:hidden">
                                    {/* Floating Box */}
                                    <div className="absolute bg-radial-[at_0%_25%] from-primary-700/50 to-transparent to-65% rounded-full opacity-60 backdrop-blur-lg border border-primary-500/80 z-0 lg:w-[75%] md:w-[100%] aspect-3/2 -translate-x-1/2 left-1/2 top-1/2 translate-y-1/2 -skew-y-6" />

                                    {/* Phone Image */}
                                    <img src={images.phone} alt="ViraShare" className="relative lg:w-[65%] md:w-[80%] mx-auto z-10" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default App;
