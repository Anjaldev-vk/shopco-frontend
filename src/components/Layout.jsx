
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
    const location = useLocation();
    const isDarkPage = ['/', '/about', '/contact'].includes(location.pathname);
    
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <div className="h-10"></div>
            
            <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
