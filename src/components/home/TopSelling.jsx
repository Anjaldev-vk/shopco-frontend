import React, { useState } from "react";
import ProductCard from "../ProductCard";

const TopSelling = ({ products = [], loading = false, error = null }) => {
  const [showAll, setShowAll] = useState(false);

  const displayedProducts = showAll ? products : products.slice(0, 4);

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-black text-center mb-12 uppercase tracking-tighter">
          Top Selling
        </h2>

        {loading ? (
          <div className="text-center text-gray-700">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">
            {error.message || "Failed to fetch products. Please try again."}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
             {products.length === 0 && <p className="col-span-full text-center text-gray-500">No top selling products found.</p>}
          </div>
        )}

        {products.length > 4 && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(!showAll)}
              className="bg-white text-black border border-gray-200 px-16 py-3 rounded-full font-medium text-base hover:bg-black hover:text-white transition-all duration-300"
            >
              {showAll ? "Show Less" : "View All"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopSelling;
