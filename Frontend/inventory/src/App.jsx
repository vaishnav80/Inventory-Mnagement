import { useState } from 'react'

import './App.css'
import AuthForms from './pages/AuthForms'
import HomePage from './pages/HomePage'
import { BrowserRouter as Router, Route, Routes, Link,useNavigate, Navigate } from 'react-router-dom';
import AddProduct from './pages/AddProduct'
import EditProduct from './pages/EditProduct'
import { useSelector } from 'react-redux';


function App() {

  const auth = useSelector((select)=>select.auth)
  
  const Protected =  ({element})=>{
    console.log(element,auth.isAuthenticated);
    
      if (auth.isAuthenticated) {
          return element
      }
      else{
        return <Navigate to="/login" />
      }
  }

  const Unauthorized = ({element})=>{
    console.log('dfsdf');
    
    if (auth.isAuthenticated){
      return <Navigate to="/" />;
    }
    return element
  } 

  return (
    <>
    <Routes>

    <Route path="/login" element={<Unauthorized element = {<AuthForms/>}/>}/>
    <Route path="/" element={<Protected element ={<HomePage/>}/>}/>
    <Route path="/add" element={<Protected element ={<AddProduct/>}/>}/>
    <Route path='/product/:id' element ={<Protected element={<EditProduct/>}/>}/>
    </Routes>
    </>
  )
}

export default App
