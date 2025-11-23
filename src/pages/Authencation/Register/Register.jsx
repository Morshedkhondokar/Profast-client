import { useForm } from "react-hook-form"
import useAuth from "../../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router";
import SocialLogin from "../socialLogin/SocialLogin";

const Register = () => {
    const {register,handleSubmit, formState: {errors}} = useForm();
    const {createUser} = useAuth()
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from || '/';

    const onRegister = data =>{
        console.log(data)

        createUser(data.email, data.password)
        .then(result =>{
            console.log(result.user)
            navigate(from)
        })
        .catch(error =>{
            console.error(error)
        })
    }
  return (
    <div className="">
        <h3 className="text-2xl mb-5">Creat an account</h3>
      <form onSubmit={handleSubmit(onRegister)}>
         <fieldset className="fieldset">
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
