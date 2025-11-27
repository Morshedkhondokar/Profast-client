import { useForm } from "react-hook-form"
import useAuth from "../../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router";
import SocialLogin from "../socialLogin/SocialLogin";
import axios from "axios";
import { useState } from "react";
import useAxios from "../../../hooks/useAxios";


const Register = () => {
    const {register,handleSubmit, formState: {errors}} = useForm();
    const {createUser,updateUserProfile} = useAuth()
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from || '/';
    const [profilePic, setProfilePic] = useState('');
    const axiosInstance = useAxios();

    const onRegister = data =>{
        console.log(data)

        createUser(data.email, data.password)
        .then( async(result) =>{
            console.log(result.user)
            navigate(from)

            // update user info in the database
            const userInfo = {
              email: data.email,
              role: 'user', // default role
              created_date: new Date().toISOString(),
              last_login_data: new Date().toISOString()
            }

            const userRes = await axiosInstance.post('/users', userInfo); 
            console.log(userRes)

            // update user profile in firebase
            const userProfile = {
              displayName:data.name,
              photoURL: profilePic
            }
            updateUserProfile(userProfile)
            .then(()=>{
              console.log('Profile name pic updated')
            })
            .catch(error =>{
              console.log(error)
            })

        })
        .catch(error =>{
            console.error(error)
        })
    }

    const handleImageUpload = async(e) =>{
      const image = e.target.files[0];
      // console.log(image)
      const formData = new FormData();
      formData.append("image", image);
      const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_key}`;

      const res = await axios.post(imageUploadUrl,formData)

      setProfilePic(res.data.data.url)
    }



  return (
    <div className="">
        <h3 className="text-2xl mb-5">Creat an account</h3>
      <form onSubmit={handleSubmit(onRegister)}>
         <fieldset className="fieldset">
          {/* name field */}
          <label className="label">Your Name</label>
          <input type="text" {...register('name', {required:true, })} className="input w-full" placeholder="Enter your name" />
            {
                errors.email?.type === 'name' && <p className="text-red-500">Name is required</p>
            }

          {/* image field */}
          <label className="label">Profile image</label>
          <input type="file" 
          onChange={handleImageUpload}
          className="input w-full" placeholder="Your profile image" />
           

          {/* email field */}
          <label className="label">Email</label>
          <input type="email" {...register('email', {required:true, })} className="input w-full" placeholder="Email" />
            {
                errors.email?.type === 'required' && <p className="text-red-500">Email is required</p>
            }


          {/* password */}
          <label className="label">Password</label>
          <input type="password" {...register('password', {required:true, minLength:6})} className="input w-full" placeholder="Password" />
            {
                errors.password?.type === 'required' && <p className="text-red-500">Password is required</p>
            }
            {
                errors.password?.type === 'minLength' && <p className="text-red-500">Password Must be 6 characters or longer</p>
            }

          <button className="btn btn-primary text-black mt-4">Register</button>
        </fieldset>
        <p><small>Already have an Account? <Link to='/login' className="btn-link">Login</Link></small></p>
      </form>
      {/* social login */}
      <SocialLogin/>
    </div>
  )
}

export default Register
