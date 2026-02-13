import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/reduxHooks';
import { selectCartItems, selectCartTotal } from '../features/cart/selectors';
import { clearCart } from '../features/cart/cartSlice';
import { useCreateOrderMutation } from '../features/orders/orderApi';
import { useAddAddressMutation } from '../features/shipping/shippingApi';
import { useCreateRazorpayOrderMutation, useVerifyRazorpayPaymentMutation } from '../features/payments/paymentApi';
import { formatPrice } from '../utils/formatPrice';
import { isValidPhone, isRequired } from '../utils/validators';
import toast from 'react-hot-toast';

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  const cartItems = useAppSelector(selectCartItems);
  const cartTotal = useAppSelector(selectCartTotal);
  
  // Handle Buy Now items passed via navigation state
  const buyNowItems = location.state?.buyNowItems;
  
  // Determine which items to checkout
  const checkoutItems = buyNowItems || cartItems;
  
  // Calculate total for buy now items, or use cart total
  const totalAmount = buyNowItems 
    ? buyNowItems.reduce((acc, item) => acc + (item.final_price || item.price) * item.quantity, 0)
    : cartTotal;

  const [addAddress, { isLoading: isAddressLoading }] = useAddAddressMutation();
  const [createOrder, { isLoading: isOrderLoading }] = useCreateOrderMutation();
  const [createRazorpayOrder, { isLoading: isRazorpayLoading }] = useCreateRazorpayOrderMutation();
  const [verifyRazorpayPayment, { isLoading: isVerifyLoading }] = useVerifyRazorpayPaymentMutation();

  const isLoading = isAddressLoading || isOrderLoading || isRazorpayLoading || isVerifyLoading;
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'COD',
  });

  useEffect(() => {
     // If no buy now items and cart is empty, redirect
     if (!buyNowItems && cartItems.length === 0) {
         // Optionally redirect here if needed
     }
  }, [buyNowItems, cartItems, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!isRequired(formData.fullName)) return toast.error('Please enter your full name');
    if (!isRequired(formData.email)) return toast.error('Please enter your email');
    if (!isValidPhone(formData.phone)) return toast.error('Please enter a valid 10-digit phone number');
    if (!isRequired(formData.address)) return toast.error('Please enter your address');
    if (!isRequired(formData.city)) return toast.error('Please enter your city');
    if (!isRequired(formData.state)) return toast.error('Please enter your state');
    if (!isRequired(formData.pincode)) return toast.error('Please enter your pincode');
    return true;
  };

  const handleRazorpayPayment = async (orderId, amount) => {
    try {
      const data = await createRazorpayOrder({ order_id: orderId }).unwrap();

      const options = {
        key: data.razorpay_key_id,
        amount: data.amount,
        currency: data.currency,
        name: "Shop.co",
        description: "Order Payment",
        order_id: data.razorpay_order_id,
        handler: async (response) => {
          try {
            await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }).unwrap();
            
            toast.success("Payment Successful!");
            if (!buyNowItems) {
               dispatch(clearCart());
            }
            navigate('/order-success', { state: { orderId: orderId } });
          } catch (error) {
            console.error(error);
            toast.error("Payment Verification Failed");
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response){
          toast.error(response.error.description);
      });
      rzp1.open();
    } catch (error) {
      console.error(error);
      toast.error("Failed to initiate Razorpay payment");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (checkoutItems.length === 0) {
      toast.error('No items to checkout');
      navigate('/cart');
      return;
    }

    try {
      // 1. Save Address
      const addressData = {
        full_name: formData.fullName,
        phone: formData.phone,
        address_line_1: formData.address,
        city: formData.city,
        state: formData.state,
        postal_code: formData.pincode,
        country: 'India', 
      };
      
      await addAddress(addressData).unwrap();
            
      // 2. Create Order (always create pending order first)
      const orderPayload = {
        payment_method: formData.paymentMethod === 'ONLINE' ? 'RAZORPAY' : 'COD',
      };

      if (buyNowItems) {
        orderPayload.items = buyNowItems.map(item => ({
            product_id: item.id,
            quantity: item.quantity
        }));
      }

      const result = await createOrder(orderPayload).unwrap();
      
      if (formData.paymentMethod === 'ONLINE') {
        // 3. Handle Razorpay
        await handleRazorpayPayment(result.id, totalAmount);
      } else {
        // 3. Handle COD
        toast.success('Order placed successfully!');
        if (!buyNowItems) {
            dispatch(clearCart());
        }
        navigate('/order-success', { state: { orderId: result.id } });
      }

    } catch (error) {
      console.error(error);
      toast.error(error?.data?.error || 'Failed to place order');
    }
  };

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your checkout is empty</h2>
          <button
            onClick={() => navigate('/products')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
              {/* Contact Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={formData.paymentMethod === 'COD'}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span className="font-medium">Cash on Delivery</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="ONLINE"
                      checked={formData.paymentMethod === 'ONLINE'}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span className="font-medium">Online Payment (Razorpay)</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition disabled:opacity-50 font-semibold"
              >
                {isLoading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-2">
                {checkoutItems.map((item, idx) => (
                  <div key={item.id + idx} className="flex gap-3">
                    <img
                      src={item.image || '/placeholder.png'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      {item.selectedSize && <p className="text-xs text-gray-500">Size: {item.selectedSize}</p>}
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold">
                        {formatPrice((item.final_price || item.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
              </div>
              
              {buyNowItems && (
                 <div className="mt-4 p-3 bg-blue-50text-sm rounded-md">
                   {/* <strong>Buy Now Mode:</strong> Only the select items are being purchased. Your cart will not be cleared. */}
                 </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
