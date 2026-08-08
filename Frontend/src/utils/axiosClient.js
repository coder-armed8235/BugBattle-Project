import axios from "axios"

const axiosClient =  axios.create({
    baseURL: 'https://bugbattle-backend.onrender.com',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default axiosClient;

// https://bugbattle-backend.onrender.com
