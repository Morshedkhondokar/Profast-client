import { Outlet } from "react-router";
import ProFastLogo from "../pages/shared/ProFastLogo/ProFastLogo";
import authImg from "../assets/authImage.png";

const AuthLayouts = () => {
  return (
    <div className="p-6 ">
      <div>
        <ProFastLogo />
      </div >
      <div className="hero-content flex-col lg:flex-row-reverse ">
        <div className="flex-1">
          <img
            src={authImg}
            className="max-w-sm rounded-lg shadow-2xl"
          />
        </div>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayouts;
