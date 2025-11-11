import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayouts from "../layouts/AuthLayouts";
import Login from "../pages/Authencation/Login/Login";
import Register from "../pages/Authencation/Register/Register";
import Coverage from "../pages/Coverage/Coverage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children:[
        {
            index:true,
            Component: Home
        },
        {
          path:'/coverage',
          Component: Coverage,
          loader: ()=> fetch('')
        }
    ]
  },
  // authencation routs
  {
    path:'/',
    Component: AuthLayouts,
    children:[
      {
        path:'/login',
        Component: Login
      },
      {
        path:'/register',
        Component: Register 
      }
    ]
  }
]);