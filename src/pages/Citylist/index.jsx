import React, {useEffect, useRef, useState} from "react";
import {NavBar, Toast} from 'antd-mobile'
import {useNavigate} from "react-router";
import {getCurrentCity} from "../../util";
//从react-virtualized导入List，用于渲染长列表
import {List, AutoSizer} from 'react-virtualized';

//导入样式文件
import './index.scss'
import axios from "axios";
import NavHeader from "../../components/NavHeader";

export default function Citylist(){

  const navigete = useNavigate()
  //长列表数据的数据源
  const [cityList, setCityList] = useState({})
  //长列表数据的索引
  const [cityIndex, setCityIndex] = useState([])
  //索引的高度
  const TITLE_HEIGHT = 36
  //每个城市名称的高度
  const NAME_TITLE = 50
  //右侧列表高亮的索引值
  const [activeIndex, setActiveIndex] = useState(0)
  //长列表的ref
  const listRef = useRef()
  //有房源的城市
  const HOUSE_CITY = ['北京', '上海', '广州', '深圳']

  useEffect ( () => {
    // async function getData(){
    //   await
    // }
    //
    // getData()
    getCityList()
  }, [])

  useEffect(() => {
    //  提前计算长列表每个数据的高度
    cityIndex.length !== 0 && listRef.current.measureAllRows()
  }, [cityIndex.length])

  //格式化城市数据
  const formatData = (list) => {

    const cityList = {}

    // 1. 遍历list数组
    list.forEach(item => {
      //  2. 获取每一次城市的首字母
      const first = item.short.substr(0, 1)
      //  3. 判断 cityList中是否有该分类
      if(cityList[first]){
        //  4 如果有，直接往该分类中push数据
        cityList[first].push(item)
      }else{
        //  5. 如果没有，就先创建一个数组，然后，把当前城市信息添加到数组中
        cityList[first] = [item]
      }
    })

    const cityIndex = Object.keys(cityList).sort()

    return {
      cityList,
      cityIndex
    }

  }

  //获取城市列表数据
  const getCityList = async () => {
    let res = await axios.get('/area/city?level=1')
    if(res.status === 200){
      const {cityList, cityIndex} = formatData(res.data.body)
      let hots = await getHots()
      //将数据添加到cityList中
      cityList['hot'] = hots
      //将索引添加到cityIndex中
      cityIndex.unshift('hot')

      //获取当前城市数据
      const currentCity = await getCurrentCity()
      //将当前定位城市数据添加
      cityList['#'] = [currentCity]
      cityIndex.unshift('#')

      setCityList(cityList)
      setCityIndex(cityIndex)
    }

  }

  //获取热门城市数据
  const getHots = async () => {
    let res = await axios.get('/area/hot')
    if(res.status === 200){
      return res.data.body
    }
  }

  //格式化城市索引的函数
  const formatCityIndex = (letter) => {
    switch (letter) {
      case '#':
        return '当前定位'
      case 'hot':
        return '热门城市'
      default:
        return letter.toUpperCase()
    }
  }

  //动态计算每一行的高度
  const getRowHeight = ({index}) => {
    //索引标题高度 + 城市数量 * 城市高度
    return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_TITLE
  }

  //当列表滚动时的方法  解构出当前可视区最顶部的索引
  const onRowsRendered = ({startIndex}) => {
  //  判断可视区最顶部的索引是否与当前的activeIndex相同
    if(startIndex !== activeIndex){
      setActiveIndex(startIndex)
    }
  }

  //切换城市
  const changeCity = ({ label, value }) => {
  //  判断是否有房源数据
    if (HOUSE_CITY.includes(label)){
    //  存储到本地
      localStorage.setItem('hkzf_city', JSON.stringify({ label, value }))
    //  返回上一页
      navigete(-1)
    }else{
    //  提示 没有房源数据
      Toast.show({
        content: '暂无房源数据',
        duration: 1000
      })
    }
  }

  //渲染每一行数据的渲染函数
  //函数的返回值就表示最终渲染在页面中的内容
  const rowRenderer = (
    {
     key, // Unique key within array of rows
     index, // 索引值
     isScrolling, // 当前项是否正在滚动中
     isVisible, // 当前项在List中是可见的
     style, // 注意：重点属性，一定要给一个行数据添加该样式，作用：指定每一行的位置
   }) =>  {
    const letter = cityIndex[index]

    return (
        <div key={key} style={style} className="city">
          <div className="title">{formatCityIndex(letter)}</div>
          {
            cityList[letter].map(item => {
              return  <div className="name" key={item.value} onClick={() => changeCity(item)}>{item.label}</div>
            })
          }

        </div>
    );
  }

  //渲染右侧列表
  const renderCityList = () => {
    return cityIndex.map((item, index) => (
        <li className="city-index-item" key={item} onClick={() => {
          setActiveIndex(index)
          listRef.current.scrollToRow(index)
        }}>
          <span className={ activeIndex === index ? "index-active" : ''}>{item === 'hot' ? '热' : item.toUpperCase()}</span>
        </li>
    ))
  }

  return (
      <div className="cityList">
        <NavHeader>城市选择</NavHeader>

        {/*城市列表*/}
        <AutoSizer>
          {
            ({width, height}) => <List
                width={width}
                height={height}
                rowCount={cityIndex.length}
                rowHeight={getRowHeight}
                rowRenderer={rowRenderer}
                onRowsRendered={onRowsRendered}
                ref={listRef}
                scrollToAlignment="start"
            />
          }
        </AutoSizer>

        {/*右侧索引列表*/}
        <ul className="city-index">
          {renderCityList()}
        </ul>

      </div>
  )
}