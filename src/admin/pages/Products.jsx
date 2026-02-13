import React, { useState, useEffect } from 'react';
import { useGetProductsQuery, useGetCategoriesQuery, useDeleteProductMutation } from '../services/adminApi';
import { formatPrice } from '../../utils/formatPrice';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/ConfirmationModal';

const Products = () => {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [category, setCategory] = useState('');

    const [deleteProduct] = useDeleteProductMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Construct query params
    const queryParams = {};
    if (debouncedSearch) queryParams.search = debouncedSearch;
    if (category) queryParams.category = category;

    const { data, isLoading, error } = useGetProductsQuery(queryParams);
    const { data: categoriesData } = useGetCategoriesQuery();
    
    const products = Array.isArray(data) ? data : data?.results || [];
    const categories = Array.isArray(categoriesData) ? categoriesData : categoriesData?.results || [];

    const initiateDelete = (id) => {
        setProductToDelete(id);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (productToDelete) {
            try {
                await deleteProduct(productToDelete).unwrap();
                toast.success('Product deleted successfully');
            } catch (err) {
                toast.error('Failed to delete product');
            }
        }
    };

    if (isLoading) return <div className="p-4">Loading products...</div>;
    if (error) return <div className="p-4 text-red-500">Error loading products</div>;

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Products</h2>
                
                <div className="flex flex-1 w-full md:w-auto gap-4 items-center justify-end">
                    {/* Search Bar */}
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    </div>

                    {/* Category Filter */}
                    <div className="relative w-full md:w-48">
                         <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <Filter className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    </div>

                    <Link 
                        to="/admin/products/create" 
                        className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-neutral-800 transition whitespace-nowrap"

                    >
                        <Plus size={20} />
                        Add Product
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full object-cover" src={product.image || "https://via.placeholder.com/40"} alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900 truncate max-w-[12rem]" title={product.name}>{product.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{product.category_name || '-'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{formatPrice(product.price)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                     <div className="text-sm text-gray-900">{product.inventory_quantity} units</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {product.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center gap-4">
                                        <Link 
                                            to={`/admin/products/${product.id}/edit`} 
                                            className="text-indigo-600 hover:text-indigo-900 font-medium flex items-center gap-1"
                                        >
                                            <Edit size={16} />
                                            Edit
                                        </Link>
                                        <button 
                                            onClick={() => initiateDelete(product.id)}
                                            className="text-red-600 hover:text-red-900 flex items-center gap-1"
                                        >
                                            <Trash2 size={16} />
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            <ConfirmationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Product"
                message="Are you sure you want to delete this product? This action cannot be undone."
                confirmText="Yes, Delete"
                isDanger={true}
            />
        </div>
    );
};

export default Products;
