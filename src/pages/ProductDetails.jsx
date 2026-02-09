import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useGetProductBySlugQuery } from "../features/products/productApi";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { addToCart } from "../features/cart/cartSlice";
import { addToWishlist, removeFromWishlist } from "../features/wishlist/wishlistSlice";
import { selectIsInWishlist } from "../features/wishlist/selectors";
import { selectCartItems } from "../features/cart/selectors";
import { selectCurrentUser } from "../features/auth/selectors";
import { formatPrice } from "../utils/formatPrice";
import StarRating from "../components/StarRating";
import { LoadingSpinner } from "../components/Loading";
import toast from "react-hot-toast";
import { Check, Minus, Plus, Heart } from "lucide-react";

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const currentUser = useAppSelector(selectCurrentUser);
  const cartItems = useAppSelector(selectCartItems);
  const { data: product, isLoading, error } = useGetProductBySlugQuery(slug);
  
  const isInWishlist = useAppSelector((state) => 
    product ? selectIsInWishlist(product.id)(state) : false
  );
  
  const wishlistItem = useAppSelector(state => 
    product ? state.wishlist.items.find(item => item.id === product.id) : null
  );

  // Calculate distinct available stock (Inventory - In Cart)
  const cartItem = product ? cartItems.find(item => item.id === product.id) : null;
  const currentCartQuantity = cartItem ? cartItem.quantity : 0;
  const availableToAdd = product ? Math.max(0, product.stock_quantity - currentCartQuantity) : 0;
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    if (product && product.sizes && product.sizes.length > 0 && !selectedSize) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product, selectedSize]);

  // Reset quantity if it exceeds availableToAdd when cart changes
  useEffect(() => {
    if (availableToAdd < quantity && availableToAdd > 0) {
      setQuantity(availableToAdd);
    } else if (availableToAdd === 0) {
      setQuantity(0); 
    } else if (quantity === 0 && availableToAdd > 0) {
        setQuantity(1);
    }
  }, [availableToAdd, quantity]);

  const isOutOfStock = product && product.stock_quantity <= 0;
  const isMaxLimitReached = availableToAdd <= 0 && !isOutOfStock;

  const handleAddToCart = () => {
    if (!currentUser) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    if (!product || isOutOfStock) return;
    
    if (quantity > availableToAdd) {
        toast.error(`Cannot add ${quantity} more. You already have ${currentCartQuantity} in cart.`);
        return;
    }

    dispatch(addToCart({ product, quantityToAdd: quantity }));
    toast.success('Added to cart!');
  };

  const handleToggleWishlist = () => {
    if (!currentUser) {
      toast.error('Please login to manage wishlist');
      navigate('/login');
      return;
    }
    if (!product) return;
    
    if (isInWishlist && wishlistItem) {
        dispatch(removeFromWishlist({ wishlistItemId: wishlistItem.wishlistItemId, productName: product.name }));
    } else {
        dispatch(addToWishlist({ product }));
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Product not found</h2>
            <button onClick={() => navigate('/products')} className="text-black border-b border-black pb-1 hover:opacity-70">
                Browse All Products
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white font-sans overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-64px)]">
        
        <div className="relative bg-[#F2F0F1] flex items-center justify-center p-8 lg:p-12 h-[50vh] lg:h-auto overflow-hidden">
           <button 
             onClick={() => navigate('/')}
             className="absolute top-8 left-8 z-10 text-black hover:opacity-60 font-medium"
           >
             ← Back to Shop
           </button>

           <img
             src={product.image || "https://via.placeholder.com/600x800?text=No+Image"}
             alt={product.name}
             className="max-h-[85%] max-w-full object-contain mix-blend-multiply" 
           />
        </div>

        {/* Right Column: Details - Centered */}
        <div className="flex flex-col justify-center px-6 lg:px-16 h-full overflow-hidden">
           {/* Breadcrumb - Subtle */}
           <div className="text-[10px] text-black/40 mb-4 uppercase tracking-widest font-bold">
              {product.category?.name || 'Shop'} / <span className="text-black">{product.name}</span>
           </div>

           <h1 className="text-3xl lg:text-4xl font-black text-black uppercase tracking-tighter leading-tight mb-4 line-clamp-2">
             {product.name}
           </h1>

           {/* Rating */}
           <div className="flex items-center gap-2 mb-4">
             <StarRating rating={product.rating || 4.5} size="text-sm" />
             <span className="text-xs font-medium text-black">
                {product.rating || 4.5} <span className="text-black/40 font-normal">/ 5</span>
             </span>
           </div>

           {/* Price */}
           <div className="flex items-baseline gap-3 mb-6">
             {product.discount_price && product.price > product.discount_price ? (
               <>
                 <span className="text-3xl font-bold text-black">
                   {formatPrice(product.final_price || product.discount_price)}
                 </span>
                 <span className="text-xl font-medium text-black/30 line-through">
                   {formatPrice(product.price)}
                 </span>
               </>
             ) : (
               <span className="text-3xl font-bold text-black">
                 {formatPrice(product.price)}
               </span>
             )}
           </div>

           <p className="text-black/70 text-sm leading-relaxed mb-6 max-w-lg line-clamp-3">
             {product.description}
           </p>

           {/* Sizes */}
           {product.sizes && product.sizes.length > 0 && (
             <div className="mb-6">
               <p className="text-[10px] font-bold text-black uppercase tracking-widest mb-3">Select Size</p>
               <div className="flex flex-wrap gap-2">
                 {product.sizes.map((size) => (
                   <button
                     key={size}
                     onClick={() => setSelectedSize(size)}
                     className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold transition-all border ${
                       selectedSize === size
                         ? 'bg-black text-white border-black'
                         : 'bg-transparent text-black border-black/20 hover:border-black'
                     }`}
                   >
                     {size}
                   </button>
                 ))}
               </div>
             </div>
           )}

           {/* Actions */}
           <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center bg-gray-100 rounded-full h-12 px-4 gap-4">
                 <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    className="hover:opacity-50 text-lg font-medium"
                    disabled={availableToAdd === 0}
                 >
                    –
                 </button>
                 <span className="font-bold w-4 text-center text-sm">{quantity}</span>
                 <button 
                    onClick={() => setQuantity(prev => Math.min(prev + 1, availableToAdd))} 
                    className="hover:opacity-50 text-lg font-medium"
                    disabled={quantity >= availableToAdd}
                 >
                    +
                 </button>
              </div>

               <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isMaxLimitReached || quantity === 0}
                  className="bg-black text-white rounded-full h-12 px-8 text-sm font-bold uppercase tracking-wide hover:scale-105 transition-transform disabled:bg-gray-300 disabled:scale-100 disabled:cursor-not-allowed"
               >
                  {isOutOfStock ? 'Out of Stock' : isMaxLimitReached ? 'Limit Reached' : 'Add to Cart'}
               </button>

               <button 
                  onClick={handleToggleWishlist}
                  className={`h-12 w-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:border-black hover:text-white transition-all ${isInWishlist ? 'bg-black text-white' : 'text-black'}`}
               >
                  <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-white' : ''}`} />
               </button>
           </div>

           {/* Footer note */}
           <p className="mt-8 text-[10px] text-black/40">
             Free shipping on all orders over $200.
           </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
