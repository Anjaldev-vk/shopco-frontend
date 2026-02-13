import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetOrderByIdQuery, useUpdateOrderStatusMutation, useAdminCancelOrderMutation } from '../services/adminApi';
import { formatPrice } from '../../utils/formatPrice';
import { ArrowLeft, Package, User, MapPin, CreditCard, Calendar, Clock, AlertTriangle, Truck, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/ConfirmationModal';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: order, isLoading, error } = useGetOrderByIdQuery(id);
    const [updateOrderStatus] = useUpdateOrderStatusMutation();
    const [cancelOrder] = useAdminCancelOrderMutation();

    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    
    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading order details...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error loading order. It might not exist.</div>;
    if (!order) return null;
    
    console.log(order)

    const handleStatusChange = async (newStatus) => {
        try {
            await updateOrderStatus({ id: order.id, status: newStatus }).unwrap();
            toast.success(`Order status updated to ${newStatus}`);
        } catch (err) {
            toast.error('Failed to update status');
            console.error(err);
        }
    };

    const handleCancelOrder = async () => {
        try {
            await cancelOrder(order.id).unwrap();
            toast.success('Order cancelled successfully');
        } catch (err) {
            toast.error(err?.data?.error || 'Failed to cancel order');
        }
    };

    const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

    const getStatusColor = (status) => {
        const colors = {
          PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          PROCESSING: 'bg-blue-100 text-blue-800 border-blue-200',
          SHIPPED: 'bg-purple-100 text-purple-800 border-purple-200',
          DELIVERED: 'bg-green-100 text-green-800 border-green-200',
          CANCELLED: 'bg-red-100 text-red-800 border-red-200',
          CANCELED: 'bg-red-100 text-red-800 border-red-200',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    
    return (
        <div className="max-w-6xl mx-auto pb-10">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button 
                    onClick={() => navigate('/admin/orders')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
                <div className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                    {order.status}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Order Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                <Package size={18} /> Order Items
                            </h3>
                            <span className="text-sm text-gray-500 font-medium">
                                {order.items?.length || 0} items
                            </span>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {order.items?.map((item) => (
                                <div key={item.id} className="p-4 flex gap-4 hover:bg-gray-50 transition-colors">
                                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
                                        {/* Assuming item.product.images exists or handling fallback */}
                                        <img 
                                            src={item.product?.image || item.image || "https://via.placeholder.com/80"} 
                                            alt={item.product_name} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                                        <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                                        <p className="text-sm font-semibold text-gray-900 mt-2">{formatPrice(item.price)}</p>
                                    </div>
                                    <div className="text-right font-medium text-gray-900">
                                        {formatPrice(item.price * item.quantity)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">{formatPrice(order.total_amount)}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-bold text-gray-900 mt-2 pt-2 border-t border-gray-200">
                                <span>Total</span>
                                <span>{formatPrice(order.total_amount)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Status & Info */}
                <div className="space-y-6">
                    {/* Actions Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Clock size={18} /> Order Actions
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    disabled={order.status === 'CANCELLED' || order.status === 'DELIVERED'}
                                    className="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                                >
                                    {statuses.map((status) => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>

                            { order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                                <button
                                    onClick={() => setIsCancelModalOpen(true)}
                                    className="w-full flex justify-center items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    <AlertTriangle size={16} /> Cancel Order
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <User size={18} /> Customer Details
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-gray-500">Name</p>
                                <p className="font-medium text-gray-900">{order.shipping_address?.full_name || order.user_name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Email</p>
                                <p className="font-medium text-gray-900">{order.user_email || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Phone</p>
                                <p className="font-medium text-gray-900">{order.shipping_address?.phone || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                     {/* Shipping Address */}
                     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <MapPin size={18} /> Shipping Address
                        </h3>
                        {order.shipping_address ? (
                            <div className="text-sm text-gray-600 leading-relaxed">
                                <p>{order.shipping_address.address_line_1}</p>
                                {order.shipping_address.address_line_2 && <p>{order.shipping_address.address_line_2}</p>}
                                <p>
                                    {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                                </p>
                                <p>{order.shipping_address.country}</p>
                                <p className="mt-2 text-gray-500 font-medium">Phone: {order.shipping_address.phone}</p>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 italic">No shipping address provided</p>
                        )}
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <CreditCard size={18} /> Payment Info
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Payment Method</span>
                                <span className="font-medium text-gray-900">{order.payment?.payment_method? 'UPI' : 'COD'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Payment Status</span>
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.payment_status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {order.payment_status || 'PENDING'}
                                </span>
                            </div>
                            <div>
                                <p className="text-gray-500">Placed On</p>
                                <p className="font-medium text-gray-900">
                                    {new Date(order.created_at).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmationModal 
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={handleCancelOrder}
                title="Cancel Order"
                message="Are you sure you want to cancel this order? This action cannot be undone."
                confirmText="Yes, Cancel Order"
                isDanger={true}
            />
        </div>
    );
};

export default OrderDetail;
