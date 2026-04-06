import React from "react";
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";

const Topbar = () => {
  return (
    <div className="bg-blue-900 text-white">
      <div className="container mx-auto flex justify-between items-center py-3 px-4 ">
        <div className=" hidden md:flex items-center space-x-4">
          <a href="#" className="hover:text-gray-200">
            <TbBrandMeta className="h-5 w-5" />
          </a>
          <a href="#" className="hover:text-gray-200">
            <IoLogoInstagram className="h-5 w-5" />
          </a>
          <a href="#" className="hover:text-gray-200">
            <RiTwitterXLine className="h-4 w-4" />
          </a>
        </div>
        <div className="text-sm text-center flex-grow">
            <span>We ship Worldwide - Fast and reliable shipping!</span>
        </div>
        <div className="text-sm hidden md:block">
            <a href="tel:+917994076529" className=" hover:text-gray-300">+91 799-4076-529</a>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
