import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import SocialLogin from "../socialLogin/SocialLogin";
import useAuth from "../../../hooks/useAuth";

const Login = () => {
    const {register, handleSubmit, formState:{errors}} = useForm();
    const {signIn} = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from || '/';

    const onSubmit = (data) =>{
        signIn(data.eamil, data.password)
        .then(result =>{
          console.log(result.user)
          navigate(from)
        })
        .catch(err => console.log(err))
    }

  return (
    <div>
        <h1 className="text-2xl mb-5">Please Login</h1>
     <form onSubmit={handleSubmit(onSubmit)}>
         <fieldset className="fieldset">
        {/* email field */}
        <label className="label">Email</label>
        <input
          type="email"
          {...register('eamil')}
          className="input w-full"
          placeholder="Email"
        />

        {/* password */}
        <label className="label">Password</label>
        <input
          type="password"
          {...register('password',{required:true, minLength:6 })}
          className="input w-full"
          placeholder="Password"
        />
        {
            errors.password?.type === 'required' && <p className="text-red-500">
                PassWord is required
            </p>
        }
        {
            errors.password?.type === 'minLength' && <p className="text-red-500">Password Must be 6 characters or longer</p>
        }


        <div>
          <a className="link link-hover">Forgot password?</a>
        </div>

        <button className="btn btn-primary mt-4  text-black">Login</button>
      </fieldset>
       <p><small>Don't have an Account? <Link to='/register' className="btn-link">Register</Link></small></p>
     </form>
     {/* social login */}
     <SocialLogin/>
    </div>
  );
};

export default Login;
