import React from 'react';
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '../services/adminApi';
import { formatPrice } from '../../utils/formatPrice';
import { Eye, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const Orders = () => {
    const { data: orders, isLoading, error } = useGetOrdersQuery(); 
    const [updateOrderStatus] = useUpdateOrderStatusMutation();

    if (isLoading) return <div className="p-4">Loading orders...</div>;
    if (error) return <div className="p-4 text-red-500">Error loading orders</div>;

    const orderList = Array.isArray(orders) ? orders : orders?.results || [];

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus({ id: orderId, status: newStatus }).unwrap();
            toast.success(`Order status updated to ${newStatus}`);
        } catch (err) {
            toast.error('Failed to update status');
            console.error(err);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
          PENDING: 'bg-yellow-100 text-yellow-800',
          PROCESSING: 'bg-blue-100 text-blue-800',
          SHIPPED: 'bg-purple-100 text-purple-800',
          DELIVERED: 'bg-green-100 text-green-800',
          CANCELLED: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Orders</h2>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orderList.map((order) => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    #{order.id.slice(0,8)}...
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {order.shipping_address?.full_name || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatPrice(order.total_amount)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="relative group">
                                        <button className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full items-center gap-1 ${getStatusColor(order.status)}`}>
                                            {order.status} <ChevronDown size={12} />
                                        </button>
                                        <div className="absolute z-10 left-0 mt-1 w-32 bg-white rounded-md shadow-lg hidden group-hover:block border border-gray-100">
                                            {statuses.map(status => (
                                                <button
                                                    key={status}
                                                    onClick={() => handleStatusChange(order.id, status)}
                                                    className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1">
                                        <Eye size={16} /> View
                                    </button>
                                </td>
                            </tr>
                        ))}
                         {orderList.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Orders;
