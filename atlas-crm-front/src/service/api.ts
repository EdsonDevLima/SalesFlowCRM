import axios from "axios";

const token = localStorage.getItem("token") || ""

const api = axios.create({
    baseURL:import.meta.env.VITE_API_URL,
    headers:{
        "Content-Type": "application/json",
        'api-key':import.meta.env.VITE_SERVER_API_KEY,
        "authorization":token
    }
    
})
export const apiMultiPart = axios.create({
    baseURL:import.meta.env.VITE_API_URL,
    headers:{
        'Content-Type': 'multipart/form-data',
        'api-key':import.meta.env.VITE_SERVER_API_KEY,
        "authorization":token
    }
    
})

export default api