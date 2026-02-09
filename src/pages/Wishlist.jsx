import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/reduxHooks';
import { selectWishlistItems, selectWishlistLoading } from '../features/wishlist/selectors';
import { removeFromWishlist } from '../features/wishlist/wishlistSlice';
import { addToCart } from '../features/cart/cartSlice';
import { formatPrice } from '../utils/formatPrice';

function Wishlist() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const wishlistItems = useAppSelector(selectWishlistItems);
  const loading = useAppSelector(selectWishlistLoading);

  const handleRemove = (item) => {
    dispatch(removeFromWishlist({
      wishlistItemId: item.wishlistItemId,
      productName: item.name,
    }));
  };

  const handleMoveToCart = async (item) => {
    try {
      const resultAction = await dispatch(addToCart({ product: item, quantityToAdd: 1 }));
      if (addToCart.fulfilled.match(resultAction)) {
         dispatch(removeFromWishlist({
            wishlistItemId: item.wishlistItemId,
            productName: item.name,
         }));
      }
    } catch (error) {
      console.error("Failed to move to cart", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Loading wishlist...</div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">
            Add items you love to your wishlist
          </p>
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">
          My Wishlist ({wishlistItems.length} items)
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {/* Product Image */}
              <div
                className="aspect-square bg-gray-100 cursor-pointer"
                onClick={() => navigate(`/products/${item.slug}`)}
              >
                <img
                  src={item.image || '/placeholder.png'}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3
                  className="font-semibold text-lg mb-2 cursor-pointer hover:text-indigo-600"
                  onClick={() => navigate(`/products/${item.slug}`)}
                >
                  {item.name}
                </h3>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(item.price)}
                  </span>
                  {item.stock_quantity > 0 ? (
                    <span className="text-sm text-green-600">In Stock</span>
                  ) : (
                    <span className="text-sm text-red-600">Out of Stock</span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    disabled={item.stock_quantity === 0}
                    className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Move to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(item)}
                    className="w-full border border-red-500 text-red-600 py-2 rounded-md hover:bg-red-50 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/products')}
            className="text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            ← Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default Wishlist;
