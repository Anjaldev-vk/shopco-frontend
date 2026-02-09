import React from "react";
import { Twitter, Facebook, Instagram, Github, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#F0F0F0] pt-12 pb-8 px-4 sm:px-6 md:px-8 mt-16 font-sans">
      <div className="max-w-7xl mx-auto relative -top-24">
        {/* Newsletter Section */}
        <div className="bg-black text-white p-8 md:p-12 rounded-[20px] flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 font-integral">
              STAY UP TO DATE ABOUT OUR LATEST OFFERS
            </h2>
          </div>
          <div className="w-full md:w-auto flex flex-col gap-3">
             <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full md:w-80 py-3 pl-12 pr-4 rounded-full bg-white text-black outline-none focus:ring-2 focus:ring-gray-300 placeholder-gray-500"
                />
             </div>
             <button className="w-full md:w-80 bg-white text-black py-3 rounded-full font-medium hover:bg-gray-100 transition-colors">
               Subscribe to Newsletter
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12 border-b border-gray-200 pb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-3xl font-extrabold tracking-tighter">SHOP.CO</h3>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
              We have clothes that suits your style and which you’re proud to wear. From women to men.
            </p>
            <div className="flex space-x-3">
               {[Twitter, Facebook, Instagram, Github].map((Icon, i) => (
                 <a key={i} href="#" className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all group">
                   <Icon className="w-4 h-4 text-black group-hover:text-white transition-colors" />
                 </a>
               ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-semibold text-gray-900 tracking-wider uppercase mb-6 text-sm">Company</h4>
            <ul className="space-y-4">
              {['About', 'Features', 'Works', 'Career'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-500 hover:text-black text-sm transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
             <h4 className="font-semibold text-gray-900 tracking-wider uppercase mb-6 text-sm">Help</h4>
             <ul className="space-y-4">
               {['Customer Support', 'Delivery Details', 'Terms & Conditions', 'Privacy Policy'].map((link) => (
                 <li key={link}>
                   <a href="#" className="text-gray-500 hover:text-black text-sm transition-colors">{link}</a>
                 </li>
               ))}
             </ul>
          </div>

          <div>
             <h4 className="font-semibold text-gray-900 tracking-wider uppercase mb-6 text-sm">FAQ</h4>
             <ul className="space-y-4">
               {['Account', 'Manage Deliveries', 'Orders', 'Payments'].map((link) => (
                 <li key={link}>
                   <a href="#" className="text-gray-500 hover:text-black text-sm transition-colors">{link}</a>
                 </li>
               ))}
             </ul>
          </div>

          <div>
             <h4 className="font-semibold text-gray-900 tracking-wider uppercase mb-6 text-sm">Resources</h4>
             <ul className="space-y-4">
               {['Free eBooks', 'Development Tutorial', 'How to - Blog', 'Youtube Playlist'].map((link) => (
                 <li key={link}>
                   <a href="#" className="text-gray-500 hover:text-black text-sm transition-colors">{link}</a>
                 </li>
               ))}
             </ul>
          </div>
        </div>

        {/* Copyright & Payments */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-gray-500 text-sm">Shop.co © 2000-2023, All Rights Reserved</p>
           <div className="flex space-x-3">
               {/* Using placehold.co/actual SVGs recommended, using text/divs for now if assets missing */}
               <div className="bg-white px-2 py-1 rounded border border-gray-200 shadow-sm w-12 h-8 flex items-center justify-center">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-3 object-contain" />
               </div>
               <div className="bg-white px-2 py-1 rounded border border-gray-200 shadow-sm w-12 h-8 flex items-center justify-center">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-4 object-contain" />
               </div>
               <div className="bg-white px-2 py-1 rounded border border-gray-200 shadow-sm w-12 h-8 flex items-center justify-center">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" className="h-3 object-contain" />
               </div>
               <div className="bg-white px-2 py-1 rounded border border-gray-200 shadow-sm w-12 h-8 flex items-center justify-center">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Apple_Pay_logo.svg/2560px-Apple_Pay_logo.svg.png" alt="Apple Pay" className="h-4 object-contain" />
               </div>
               <div className="bg-white px-2 py-1 rounded border border-gray-200 shadow-sm w-12 h-8 flex items-center justify-center">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Google_Pay_Logo.svg/2560px-Google_Pay_Logo.svg.png" alt="Google Pay" className="h-4 object-contain" />
               </div>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
