import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteSingleProduct, getSingleProduct, updateSingleProduct } from '../Actions/Auth';
import { useSelector } from 'react-redux';

const ProductView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const auth = useSelector((select)=>select.auth)
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [product, setProduct] = useState({
    name: '',
    category: '',
    stock: '',
    price: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    async function fetchProduct() {
      const response = await getSingleProduct(auth.access,id)
      console.log(response);
      if (response.status == 200) {
        setProduct(response.data);
      }
      
    }
    fetchProduct()
    
  }, [id]);

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
    
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('category', product.category);
    formData.append('stock', product.stock);
    formData.append('price', product.price);
    formData.append('description', product.description);
  
    
    if (product.image instanceof File) {
      formData.append('image', product.image);
    }
  
    const response = await updateSingleProduct(auth.access, id, formData);
    
    if (response.status === 200) {
      console.log('Product updated successfully:', response.data);
      setIsEditing(false);
    } else {
      console.error('Error updating product:', response);
    }
  };
  

  const handleDelete =async () => {
    await deleteSingleProduct(auth.access,id)
    console.log('Product deleted:', id);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
    
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            ← Back to Products
          </button>
          <div className="flex gap-4">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Edit Product
              </button>
            )}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete Product
            </button>
          </div>
        </div>

    
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <div className="mb-4">
                  {isEditing ? (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full mb-2"
                    />
                  ) : null}
                  <img
                    src={imagePreview || product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              </div>

         
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg"
                      value={product.name}
                      onChange={(e) => setProduct({...product, name: e.target.value})}
                      required
                    />
                  ) : (
                    <p className="text-2xl font-bold">{product.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg"
                      value={product.category}
                      onChange={(e) => setProduct({...product, category: e.target.value})}
                      required
                    />
                  ) : (
                    <p className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {product.category}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  {isEditing ? (
                    <textarea
                      className="w-full px-3 py-2 border rounded-lg"
                      value={product.description}
                      onChange={(e) => setProduct({...product, description: e.target.value})}
                      required
                      rows="3"
                    />
                  ) : (
                    <p className="text-gray-600">{product.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Price</label>
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.01"
                        className="w-full px-3 py-2 border rounded-lg"
                        value={product.price}
                        onChange={(e) => setProduct({...product, price: e.target.value})}
                        required
                      />
                    ) : (
                      <p className="text-2xl font-bold text-blue-600">${product.price}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Quantity</label>
                    {isEditing ? (
                      <input
                        type="number"
                        className="w-full px-3 py-2 border rounded-lg"
                        value={product.stock}
                        onChange={(e) => setProduct({...product, stock: e.target.value})}
                        required
                      />
                    ) : (
                      <p className="text-xl">{product.stock} units</p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

       
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
              <p className="mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductView;