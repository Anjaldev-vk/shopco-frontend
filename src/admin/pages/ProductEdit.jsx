import React, { useState, useEffect } from 'react';
import { useGetProductByIdQuery, useUpdateProductMutation, useGetCategoriesQuery, useUpdateProductInventoryMutation } from '../services/adminApi';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Correctly using skip to prevent query if id is missing
    const { data: product, isLoading: isFetching } = useGetProductByIdQuery(id);
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
    const [updateInventory, { isLoading: isUpdatingInventory }] = useUpdateProductInventoryMutation();
    const { data: categories } = useGetCategoriesQuery();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        discount_price: '',
        category: '',
        countInStock: '',
        image: null,
        is_active: true
    });

    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                discount_price: product.discount_price || '',
                category: product.category?.id || product.category || '', 
                countInStock: product.inventory_quantity !== undefined ? product.inventory_quantity : (product.countInStock || ''), 
                image: null,
                is_active: product.is_active
            });
            setImagePreview(product.image);
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        if (formData.discount_price || formData.discount_price === 0) {
            data.append('discount_price', formData.discount_price);
        } else {
            data.append('discount_price', '');
        }
        data.append('category', formData.category);
        data.append('is_active', formData.is_active);
        
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            await updateProduct({ id, data }).unwrap();
            
            // Update inventory
            if (formData.countInStock !== '') {
                 await updateInventory({ 
                    id, 
                    quantity: parseInt(formData.countInStock) 
                }).unwrap();
            }

            toast.success('Product updated successfully');
            navigate('/admin/products');
        } catch (err) {
            const errorMessage = err?.data?.message || err?.data?.error || 'Failed to update product';
            toast.error(errorMessage);
            console.error("Product update failed:", err);
            
             if (err?.data && typeof err.data === 'object' && !err.data.message && !err.data.error) {
                 Object.entries(err.data).forEach(([key, value]) => {
                     toast.error(`${key}: ${value}`);
                 });
            }
        }
    };

    if (isFetching) return <div className="p-8">Loading product...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={() => navigate('/admin/products')} className="flex items-center text-gray-600 mb-6 hover:text-gray-900">
                <ArrowLeft size={20} className="mr-2" /> Back to Products
            </button>

            <div className="bg-white rounded-lg shadow p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Product</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>



                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Discount Price</label>
                            <input
                                type="number"
                                name="discount_price"
                                value={formData.discount_price}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Count In Stock</label>
                            <input
                                type="number"
                                name="countInStock"
                                value={formData.countInStock}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                                min="0"
                            />
                        </div>
                        
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                           <select 
                                name="category" 
                                value={formData.category} 
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                           >
                               <option value="">Select Category</option>
                               {(Array.isArray(categories) ? categories : categories?.results || []).map(cat => (
                                   <option key={cat.id} value={cat.id}>{cat.name}</option>
                               ))}
                           </select>
                        </div>
                        
                        <div className="md:col-span-2">
                             <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Is Active</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                        <div className="flex items-center gap-4">
                            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <Upload className="text-gray-400" />
                                )}
                            </div>
                            <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                                Change Image
                                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isUpdating || isUpdatingInventory}
                        className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition disabled:opacity-50 font-semibold"
                    >
                        {isUpdating || isUpdatingInventory ? 'Updating...' : 'Update Product'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductEdit;
