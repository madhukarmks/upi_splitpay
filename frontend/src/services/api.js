import axios from'axios';
export const api=axios.create({baseURL:import.meta.env.VITE_API_URL||'http://localhost:8080/api'});
api.interceptors.request.use(c=>{const t=localStorage.getItem('splitpay_token');if(t)c.headers.Authorization=`Bearer ${t}`;return c});
api.interceptors.response.use(r=>r,e=>{if(e.response?.status===401){localStorage.removeItem('splitpay_token');localStorage.removeItem('splitpay_user');localStorage.setItem('splitpay_session_message','Your session has expired. Please sign in again.');window.location.href='/login'}return Promise.reject(e)});
export const unwrap=r=>r.data.data;
