import { useState } from 'react';
import { useGetOrdersQuery, useCancelOrderMutation } from '../features/orders/orderApi';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
import toast from 'react-hot-toast';
import ConfirmationModal from '../components/ConfirmationModal';

function Orders() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetOrdersQuery();
  const orders = Array.isArray(data) ? data : data?.results || [];
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const initiateCancelOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (selectedOrderId) {
      try {
        await cancelOrder(selectedOrderId).unwrap();
        toast.success('Order cancelled successfully');
      } catch (err) {
        toast.error(err?.data?.error || 'Failed to cancel order');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Failed to load orders</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No orders yet</h2>
          <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
                <div className="flex gap-8">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Order Placed</p>
                    <p className="text-sm text-gray-900">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Total</p>
                    <p className="text-sm text-gray-900 font-medium">{formatPrice(order.total_amount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Order #</p>
                    <p className="text-sm text-gray-900">{order.id.slice(0, 8)}...</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                   <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {order.status}
                   </div>
                   {order.status === 'PENDING' && (
                     <button 
                        onClick={() => initiateCancelOrder(order.id)}
                        disabled={isCancelling}
                        className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                     >
                       Cancel Order
                     </button>
                   )}
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <div className="space-y-6">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-6 items-start">
                      <div className="w-20 h-20 shrink-0 bg-gray-100 rounded-md overflow-hidden">
                        <img 
                          src={item.product_image || '/placeholder.png'} 
                          alt={item.product_name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                           <a href={`/product/${item.product_slug}`} className="hover:text-indigo-600">
                             {item.product_name}
                           </a>
                        </h4>
                        <p className="text-gray-600 text-sm mt-1">Qty: {item.quantity}</p>
                        <p className="font-medium text-gray-900 mt-1">{formatPrice(item.price)}</p>
                      </div>
                      {/* You could add a 'Buy Again' button here later */}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <ConfirmationModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmCancel}
          title="Cancel Order"
          message="Are you sure you want to cancel this order? This action cannot be undone."
          confirmText={isCancelling ? "Cancelling..." : "Yes, Cancel Order"}
          isDanger={true}
        />
      </div>
    </div>
  );
}

export default Orders;
