import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BrandSection from "./BrandSection.jsx";
import navVideo from '../../assets/hero.mp4';

const Counter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(target, 10);
    const increment = end / (duration / 16);
    let current = start;

    const animate = () => {
      current += increment;
      if (current < end) {
        setCount(Math.floor(current));
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  return <span>{count.toLocaleString()}+</span>;
};

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Reduced min-h from 75vh to 60vh and py-7 to py-10 for a slimmer look */}
      <div
        className="relative w-screen left-1/2 -translate-x-1/2 flex flex-col items-center justify-center min-h-screen text-center px-4 py-10 overflow-hidden bg-black"
      >
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          src={navVideo}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-black/60 z-0"></div>

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          {/* Reduced mb-6 to mb-4 */}
          <span className="inline-block px-4 py-1 text-xs sm:text-sm font-semibold tracking-wider text-white uppercase bg-white/10 backdrop-blur-md rounded-full border border-white/20 animate-fade-in-up mb-4">
            New Collection 2026
          </span>

          {/* Reduced mb-6 to mb-4 and text sizes slightly */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight leading-tight animate-slide-up text-center drop-shadow-lg">
            Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Wardrobe</span>
          </h1>

          {/* Reduced mb-10 to mb-8 */}
          <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed text-center font-light">
            Discover our exclusive collection of finely crafted garments,
            designed to reflect your unique style and sophistication.
          </p>

          <button
            className="group relative bg-white text-black px-7 py-3 rounded-full font-bold text-sm sm:text-base hover:bg-gray-100 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transform hover:-translate-y-1"
            onClick={() => navigate("/products")}
          >
            <span className="relative z-10 flex items-center gap-2">
              Shop Now
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </span>
          </button>

          {/* Reduced mt-16 to mt-12 and pt-8 to pt-6 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-12 mt-12 w-full max-w-3xl border-t border-white/10 pt-6">
            <div className="flex flex-col items-center">
              <p className="text-2xl sm:text-3xl font-bold text-white mb-0.5">
                <Counter target={200} />
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wide">
                International Brands
              </p>
            </div>
            <div className="flex flex-col items-center border-l border-r border-white/10 px-2">
              <p className="text-2xl sm:text-3xl font-bold text-white mb-0.5">
                <Counter target={2000} />
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wide">
                High-Quality Products
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-2xl sm:text-3xl font-bold text-white mb-0.5">
                <Counter target={30000} />
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wide">
                Happy Customers
              </p>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-slide-up {
            animation: slide-up 0.8s ease-out forwards;
          }
        `}</style>
      </div>
      <BrandSection />
    </>
  );
};

export default HeroSection;