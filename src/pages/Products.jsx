import { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetProductsQuery, useGetCategoriesQuery } from '../features/products/productApi';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { setCategory, setPriceRange, setSortBy, setSearchQuery, setPage } from '../features/products/productSlice';
import { selectProductFilters, selectProductSearchQuery, selectProductPagination } from '../features/products/selectors';
import { useDebounce } from '../hooks/useDebounce';
import { formatPrice } from '../utils/formatPrice';
import ProductCard from '../components/ProductCard';
import { Search, ChevronDown, ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

function Products() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const filters = useAppSelector(selectProductFilters);
  const searchQuery = useAppSelector(selectProductSearchQuery);
  const pagination = useAppSelector(selectProductPagination);
  const { currentPage } = pagination;

  const debouncedSearch = useDebounce(searchQuery, 500);
  
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 4; // Request 8 items per page from server

  // Helper to map UI sort values to API ordering fields
  const getOrderingValue = (sortBy) => {
    switch (sortBy) {
      case 'price-low': return 'price';
      case 'price-high': return '-price';
      case 'name': return 'name';
      case 'newest': return '-created_at';
      default: return '-created_at';
    }
  };

  // Construct query params for the API
  const queryParams = useMemo(() => {
    const params = {
      page: currentPage,
      page_size: itemsPerPage,
      ordering: getOrderingValue(filters.sortBy),
    };
    
    if (filters.category !== 'all') {
      params.category = filters.category;
    }
    
    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    if (filters.priceRange[0] > 0) params.min_price = filters.priceRange[0];
    if (filters.priceRange[1] < 10000) params.max_price = filters.priceRange[1];

    return params;
  }, [currentPage, filters, debouncedSearch]);

  // ...



  // Fetch products from backend with params
  const { data, isLoading, error } = useGetProductsQuery(queryParams);

  const products = data?.results || [];
  const totalItems = data?.count || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // We can't easily calculate max price of *all* products from a paginated response.
  // For now, we'll keep the slider max at a static value or a high default.
  // Alternatively, the backend could return metadata about min/max prices.
  const maxProductPrice = 10000; 

  // Fetch categories
  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = useMemo(() => {
    const cats = Array.isArray(categoriesData) ? categoriesData : categoriesData?.results || [];
    return ['all', ...cats];
  }, [categoriesData]);

  const handleCategoryChange = (category) => {
     // If category is object, pass slug. If 'all', pass 'all'.
     const value = typeof category === 'string' ? category : category.slug;
     dispatch(setCategory(value));
  };

  const handleSortChange = (e) => {
    dispatch(setSortBy(e.target.value));
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const clearFilters = () => {
      dispatch(setCategory('all'));
      dispatch(setSearchQuery(''));
      dispatch(setPriceRange([0, maxProductPrice]));
      dispatch(setPage(1));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
       dispatch(setPage(newPage));
       window.scrollTo({top: 0, behavior: 'smooth'});
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 lg:px-8 pt-8">
        
        {/* Page Title */}
        <div className="mb-6">
           <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2 text-black">
             Shop All
           </h1>
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
             {totalItems} Products found
           </p>
        </div>

        {/* Filter Bar */}
        <div className="top-16 z-30 bg-white border-y border-black/10 py-3 mb-8 flex justify-between items-center transition-all">
           
           <button 
             onClick={() => setShowFilters(!showFilters)}
             className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest hover:opacity-60 transition-opacity"
           >
             {showFilters ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
             {showFilters ? 'Hide Filters' : 'Filter Selection'}
           </button>

           <div className="flex items-center gap-4">
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] hidden sm:inline">
                Sort By
              </span>

              <div className="group relative">
                <select
                  value={filters.sortBy}
                  onChange={handleSortChange}
                  className="appearance-none bg-white border border-gray-100 px-4 py-2 pr-10 text-[11px] font-bold uppercase tracking-widest cursor-pointer 
                             shadow-sm transition-all duration-300 ease-in-out
                             hover:border-gray-300 hover:shadow-md
                             focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="name">Alphabetical</option>
                  <option value="price-low">Price: Low - High</option>
                  <option value="price-high">Price: High - Low</option>
                </select>

                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-hover:translate-y-[-40%]">
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </div>
              </div>
           </div>
        </div>

        {/* Expandable Filter Panel */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showFilters ? 'max-h-[800px] opacity-100 mb-12' : 'max-h-0 opacity-0 mb-0'}`}>
            <div className="bg-gray-50 rounded-xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-12">
                
                {/* Search Column */}
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Search</h3>
                    <div className="relative group">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search our collection..."
                            className="w-full py-2 bg-transparent border-b border-gray-300 focus:border-black focus:outline-none font-medium transition-colors placeholder:text-gray-300"
                        />
                        <Search className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" />
                    </div>
                </div>

                {/* Categories Column */}
                <div>
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Category</h3>
                   <div className="flex flex-wrap gap-2">
                      {categories.map((category) => {
                         const isSelected = filters.category === (typeof category === 'string' ? category : category.slug);
                         return (
                           <button
                              key={typeof category === 'string' ? category : category.id}
                              onClick={() => handleCategoryChange(category)}
                              className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                                 isSelected 
                                 ? 'bg-black text-white shadow-lg' 
                                 : 'bg-white border border-gray-100 text-gray-600 hover:border-black hover:text-black'
                              }`}
                           >
                              {typeof category === 'string' ? category.replace('-', ' ') : category.name}
                           </button>
                         );
                      })}
                   </div>
                </div>

                {/* Price Column */}
                <div>
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Price Limit</h3>
                   <input
                      type="range"
                      min="0"
                      max={maxProductPrice}
                      step="1"
                      value={filters.priceRange[1]}
                      onChange={(e) => dispatch(setPriceRange([0, parseInt(e.target.value)]))}
                      className="w-full accent-black h-[2px] bg-gray-200 appearance-none cursor-pointer mb-4"
                   />
                   <div className="flex justify-between text-[11px] font-bold tracking-tighter mb-8">
                      <span className="text-gray-400">Min: {formatPrice(0)}</span>
                      <span className="text-black">Max: {formatPrice(filters.priceRange[1])}</span>
                   </div>

                   <button 
                     onClick={clearFilters}
                     className="text-[10px] font-black uppercase tracking-[0.2em] border-b border-black pb-1 hover:opacity-50 transition-opacity"
                   >
                     Reset All Filters
                   </button>
                </div>
            </div>
        </div>

        {/* Products Grid */}
        <div className="mb-20">
            {isLoading && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full"></div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 p-8 rounded text-sm font-bold uppercase tracking-widest text-center border border-red-100">
                  System error: Failed to retrieve products.
              </div>
            )}

            {!isLoading && !error && (
              <>
                {products.length === 0 ? (
                  <div className="py-32 text-center">
                    <p className="text-xl font-black text-gray-200 uppercase tracking-[0.3em]">No Matches Found</p>
                    <button onClick={clearFilters} className="mt-4 text-[11px] font-bold uppercase tracking-widest border-b border-black">
                        View all products
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalItems > itemsPerPage && (
                  <div className="mt-20 flex justify-center items-center gap-2 border-t border-gray-100 pt-12">
                    
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-black hover:text-black disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-all duration-300"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 flex items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                          currentPage === page
                            ? 'bg-black text-white shadow-lg scale-110'
                            : 'bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-black hover:text-black disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-all duration-300"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
        </div>
      </div>
    </div>
  );
}

export default Products;