import React, {useEffect, useState} from "react";
import { Swiper,Grid  } from 'antd-mobile'
import './index.scss'
import axios from "axios";

//导入导航栏菜单的图片
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'
import {useNavigate} from "react-router";
import {getCurrentCity} from "../../util";

export default function Index(){

  const navigate = useNavigate()
  //轮播图数据
  const [swipers, setSwipers] = useState([])
  //租房小组数据
  const [groups, setGroups] = useState([])
  //最新资讯数据
  const [news, setNews] = useState([])
  //当前城市信息
  const [curCityName, setCurCityName] = useState('上海')

  useEffect(() => {
    getSwipers()
    getGroups()
    getNews()

    //获取当前城市
    async function getCity() {
      const currentCity = await getCurrentCity()
      setCurCityName(currentCity.label)
    }
    getCity()

  }, [])

  //获取轮播图数据
  const getSwipers = async () => {
    const res = await axios.get('/home/swiper')
    if(res.status === 200){
      setSwipers(res.data.body)
    }
  }
  //渲染轮播图
  const renderSwipers = swipers.map((item, index) => (<Swiper.Item key={item.id}>
        <a style={{ display:'inline-block', width: '100%', height: 212 }}>
          <img src={`http://localhost:8080${item.imgSrc}`} style={{ width:'100%', verticalAlign:'top' }} />
        </a>
      </Swiper.Item>))

  //导航栏数据
  const navs = [
    {
      id: 1,
      img: Nav1,
      title: '整租',
      path: '/home/list'
    },
    {
      id: 2,
      img: Nav2,
      title: '合租',
      path: '/home/list'
    },
    {
      id: 3,
      img: Nav3,
      title: '地图找房',
      path: '/map'
    },
    {
      id: 4,
      img: Nav4,
      title: '去出租',
      path: '/home/rent'
    },
  ]
  //渲染导航栏
  const renderNavs = () => {
    return navs.map(item => {
       return <div key={item.id} className="navItem" onClick={() => {navigate(item.path)}}>
        <img src={item.img}></img>
        <span>{item.title}</span>
      </div>
    })
  }

  //获取租房小组的数据
  const getGroups = async () => {
    let res = await axios.get('/home/groups', {params: {area: 'AREA%7C88cff55c-aaa4-e2e0'}})
    if(res.status === 200){
      setGroups(res.data.body)
    }
  }
  //渲染租房小组模块
  const renderGroups = () => {
    return groups.map(item => {
      return  <Grid.Item key={item.id}>
        <div className="groupItem">
          <div className="desc">
            <p className="title">{item.title}</p>
            <span className="info">{item.desc}</span>
          </div>
          <img src={`http://localhost:8080${item.imgSrc}`} />
        </div>
      </Grid.Item>
    })
  }

  //获取最新资讯数据
  const getNews = async () => {
    const res = await axios.get('/home/news', { params: {area: 'AREA%7C88cff55c-aaa4-e2e0' } })
    if(res.status === 200){
      setNews(res.data.body)
    }
  }
  //渲染最新资讯
  const renderNews = () => {
    return news.map(item => {
      return <div className="newsContent" key={item.id}>
        <div className="newsItem">
          <div>
            <img src={`http://localhost:8080${item.imgSrc}`} />
          </div>
          <div className="newsInfo">
            <h3>{item.title}</h3>
            <div className="newsDesc">
              <span>{item.from}</span>
              <span>{item.date}</span>
            </div>
          </div>
        </div>
      </div>
    })
  }

  return (
      <div>
        {/*轮播图*/}
        <div className="swiper">
          <Swiper loop autoplay>
            {renderSwipers}
          </Swiper>

          {/*搜索框*/}
          <div className="search-box">
            {/*左侧白色区域*/}
            <div className="search">
              {/*位置*/}
              <div className="location" onClick={() => {navigate('/citylist')}}>
                <span className="name" >{curCityName}</span>
                <i className="iconfont icon-arrow"></i>
              </div>

              {/*搜索表单*/}
              <div className="form"  onClick={() => {navigate('/search')}}>
                <i className="iconfont icon-seach"></i>
                <span className="text">请输入小区或地址</span>
              </div>
            </div>

            {/*右侧地图图标*/}
            <i className="iconfont icon-map"  onClick={() => {navigate('/map')}}></i>
          </div>
        </div>

        {/*导航栏菜单*/}
        <div className="nav">
          {renderNavs()}
        </div>

        {/*租房小组*/}
        <div className="groups">
          {/*标题*/}
          <h3 className="header">
            租房小组
            <span className="more">更多</span>
          </h3>
          {/*内容主体*/}
          <Grid columns={2} gap={8}>
            {renderGroups()}
          </Grid>
        </div>

        {/*最新资讯*/}
        <div className="news">
          <h3 className="header">最新资讯</h3>
          {renderNews()}
        </div>

      </div>
  )
}