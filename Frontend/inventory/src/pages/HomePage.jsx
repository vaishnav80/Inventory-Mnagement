import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, X } from 'lucide-react'; 
import { getProduct, userLogout } from '../Actions/Auth';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false);
  const auth = useSelector((select)=>select.auth)
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('');


  const handleLogout = async () => {
    const response = await userLogout(auth.refresh,auth.access)
    console.log(response); 
    if (response.status == 205) {
      dispatch(logout())
      navigate('/login')
    }
    setShowModal(false);
    
  };
  useEffect(()=>{
    async function fetchproduct() {
      const response = await getProduct(auth.access)
      console.log(response);
      if (response.status == 200) {
        setProducts(response.data)
      }
      
    }
    fetchproduct()
  },[])

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventory Management System</h1>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full sm:w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={() => navigate('/add')}
            className="w-full sm:w-auto bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Add New Product
          </button>
      
          <div 
            className="cursor-pointer p-2 rounded-full bg-gray-200 hover:bg-gray-300"
            onClick={() => setShowModal(true)}
          >
            <User className="h-6 w-6 text-gray-700" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <div 
            key={product.id} 
            onClick={() => navigate(`/product/${product.id}`)}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          >
            <img 
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  {product.category}
                </span>
              </div>
              <p className="text-gray-600 mb-3">{product.description}</p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-2xl font-bold text-blue-600">₹{product.price}</span>
                <span className="text-gray-500">Stock: {product.stock}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg relative">
       
            <button 
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              onClick={() => setShowModal(false)}
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-bold text-center mb-4">Profile</h2>
            <div className="flex flex-col items-center">
              <User className="h-12 w-12 text-gray-700 mb-2" />
              <p className="text-lg font-medium">{auth.user ? auth.user.username : 'USER'}</p>
            </div>

            <button 
              className="mt-6 w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
