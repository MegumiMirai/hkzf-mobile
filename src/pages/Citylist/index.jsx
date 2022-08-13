import React, {useEffect} from "react";
import {NavBar} from 'antd-mobile'
import {useNavigate} from "react-router";
import {getCurrentCity} from "../../util";

//导入样式文件
import './index.scss'
import axios from "axios";

export default function Citylist(){

  const navigete = useNavigate()

  useEffect ( () => {
    getCityList()
  }, [])

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

      console.log(cityList, cityIndex, currentCity)
    }

  }

  //获取热门城市数据
  const getHots = async () => {
    let res = await axios.get('/area/hot')
    if(res.status === 200){
      return res.data.body
    }
  }

  return (
      <div className="cityList">
        <NavBar onBack={() => {navigete(-1)}}>城市选择</NavBar>
      </div>
  )
}