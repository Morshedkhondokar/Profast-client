import axios from "axios";
import { useEffect } from "react";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";

const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
});

const useAxiosSecure = () => {
  const { user, logOut} = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    const interceptor = axiosSecure.interceptors.request.use((config) => {
        if (user?.accessToken) {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Remove previous interceptor
    return () => {
      axiosSecure.interceptors.request.eject(interceptor);
    };
  }, [user]);

  axiosSecure.interceptors.request.use(res =>{
    return res
  }, error =>{
    console.log("inside interceptors",error)
    const status = error.status;
    if(status === 403){
      navigate('/forbidden')
    } else if (status === 401){
      logOut()
      .then(()=>{
        navigate('/login')
      })
      .catch(()=>{})
    }

    return Promise.reject(error)
  })

  return axiosSecure;
};

export default useAxiosSecure;
