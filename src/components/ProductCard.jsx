import React from "react";
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { addToCart } from "../features/cart/cartSlice";
import { addToWishlist, removeFromWishlist } from "../features/wishlist/wishlistSlice";
import { selectWishlistItems } from "../features/wishlist/selectors";
import { formatPrice } from "../utils/formatPrice";
import StarRating from "./StarRating";

const HeartIcon = ({ isInWishlist, ...props }) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill={isInWishlist ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const ShoppingBagIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);


const ProductCard = ({ product }) => {
  if (!product || !product.id) {
    return null; 
  }

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const wishlistItems = useAppSelector(selectWishlistItems);

  const wishlistItem = wishlistItems.find((item) => item.id === product.id);
  const isInWishlist = !!wishlistItem;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart({ product }));
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    if (isInWishlist) {
      dispatch(removeFromWishlist({ wishlistItemId: wishlistItem.wishlistItemId, productName: product.name }));
    } else {
      dispatch(addToWishlist({ product }));
    }
  };

  const handleNavigate = () => {
    if (product && product.slug) {
      navigate(`/products/${product.slug}`);
    } else {
      console.error("Attempted to navigate with an invalid product slug.");
    }
  };

  // Fallbacks for missing backend data
  const imageUrl = product.image || "https://via.placeholder.com/300x300?text=No+Image";
  const rating = product.rating || 4.5; // Default rating since backend doesn't have it
  const reviewCount = product.reviews_count || 0;
  const brand = product.brand || 'Shop.co'; 

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="group flex flex-col cursor-pointer"
      onClick={handleNavigate}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[20px] bg-[#F0EEED] mb-4">
        <img
          src={imageUrl}
          alt={product.name || "Product Image"}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/300x400?text=No+Image";
          }}
        />
        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Wishlist Button */}
        <button
            onClick={handleToggleWishlist}
            className={`absolute top-4 right-4 p-2 rounded-full shadow-sm transition-all duration-200 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 bg-white hover:bg-black hover:text-white ${isInWishlist ? 'text-red-500' : 'text-black'}`}
          >
            <HeartIcon isInWishlist={isInWishlist} className="w-5 h-5 fill-current" />
        </button>

        {/* Discount Badge */}
        {product.discount_price && product.price > product.discount_price && (
           <div className="absolute top-4 left-4 bg-[#FF3333] text-white text-[10px] font-bold px-3 py-1.5 rounded-full">
             -{Math.round(((product.price - product.discount_price) / product.price) * 100)}%
           </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-base font-bold text-black capitalize truncate">
          {product.name || "Unnamed Product"}
        </h3>
        
        <div className="flex items-center gap-2">
          <StarRating rating={rating} size="text-sm" />
          <span className="text-xs text-gray-500">
            {rating}/5
          </span>
        </div>

        <div className="flex items-center gap-2 mt-1">
          {product.discount_price && product.price > product.discount_price ? (
            <>
              <p className="text-xl font-bold text-black">
                {formatPrice(product.final_price || product.discount_price)}
              </p>
              <p className="text-xl font-bold text-black/40 line-through">
                {formatPrice(product.price)}
              </p>
            </>
          ) : (
            <p className="text-xl font-bold text-black">
              {formatPrice(product.price)}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
