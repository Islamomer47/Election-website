"use client";

import { Card } from "flowbite-react";
import img from './assets/1.jpg';
import img2 from './assets/2.jpg';
import img3 from './assets/3.jpeg';
import img4 from './assets/4.jpeg';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

export function Card2() {
  return (
    <div className="flex justify-center space-x-4 gap-5 flex-wrap w-full m-3">
      <figure className="relative max-w-sm transition-all duration-300 cursor-pointer filter grayscale hover:grayscale-0">
        <a href="https://x.com/iecjo">
          <img className="h-48 w-80 object-cover rounded-lg" src={img} alt="image description"/>
        </a>
        <figcaption className="absolute inset-0 flex items-center justify-center">
          <a href="https://x.com/iecjo" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-white hover:text-blue-400 transition-colors duration-200" size={48} />
          </a>
        </figcaption>
      </figure>

      <figure className="relative max-w-sm transition-all duration-300 cursor-pointer filter grayscale hover:grayscale-0">
        <a href="https://x.com/iecjo">
          <img className="h-48 w-80 object-cover rounded-lg" src={img2} alt="image description"/>
        </a>
        <figcaption className="absolute inset-0 flex items-center justify-center">
          <a href="https://www.facebook.com/IECjordan/?_rdc" target="_blank" rel="noopener noreferrer">
            <FaFacebook className="text-white hover:text-blue-600 transition-colors duration-200" size={36} />
          </a>
        </figcaption>
      </figure>

      <figure className="relative max-w-sm transition-all duration-300 cursor-pointer filter grayscale hover:grayscale-0">
        <a href="https://x.com/iecjo">
          <img className="h-48 w-80 object-cover rounded-lg" src={img3} alt="image description"/>
        </a>
        <figcaption className="absolute inset-0 flex items-center justify-center">
          <a href="https://www.instagram.com/iecjo/" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="text-white hover:text-pink-600 transition-colors duration-200" size={36} />
          </a>
        </figcaption>
      </figure>

      <figure className="relative max-w-sm transition-all duration-300 cursor-pointer filter grayscale hover:grayscale-0">
        <a href="https://x.com/iecjo">
          <img className="h-48 w-80 object-cover rounded-lg" src={img4} alt="image description"/>
        </a>
        <figcaption className="absolute inset-0 flex items-center justify-center">
          <a href="https://www.youtube.com/channel/UChCqkXV9u6w_2d09UmA2i8w" target="_blank" rel="noopener noreferrer">
            <FaYoutube className="text-white hover:text-pink-600 transition-colors duration-200" size={36} />
          </a>
        </figcaption>
      </figure>
    </div>
  );
}
