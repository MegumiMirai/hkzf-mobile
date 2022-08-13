import {Navigate} from "react-router";

import Home from "../pages/Home";
import Index from "../pages/Index";
import HouseList from '../pages/HouseList'
import News from "../pages/News";
import Profile from "../pages/Profile";
import Citylist from "../pages/Citylist";
import Map from "../pages/Map";


export default [
  {
    path: '/home',
    element: <Home/>,
    children: [
      {
        path: '',
        element: <Index/>
      },
      {
        path: 'list',
        element: <HouseList/>
      },
      {
        path: 'news',
        element: <News/>
      },
      {
        path: 'profile',
        element: <Profile/>
      },
      {
        path: '',
        element: <Navigate to="index" />
      }
    ]
  },
  {
    path: '/citylist',
    element: <Citylist/>
  },
  {
    path: '/map',
    element: <Map/>
  },
  {
    path: '/',
    element: <Navigate to="/home"/>
  }
]