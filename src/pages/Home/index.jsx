import React, {useState} from "react";
import {Outlet, useNavigate, useLocation} from 'react-router-dom'
import { TabBar } from 'antd-mobile'

//导入Home组件的样式文件
import './index.css'

export default function Home(){
  const navigate = useNavigate()
  //当前显示的路由
  const [activeKey, setActiveKey] = useState(useLocation().pathname.slice(6))


  const tabs = [
    {
      key: '',
      title: '首页',
      icon: <i className="iconfont icon-ind" />,
    },
    {
      key: 'list',
      title: '找房',
      icon: <i className="iconfont icon-findHouse" />,
    },
    {
      key: 'news',
      title: '咨询',
      icon: <i className="iconfont icon-infom" />,
    },
    {
      key: 'profile',
      title: '我的',
      icon: <i className="iconfont icon-my" />,
    },
  ]

  const setRouteActive = (value) => {
    navigate(value)
    setActiveKey(value)
  }

  return (
      <div className="home">
        {/*<Link to="/news">News</Link>*/}
        {/*/!*二级路由显示*!/*/}
        <Outlet/>

        {/*底部tabbar*/}
        <TabBar className="tabs" activeKey={useLocation().pathname.slice(6)} onChange={value => setRouteActive(value)}>
          {tabs.map(item => (
              <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
          ))}
        </TabBar>
      </div>
  )
}