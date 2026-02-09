import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from '../features/products/productApi';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { setCategory, setPriceRange, setSortBy, setSearchQuery } from '../features/products/productSlice';
import { selectProductFilters, selectProductSearchQuery } from '../features/products/selectors';
import { useDebounce } from '../hooks/useDebounce';
import { formatPrice } from '../utils/formatPrice';
import ProductCard from '../components/ProductCard';
import { Search, ChevronDown, ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react';

function Products() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const filters = useAppSelector(selectProductFilters);
  const searchQuery = useAppSelector(selectProductSearchQuery);
  const debouncedSearch = useDebounce(searchQuery, 500);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 12;

  // Fetch all products
  const { data, isLoading, error } = useGetProductsQuery({});

  const allProducts = Array.isArray(data) ? data : data?.results || [];

  // Extract Unique Categories dynamically
  const categories = ['all', ...new Set(allProducts.map(p => p.category?.name || p.category).filter(Boolean))];

  // Client-side Filtering Logic
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(debouncedSearch.toLowerCase());
    const productCategory = product.category?.name || product.category;
    const matchesCategory = filters.category === 'all' || productCategory === filters.category;
    const price = parseFloat(product.price);
    const matchesPrice = price >= filters.priceRange[0] && price <= filters.priceRange[1];

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Client-side Sorting Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price-high':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'newest':
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      default:
        return 0;
    }
  });

  const totalItems = sortedProducts.length;
  const displayedProducts = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCategoryChange = (category) => {
    dispatch(setCategory(category));
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    dispatch(setSortBy(e.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
    setCurrentPage(1);
  };

  const clearFilters = () => {
      dispatch(setCategory('all'));
      dispatch(setSearchQuery(''));
      dispatch(setPriceRange([0, 50000]));
      setCurrentPage(1);
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
           
           {/* Left: Filter Toggle */}
           <button 
             onClick={() => setShowFilters(!showFilters)}
             className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest hover:opacity-60 transition-opacity"
           >
             {showFilters ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
             {showFilters ? 'Hide Filters' : 'Filter Selection'}
           </button>

           {/* Right: Premium Sort Selection */}
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
                
                <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all duration-500 group-hover:w-full" />
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
                      {categories.map((category) => (
                         <button
                            key={category}
                            onClick={() => handleCategoryChange(category)}
                            className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                               filters.category === category 
                               ? 'bg-black text-white shadow-lg' 
                               : 'bg-white border border-gray-100 text-gray-600 hover:border-black hover:text-black'
                            }`}
                         >
                            {typeof category === 'string' ? category.replace('-', ' ') : category}
                         </button>
                      ))}
                   </div>
                </div>

                {/* Price Column */}
                <div>
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Price Limit</h3>
                   <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
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
                {displayedProducts.length === 0 ? (
                  <div className="py-32 text-center">
                    <p className="text-xl font-black text-gray-200 uppercase tracking-[0.3em]">No Matches Found</p>
                    <button onClick={clearFilters} className="mt-4 text-[11px] font-bold uppercase tracking-widest border-b border-black">
                        View all products
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
                    {displayedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalItems > itemsPerPage && (
                  <div className="mt-24 flex flex-col sm:flex-row justify-center items-center gap-8 border-t border-gray-100 pt-12">
                    <button
                      onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                      disabled={currentPage === 1}
                      className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] disabled:opacity-10 disabled:cursor-not-allowed hover:opacity-60 transition-all"
                    >
                      <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      Prev
                    </button>
                    
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300">
                      Page <span className="text-black">{currentPage}</span> / {Math.ceil(totalItems / itemsPerPage)}
                    </span>
                    
                    <button
                      onClick={() => { setCurrentPage(p => p + 1); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                      disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)}
                      className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] disabled:opacity-10 disabled:cursor-not-allowed hover:opacity-60 transition-all"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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