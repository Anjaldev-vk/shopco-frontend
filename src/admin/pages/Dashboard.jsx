import React from 'react';
import { useGetDashboardStatsQuery } from '../services/adminApi';
import { formatPrice } from '../../utils/formatPrice';
import { Package, ShoppingBag, DollarSign, TrendingUp, User } from 'lucide-react';
import AdminStatsCard from '../components/AdminStatsCard';

const Dashboard = () => {
    const { data: stats, isLoading, error } = useGetDashboardStatsQuery();

    if (isLoading) return <div className="p-8 text-center text-gray-600 font-medium">Loading dashboard stats...</div>;
    if (error) return <div className="p-8 text-red-500 font-medium">Error loading dashboard stats</div>;

    const { 
        total_revenue = 0, 
        total_orders = 0, 
        total_products = 0, 
        recent_orders = [], 
        top_selling_products = [] 
    } = stats || {};

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <AdminStatsCard 
                    title="Total Revenue" 
                    value={formatPrice(total_revenue)} 
                    icon={<DollarSign size={24} className="text-white" />}
                    color="bg-green-600"
                />
                <AdminStatsCard 
                    title="Total Orders" 
                    value={total_orders} 
                    icon={<ShoppingBag size={24} className="text-white" />}
                    color="bg-blue-600"
                />
                <AdminStatsCard 
                    title="Total Products" 
                    value={total_products} 
                    icon={<Package size={24} className="text-white" />}
                    color="bg-indigo-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Recent Orders</h3>
                    <div className="space-y-4">
                        {recent_orders.map(order => (
                            <div key={order.id} className="flex justify-between items-start py-3 border-b last:border-0 hover:bg-gray-50 transition-colors rounded-lg px-2">
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                        <User size={12} />
                                        <span>{order.user__email}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">{formatPrice(order.total_amount)}</p>
                                    <span className={`mt-1 inline-block px-2 py-0.5 text-[10px] font-bold rounded-full ${
                                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Selling Products Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4 border-b pb-2">
                        <h3 className="text-lg font-semibold text-gray-800">Top Selling Products</h3>
                        <TrendingUp size={18} className="text-indigo-500" />
                    </div>
                    <div className="space-y-4">
                        {top_selling_products.map(product => (
                            <div key={product.product__id} className="flex items-center gap-4 py-3 border-b last:border-0 hover:bg-gray-50 transition-colors rounded-lg px-2">
                                <div className="relative">
                                    <img 
                                        src={product.product__image ? `http://your-api-url.com/media/${product.product__image}` : 'https://via.placeholder.com/48'} 
                                        alt={product.product__name} 
                                        className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-gray-200" 
                                    />
                                    <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                                        {product.total_sold}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
                                        {product.product__name}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Items Sold: {product.total_sold}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;