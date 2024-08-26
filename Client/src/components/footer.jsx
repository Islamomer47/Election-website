"use client";

import { Footer } from "flowbite-react";
import { BsFacebook, BsInstagram, BsTwitter } from "react-icons/bs";
import Logo from "../assets/img/Logo.png";
import { Link } from "react-router-dom";

export function Foot() {
  return (
    <>
      <Footer
        container
        className="bg-gradient-to-r from-black via-[#007a3d] to-[#ce1126] text-white shadow-md rounded-none"
      >
        <div className="w-full text-center p-4 rounded-none">
          <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-none">
            <Footer.Brand
              src={Logo}
              alt="انتخاباتي Logo"
              name="انتخاباتي"
              className="text-white text-2xl font-bold w-4xl h-20 rounded-none"
            />
            <Footer.LinkGroup className="flex flex-col sm:flex-row sm:space-x-6 mt-4 sm:mt-0 rounded-none">
              <Link
                to="/PartyListNominationForm"
                className="text-white hover:text-gray-300 transition-colors duration-300 rounded-none pl-5"
              >
                طلب ترشيح قائمة حزبية
              </Link>{" "}
              <Link
                to="/nomination"
                className="text-white hover:text-gray-300 transition-colors duration-300 rounded-none"
              >
                طلب ترشيح قائمة محلية
              </Link>
            </Footer.LinkGroup>
          </div>

          <div className=" flex space-x-6 sm:mt-0 sm:justify-center items-center">
            <a
              href="https://www.facebook.com/IECjordan/?_rdc"
              className="text-white hover:text-gray-300 transition-colors mx-6 duration-300"
            >
              <BsFacebook className="w-8 h-8" />
            </a>
            <a
              href="https://www.instagram.com/iecjo/"
              className="text-white hover:text-gray-300 transition-colors duration-300"
            >
              <BsInstagram className="w-8 h-8" />
            </a>
            <a
              href="https://x.com/iecjo"
              className="text-white hover:text-gray-300 transition-colors duration-300"
            >
              <BsTwitter className="w-8 h-8" />
            </a>
          </div>
        </div>
        {/* New content section */}
      </Footer>
      <div className="w-full text-center p-4 bg-black bg-opacity-90">
        <p className="text-white text-sm">
          © {new Date().getFullYear()} انتخاباتي. جميع الحقوق محفوظة.
        </p>
        <p className="text-white text-sm mt-2">
          تصميم وتطوير بواسطة فريقنا الرائع.
        </p>
      </div>
    </>
  );
}
