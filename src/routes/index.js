import Home from "../pages/Home";
import Index from "../pages/Index";
import HouseList from '../pages/HouseList'
import News from "../pages/News";
import Profile from "../pages/Profile";

export default [
  {
    path: '/home',
    element: <Home/>,
    children: [
      {
        path: 'index',
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
      }
    ]
  }
]