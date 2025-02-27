import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct } from '../Actions/Auth';
import { useSelector } from 'react-redux';

const AddProduct = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState('');
  const [product, setProduct] = useState({
    name: '',
    category: '',
    stock: 0,
    price: 0,
    description: '',
    image: ''
  });
  const auth = useSelector((select)=>select.auth)

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct((prev) => ({ ...prev, image: file })); 
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(product,'prod',auth);
    const formData = new FormData();
        formData.append('name', product.name);
        formData.append('category', product.category);
        formData.append('stock', product.stock);
        formData.append('price', product.price);
        formData.append('description', product.description);
      
        
        if (product.image instanceof File) {
          formData.append('image', product.image);
        }
    const response = await addProduct(formData,auth.access);
    console.log('Product to add:', { ...product, image: imagePreview });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Add New Product</h1>
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-800"
          >
            Back to Home
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 w-full h-48 object-cover rounded"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              value={product.name}
              onChange={(e) => setProduct({...product, name: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              value={product.category}
              onChange={(e) => setProduct({...product, category: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              className="w-full px-3 py-2 border rounded-lg"
              value={product.description}
              onChange={(e) => setProduct({...product, description: e.target.value})}
              required
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-lg"
              value={product.stock}
              onChange={(e) => setProduct({...product, stock: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Price</label>
            <input
              type="number"
              step="0.01"
              className="w-full px-3 py-2 border rounded-lg"
              value={product.price}
              onChange={(e) => setProduct({...product, price: e.target.value})}
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;