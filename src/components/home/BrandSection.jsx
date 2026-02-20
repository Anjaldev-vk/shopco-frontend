import React, { useState, useEffect } from "react";
import api from "../../services/axiosBaseQuery";

const BrandSection = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Assuming the API endpoint is the same
    api.get("/api/brands/") // Adjusted endpoint if needed, often it's /brands or /api/brands
      .then(res => setBrands(res.data))
      .catch(err => {
        // Fallback or silence error if endpoint doesn't exist yet
        console.warn("Failed to fetch brands", err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null; // Or a skeleton
  if (error || brands.length === 0) return null; // Hide if no brands

  return (
    <div className="bg-black py-4 sm:py-6 md:py-8">
      <div className="flex flex-wrap justify-center gap-4 sm:gap-8 md:gap-12 px-4 sm:px-6 md:px-8">
        {brands.map((brand) => (
          <img
            key={brand.id}
            src={brand.logo}
            alt={brand.name}
            className="h-8 sm:h-10 md:h-12 filter invert object-contain"
          />
        ))}
      </div>
    </div>
  );
};

export default BrandSection;
