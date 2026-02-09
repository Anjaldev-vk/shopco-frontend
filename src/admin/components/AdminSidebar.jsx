
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { logout } from '../../features/auth/authSlice';
import { LayoutDashboard, ShoppingBag, Users, LogOut, Package, X } from 'lucide-react';

const AdminSidebar = ({ isOpen, onClose }) => {
    const dispatch = useAppDispatch();
    const location = useLocation();

    const handleLogout = () => {
        dispatch(logout());
        window.location.href = "/"; 
    };

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/products', icon: Package, label: 'Products' },
        { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
        { path: '/admin/users', icon: Users, label: 'Users' },
    ];

    return (
        <aside className={`
            fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-gray-100 
            transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 
            flex flex-col p-6
            ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        `}>
            {/* Logo & Close Button */}
            <div className="mb-12 px-2 flex justify-between items-center">
                <Link to="/" className="text-2xl font-black tracking-tighter uppercase text-black">
                    SHOP.CO <span className="text-xs font-bold bg-black text-white px-2 py-0.5 rounded ml-1 tracking-normal align-middle">ADMIN</span>
                </Link>
                <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-black">
                    <X size={24} />
                </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <Link 
                        key={item.path} 
                        to={item.path} 
                        onClick={() => onClose()} // Close sidebar on mobile when link clicked
                        className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium ${
                            isActive(item.path) 
                            ? 'bg-black text-white shadow-md' 
                            : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                        }`}
                    >
                        <item.icon size={20} />
                        {item.label}
                    </Link>
                ))}
            </nav>

            {/* Logout */}
            <div className="mt-auto pt-8 border-t border-gray-100">
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200 font-medium group"
                >
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
