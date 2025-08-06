import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  // baseURL:"https://webcraft-server-production.up.railway.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    return config;
  },
  (error: AxiosError): Promise<never> => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  (error: AxiosError<any>) => {
    let message = "Something went wrong";

    if (error.response) {
      message = error.response.data?.message || error.response.statusText;
    } else if (error.request) {
      message = "No response from server";
    } else {
      message = error.message;
    }

    toast.error(message);
    return Promise.reject(error); 
  }
)

export default api;
