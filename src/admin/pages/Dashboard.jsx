import React from 'react';
import { useGetDashboardStatsQuery } from '../services/adminApi';
import { formatPrice } from '../../utils/formatPrice';
import { Package, ShoppingBag, Users as UsersIcon, DollarSign } from 'lucide-react';
import AdminStatsCard from '../components/AdminStatsCard';

const Dashboard = () => {
    const { data: stats, isLoading, error } = useGetDashboardStatsQuery();

    if (isLoading) return <div className="p-8">Loading dashboard stats...</div>;
    if (error) return <div className="p-8 text-red-500">Error loading dashboard stats</div>;

    // Backend should return: total_revenue, total_orders, total_products, total_users, recent_orders, recent_products
    // Adjust destructuring based on actual backend response structure.
    // Assuming structure based on standard Django Admin Dashboard implementations or what we'd expect.
    // If backend isn't confirming structure, we might need to check AdminDashboardView. 
    // But let's assume reasonable keys.
    const { 
        total_revenue, 
        total_orders, 
        total_products, 
        low_stock_count, 
        recent_orders = [], 
        new_products = [] 
    } = stats || {};

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <AdminStatsCard 
                    title="Total Revenue" 
                    value={formatPrice(total_revenue || 0)} 
                    icon={<DollarSign size={24} className="text-white" />}
                    color="bg-green-500"
                />
                <AdminStatsCard 
                    title="Total Orders" 
                    value={total_orders || 0} 
                    icon={<ShoppingBag size={24} className="text-white" />}
                    color="bg-blue-500"
                />
                <AdminStatsCard 
                    title="Total Products" 
                    value={total_products || 0} 
                    icon={<Package size={24} className="text-white" />}
                    color="bg-indigo-500"
                />
                <AdminStatsCard 
                    title="Low Stock" 
                    value={low_stock_count || 0} 
                    icon={<UsersIcon size={24} className="text-white" />} 
                    color="bg-orange-500"
                    subtext="Items with < 10 stock"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Orders</h3>
                    {recent_orders.map(order => (
                        <div key={order.id} className="flex justify-between items-center py-3 border-b last:border-0">
                            <div>
                                <p className="font-medium text-gray-900">Order #{order.id.slice(0,8)}...</p>
                                <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {order.status}
                            </span>
                        </div>
                    ))}
                    {recent_orders.length === 0 && <p className="text-gray-500 text-sm">No recent orders.</p>}
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">New Products</h3>
                     {new_products.map(product => (
                        <div key={product.id} className="flex items-center gap-4 py-3 border-b last:border-0">
                            <img src={product.image || 'https://via.placeholder.com/40'} alt={product.name} className="w-10 h-10 rounded object-cover" />
                            <div>
                                <p className="font-medium text-gray-900">{product.name}</p>
                                <p className="text-sm text-gray-500">{formatPrice(product.price)}</p>
                            </div>
                        </div>
                    ))}
                    {new_products.length === 0 && <p className="text-gray-500 text-sm">No products found.</p>}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
