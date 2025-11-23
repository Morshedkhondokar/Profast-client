import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayouts from "../layouts/AuthLayouts";
import Login from "../pages/Authencation/Login/Login";
import Register from "../pages/Authencation/Register/Register";
import Coverage from "../pages/Coverage/Coverage";
import PrivateRoute from "../routes/PrivateRoute";
import SendPercel from "../pages/SendPercel/SendPercel";
import DashBoardLayout from "../layouts/DashBoardLayout";
import Myparcels from "../pages/Dashboard/MyParcels/MyParcels";
import Payment from "../pages/Dashboard/payment/Payment";


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
        },
        {
          path: '/sendPercel',
          element: <PrivateRoute><SendPercel/></PrivateRoute>
        }
    ]
  },
  //============= authencation routs
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
  },
  //=============== dashboard routs
  {
    path:'/dashboard',
    element: <PrivateRoute><DashBoardLayout/></PrivateRoute>,
    children:[
      {
        path:'myparcels',
        Component: Myparcels
      },
      {
        path:'payment/:id',
        Component: Payment
      }
    ]
  }
]);