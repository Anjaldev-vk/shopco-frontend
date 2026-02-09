
import { useAppSelector } from "../../hooks/reduxHooks";
import { selectCurrentUser } from "../../features/auth/selectors";
import { Bell, Search, Menu } from "lucide-react";

const AdminHeader = ({ onMenuClick }) => {
    const user = useAppSelector(selectCurrentUser);

    return (
        <header className="bg-white border-b border-gray-100 sticky top-0 z-10 px-4 sm:px-8 py-4 flex justify-between items-center">
            
            <div className="flex items-center gap-4 flex-1">
                {/* Mobile Menu Button */}
                <button onClick={onMenuClick} className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-black">
                    <Menu size={24} />
                </button>


            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6">

                <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-900 leading-none">{user?.name || 'Admin User'}</p>
                        <p className="text-xs text-gray-500 mt-1">Administrator</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
                        {user?.name?.[0]?.toUpperCase() || 'A'}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
