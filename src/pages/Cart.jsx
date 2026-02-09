import { useAppSelector, useAppDispatch } from '../hooks/reduxHooks';
import { selectCartItems, selectCartTotal, selectCartItemCount } from '../features/cart/selectors';
import { removeFromCart, updateCartItem } from '../features/cart/cartSlice';
import { formatPrice } from '../utils/formatPrice';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const cartItems = useAppSelector(selectCartItems);
  const cartTotal = useAppSelector(selectCartTotal);
  const cartItemCount = useAppSelector(selectCartItemCount);

  const handleRemove = (item) => {
    dispatch(removeFromCart({ cartItemId: item.cartItemId, productName: item.name }));
  };

  const handleUpdateQuantity = (item, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateCartItem({ cartItemId: item.cartItemId, quantity: newQuantity }));
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
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
        <h1 className="text-3xl font-bold mb-8">Shopping Cart ({cartItemCount} items)</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-6 mb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image || '/placeholder.png'}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-600">{formatPrice(item.price)}</p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                        className="bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="px-4">{item.quantity}</span>
                      
                      {/* Fixed: Added missing opening button tag */}
                      <button
                        onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                        disabled={item.quantity >= item.stock_quantity}
                        className={`px-3 py-1 rounded-md ${
                          item.quantity >= item.stock_quantity
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        +
                      </button>
                    </div>
                    
                    {item.quantity >= item.stock_quantity && (
                      <div className="text-red-500 text-xs mt-1">
                        Max stock reached
                      </div>
                    )}

                    <button
                      onClick={() => handleRemove(item)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium mt-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;