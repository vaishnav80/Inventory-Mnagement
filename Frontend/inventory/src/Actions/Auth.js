import axios from "axios";

import store from '../redux/store';
import { logout } from "../redux/authSlice";

const API_URL = "http://127.0.0.1:8000"; 

const api = axios.create({
    baseURL: API_URL,
});



api.interceptors.response.use(
    async(response)=>{
        console.log(response);
        
        return response
    },(error)=>{
        if (error.response && error.response.status === 401) {
            store.dispatch(logout());
        }
        return Promise.reject(error);
    }
)


export const userRegister = async (formData) => {
    try {
        const response = await api.post('auth/register/',{formData}
        )
        console.log(response)
        return response 
    } catch (error) {
        console.log(error.response);
        return error.response
    }
}

export const userLogin = async (formData) => {
    try{
        const response  = await api.post('auth/login/',formData)
        return response
        
    }catch(error){
        return error.response
    }
}

export const userLogout = async (refresh,access)=>{
    try {
        const response = await api.post('auth/logout/',{refresh},{
            headers:{
                Authorization:`Bearer ${access}`
            }
        })
        return response
    } catch (error) {
        return error.response
    }
}

export const addProduct = async (formData,access) => {
    try {
        const response =  await api.post('manage/products/',formData,
            {
                headers:{
                    Authorization:`Bearer ${access}`
                }
            }
        )
        console.log(response);
        return response
    }catch(error){
        console.log(error.response);
        return error.response
    }
}


export const getProduct = async (access)=>{
    console.log('called');
    
    try {
        const response = await api.get('manage/products',{
            headers:{
                Authorization:`Bearer ${access}`
            }
        })
        console.log(response);
        
        return response
    } catch (error) {
        return error.response
    }
}

export const getSingleProduct = async (access,id)=>{
    console.log('called');
    
    try {
        const response = await api.get(`manage/products/${id}`,{
            headers:{
                Authorization:`Bearer ${access}`
            }
        })
        console.log(response);
        
        return response
    } catch (error) {
        return error.response
    }
}

export const updateSingleProduct = async (access,id,formData)=>{
    console.log('called');
    
    try {
        const response = await api.patch(`manage/products/${id}/`,formData,{
            headers:{
                Authorization:`Bearer ${access}`
            }
        })
        console.log(response);
        
        return response
    } catch (error) {
        console.log(error.response);
        
        return error.response
    }
}


export const deleteSingleProduct = async (access,id)=>{
    
    
    try {
        const response = await api.delete(`manage/products/${id}/`,{
            headers:{
                Authorization:`Bearer ${access}`
            }
        })
        console.log(response);
        
        return response
    } catch (error) {
        console.log(error.response);
        
        return error.response
    }
}