import React, { useState, useEffect } from 'react';
import { useGetUsersQuery, useToggleUserBlockMutation } from '../services/adminApi';
import Pagination from '../../components/Pagination';
import { User, Shield, Ban, CheckCircle, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/ConfirmationModal';

const Users = () => {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, statusFilter]);

    const queryParams = {};
    if (debouncedSearch) queryParams.search = debouncedSearch;
    if (statusFilter) queryParams.status = statusFilter;
    queryParams.page = currentPage;
    queryParams.page_size = pageSize;

    const { data: users, isLoading, error } = useGetUsersQuery(queryParams);
    const [toggleUserBlock] = useToggleUserBlockMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const initiateToggleBlock = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleConfirmToggle = async () => {
        if (selectedUser) {
            const action = selectedUser.is_active ? "block" : "unblock";
            try {
                await toggleUserBlock(selectedUser.id).unwrap();
                toast.success(`User ${action}ed successfully`);
            } catch (err) {
                toast.error(`Failed to ${action} user`);
                console.error(err);
            }
        }
    };

    if (isLoading) return <div className="p-4">Loading users...</div>;
    if (error) return <div className="p-4 text-red-500">Error loading users</div>;

    const userList = Array.isArray(users) ? users : users?.results || [];
    const totalCount = users?.count || 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Users Management</h2>
                
                <div className="flex flex-1 w-full md:w-auto gap-4 items-center justify-end">
                    {/* Search Bar */}
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search Name or Email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    </div>

                    {/* Status Filter */}
                    <div className="relative w-full md:w-48">
                         <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
                        >
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="blocked">Blocked</option>
                        </select>
                        <Filter className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    </div>
                </div>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {userList.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                                            <User size={20} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{user.name || 'No Name'}</div>
                                            <div className="text-sm text-gray-500">ID: {user.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {user.role || 'USER'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {user.is_active ? 'Active' : 'Blocked'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {!user.is_superuser && (
                                        <button 
                                            onClick={() => initiateToggleBlock(user)}
                                            className={`${user.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'} flex items-center gap-1`}
                                        >
                                            {user.is_active ? <><Ban size={16} /> Block</> : <><CheckCircle size={16} /> Unblock</>}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {userList.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {!isLoading && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    hasNext={!!users?.next}
                    hasPrevious={!!users?.previous}
                />
            )}

            <ConfirmationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmToggle}
                title={selectedUser?.is_active ? "Block User" : "Unblock User"}
                message={`Are you sure you want to ${selectedUser?.is_active ? "block" : "unblock"} this user?`}
                confirmText={selectedUser?.is_active ? "Yes, Block" : "Yes, Unblock"}
                isDanger={selectedUser?.is_active}
            />
        </div>
    );
};

export default Users;
