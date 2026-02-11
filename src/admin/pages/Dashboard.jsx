import React, { useMemo } from 'react';
import { useGetDashboardStatsQuery } from '../services/adminApi';
import { formatPrice } from '../../utils/formatPrice';
import { 
    Package, 
    ShoppingBag, 
    DollarSign, 
    BarChart3, 
    User, 
    ArrowUpRight, 
    CheckCircle2 
} from 'lucide-react';
import AdminStatsCard from '../components/AdminStatsCard';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    Cell,
    PieChart,
    Pie
} from 'recharts';

const Dashboard = () => {
    const { data: stats, isLoading, error } = useGetDashboardStatsQuery();

    // Mapping data for the Charts
    const productChartData = useMemo(() => {
        return stats?.top_selling_products?.map(item => ({
            name: item.product__name.split(' ').slice(0, 2).join(' ') + '...', // Shorten name
            sold: item.total_sold,
            fullName: item.product__name
        })) || [];
    }, [stats]);

    if (isLoading) return <div className="p-10 text-center animate-pulse text-gray-500">Loading Analytics...</div>;
    if (error) return <div className="p-10 text-red-500 text-center">Error fetching dashboard data</div>;

    const { 
        total_revenue = 0, 
        total_orders = 0, 
        total_products = 0, 
        recent_orders = [], 
        top_selling_products = [] 
    } = stats || {};

    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'];

    return (
        <div className="p-6 lg:p-10 bg-[#fbfcfd] min-h-screen">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-black text-gray-900">Store Analytics</h1>
                <p className="text-gray-500 font-medium">Real-time overview of your store performance.</p>
            </div>
            
            {/* 1. Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <AdminStatsCard 
                    title="Revenue" 
                    value={formatPrice(total_revenue)} 
                    icon={<DollarSign size={22} />}
                    color="bg-indigo-600"
                    description="Total generated income"
                />
                <AdminStatsCard 
                    title="Orders" 
                    value={total_orders} 
                    icon={<ShoppingBag size={22} />}
                    color="bg-blue-600"
                    description="Completed transactions"
                />
                <AdminStatsCard 
                    title="Catalog" 
                    value={total_products} 
                    icon={<Package size={22} />}
                    color="bg-emerald-600"
                    description="Total active products"
                />
            </div>

            {/* 2. Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                {/* Bar Chart: Top Products */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Product Performance</h3>
                            <p className="text-sm text-gray-500">Units sold per top product</p>
                        </div>
                        <BarChart3 className="text-gray-300" />
                    </div>
                    
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={productChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#6b7280', fontSize: 12, fontWeight: 500}} 
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                                <Tooltip 
                                    cursor={{fill: '#f9fafb'}}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="sold" radius={[10, 10, 0, 0]} barSize={50}>
                                    {productChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* mini Stats / Status */}
                <div className="bg-indigo-900 rounded-3xl p-8 text-white flex flex-col justify-between shadow-xl shadow-indigo-100">
                    <div>
                        <h3 className="text-xl font-bold opacity-90 mb-2">Inventory Health</h3>
                        <p className="text-indigo-200 text-sm">Your product catalog is growing.</p>
                    </div>
                    <div className="py-10">
                        <div className="text-5xl font-black mb-2">{total_products}</div>
                        <div className="text-indigo-300 font-medium">Total Items Online</div>
                    </div>
                    <div className="bg-indigo-800/50 p-4 rounded-2xl flex items-center gap-3">
                        <CheckCircle2 className="text-emerald-400" />
                        <span className="text-sm font-semibold">Store system synchronized</span>
                    </div>
                </div>
            </div>

            {/* 3. Bottom Grid: Orders & Product List */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                
                {/* Recent Orders Table */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-800">Recent Transactions</h3>
                        <button className="text-indigo-600 text-sm font-bold bg-indigo-50 px-3 py-1 rounded-full">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50">
                                <tr className="text-gray-400 text-[11px] uppercase tracking-widest font-bold">
                                    <th className="px-6 py-4">Customer / ID</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recent_orders.map(order => (
                                    <tr key={order.id} className="group hover:bg-gray-50/50 transition-all">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                    <User size={14} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">#{order.id.slice(0, 8).toUpperCase()}</p>
                                                    <p className="text-xs text-gray-500">{order.user__email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black tracking-wide uppercase ${
                                                order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right font-black text-gray-900 text-sm">
                                            {formatPrice(order.total_amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Selling Product Details */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Best Sellers</h3>
                    <div className="space-y-6">
                        {top_selling_products.map(product => (
                            <div key={product.product__id} className="flex items-center gap-5 p-2 rounded-2xl hover:bg-gray-50 transition-all group">
                                <div className="relative">
                                    <img 
                                        src={product.product__image ? `http://127.0.0.1:8000/media/${product.product__image}` : 'https://via.placeholder.com/64'} 
                                        alt={product.product__name} 
                                        className="w-16 h-16 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" 
                                    />
                                    <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[11px] font-black px-2 py-0.5 rounded-full border-2 border-white">
                                        {product.total_sold}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 truncate leading-snug">
                                        {product.product__name}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1 font-medium italic">High Performing Item</p>
                                </div>
                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 group-hover:bg-indigo-50 transition-colors">
                                    <ArrowUpRight size={18} className="text-gray-400 group-hover:text-indigo-600" />
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