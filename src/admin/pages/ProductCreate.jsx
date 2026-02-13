import React, { useState } from 'react';
import { useCreateProductMutation, useGetCategoriesQuery, useCreateCategoryMutation, useUpdateProductInventoryMutation } from '../services/adminApi';
import { useNavigate } from 'react-router-dom';
import { Upload, ArrowLeft, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductCreate = () => {
    const navigate = useNavigate();
    const [createProduct, { isLoading }] = useCreateProductMutation();
    const [createCategory, { isLoading: isCreatingCategory }] = useCreateCategoryMutation();
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
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState('');

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
        data.append('countInStock', formData.countInStock);
        data.append('is_active', formData.is_active);
        
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            const product = await createProduct(data).unwrap();
            
            // Update inventory
            if (formData.countInStock) {
                await updateInventory({ 
                    id: product.id, 
                    quantity: parseInt(formData.countInStock) 
                }).unwrap();
            }

            toast.success('Product created successfully');
            navigate('/admin/products');
        } catch (err) {
            const errorMessage = err?.data?.message || err?.data?.error || 'Failed to create product';
            toast.error(errorMessage);
            
            // Log full error for debugging
            console.error("Product creation failed:", err);
            
            // If there are field-specific errors, toast them too or handle them (simplified here)
            if (err?.data && typeof err.data === 'object' && !err.data.message && !err.data.error) {
                 Object.entries(err.data).forEach(([key, value]) => {
                     toast.error(`${key}: ${value}`);
                 });
            }
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        try {
            await createCategory({ name: newCategory }).unwrap();
            toast.success('Category created successfully');
            setNewCategory('');
            setIsCategoryModalOpen(false);
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to create category');
        }
    };

    return (
        <div className="max-w-4xl mx-auto relative">
            <button onClick={() => navigate('/admin/products')} className="flex items-center text-gray-600 mb-6 hover:text-gray-900">
                <ArrowLeft size={20} className="mr-2" /> Back to Products
            </button>

            <div className="bg-white rounded-lg shadow p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Product</h2>

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
                           <div className="flex gap-2">
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
                               <button 
                                    type="button"
                                    onClick={() => setIsCategoryModalOpen(true)}
                                    className="px-3 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                                    title="Add New Category"
                               >
                                   <Plus size={20} />
                               </button>
                           </div>
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
                                Upload Image
                                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || isUpdatingInventory}
                        className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition disabled:opacity-50 font-semibold"
                    >
                        {isLoading || isUpdatingInventory ? 'Creating...' : 'Create Product'}
                    </button>
                </form>
            </div>

            {/* Add Category Modal */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800">Add New Category</h3>
                            <button onClick={() => setIsCategoryModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddCategory}>
                            <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="Category Name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-4"
                                autoFocus
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCategoryModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newCategory.trim() || isCreatingCategory}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {isCreatingCategory ? 'Adding...' : 'Add Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductCreate;
