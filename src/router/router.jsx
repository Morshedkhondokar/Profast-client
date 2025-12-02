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
import PaymentHistory from "../pages/Dashboard/paymentHistory/PaymentHistory";
import TrackParcel from "../pages/Dashboard/trackParcel/TrackParcel";
import BeARider from "../pages/Dashboard/beARider/BeARider";
import PendingRiders from "../pages/Dashboard/pendingRiders/PendingRiders";
import ActiveRiders from "../pages/Dashboard/ActiveRiders/ActiveRiders";
import MakeAdmin from "../pages/Dashboard/MakeAdmin/MakeAdmin";
import Forbidden from "../pages/Forbidden/Forbidden";
import AdminRoute from "../routes/AdminRoute";



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
          path: 'beARider',
          element: <PrivateRoute><BeARider/></PrivateRoute> 
        },
        {
          path: '/sendPercel',
          element: <PrivateRoute><SendPercel/></PrivateRoute>
        },
        {
          path: '/forbidden',
          Component: Forbidden
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
        path:'payment/:parcelId',
        Component: Payment
      },
      {
        path:'paymentHistory',
        element: <PaymentHistory/>
      },
      {
        path:'pendingRiders',
        element: <AdminRoute><PendingRiders/></AdminRoute>
      },
      {
        path: 'activeRiders',
        element:<AdminRoute><ActiveRiders/></AdminRoute>
      },
      {
        path:'track',
        Component: TrackParcel
      },
      {
        path:'makeAdmin',
        element: <AdminRoute><MakeAdmin/></AdminRoute>
      }
    ]
  }
]);