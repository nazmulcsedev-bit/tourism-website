// import axios from 'axios';
// const baseURL = import.meta.env.VITE_API_URL || '/api';

// const api = axios.create({
//   baseURL,
// });

// // Attach JWT token to every request if user is logged in
// api.interceptors.request.use((config) => {
//   const userInfo = localStorage.getItem('userInfo');
//   if (userInfo) {
//     const { token } = JSON.parse(userInfo);
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   }
//   return config;
// });

// export default api;
// import axios from "axios";

// console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
// });

// api.interceptors.request.use((config) => {
//   console.log("Final Request URL:", config.baseURL + config.url);
//   return config;
// });

// export default api;
import axios from "axios";

const api = axios.create({
  baseURL: "https://tourism-website-as0c.onrender.com/api",
});

export default api;
