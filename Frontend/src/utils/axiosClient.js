// import axios from "axios"

// const axiosClient =  axios.create({
//     baseURL: 'http://localhost:4000',
//     withCredentials: true,
//     headers: {
//         'Content-Type': 'application/json'
//     }
// });

// export default axiosClient;

import axios from "axios";

const axiosClient = axios.create({
  baseURL:  "https://bugbattle-backend.onrender.com",
  withCredentials: true,
});

export default axiosClient;

// https://bugbattle-backend.onrender.com
