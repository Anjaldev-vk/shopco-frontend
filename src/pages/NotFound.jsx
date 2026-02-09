import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MoveLeft } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
            <div className="text-center max-w-2xl mx-auto relative">
                {/* Background Large Text */}
                <h1 className="text-[12rem] sm:text-[18rem] font-black text-gray-50 leading-none select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10">
                    404
                </h1>

                {/* Content */}
                <div className="relative z-10">
                    <p className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-4">Error 404</p>
                    <h2 className="text-4xl sm:text-6xl font-black text-black tracking-tight mb-6">
                        Page Not Found
                    </h2>
                    <p className="text-gray-500 text-lg sm:text-xl mb-10 max-w-lg mx-auto">
                        Oops! The page you are looking for seems to have wandered off. Let's get you back on track.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link 
                            to="/" 
                            className="w-full sm:w-auto px-8 py-4 bg-black text-white rounded-full font-bold uppercase tracking-wider hover:bg-gray-900 transition-all flex items-center justify-center gap-2 group"
                        >
                            Go to Homepage
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        
                        <button 
                            onClick={() => window.history.back()}
                            className="w-full sm:w-auto px-8 py-4 bg-gray-100 text-black rounded-full font-bold uppercase tracking-wider hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                        >
                            <MoveLeft size={20} />
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
