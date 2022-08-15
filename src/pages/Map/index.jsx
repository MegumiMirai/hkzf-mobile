import React, {useEffect, useState} from "react";
import NavHeader from "../../components/NavHeader";
import {Toast} from "antd-mobile";

//导入样式文件
// import './index.scss'
import styles from './index.module.css'
import axios from "axios";
import {useNavigate} from "react-router";

export default function Map() {

  let anotherMap = null
  const navigate = useNavigate()
  //小区的房源数据
  const [houseList, setHouseList] = useState([])
  //是否显示数据
  const [isShowList, setIsShowList] = useState(false)

  //覆盖物样式
  const labelStyle = {
    cursor: 'pointer',
    border: '0px solid rgb(255, 0, 0)',
    padding: '0px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    color: 'rgb(255, 255, 255)',
    textAlign: 'center'
  }

  useEffect(() => {
    initMap()
  }, [])

  //初始化地图
  const initMap = () => {

    const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))

    const map = new window.BMapGL.Map("container");
    // const point = new window.BMapGL.Point(116.404, 39.915);

    //作用：能在其他函数中也访问到map
    anotherMap = map

    //创建地址解析器实例
    var myGeo = new window.BMapGL.Geocoder();
    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(label, async (point) => {
      if(point){
        //初始化地图
        map.centerAndZoom(point, 11);
        map.addOverlay(new window.BMapGL.Marker(point))
        map.addControl(new window.BMapGL.ZoomControl())
        map.addControl(new window.BMapGL.ScaleControl())

        renderOverlays(value)

        //给地图添加移动事件,在地图移动时隐藏房源列表
        map.addEventListener('movestart', () => {
          // console.log(isShowList)
          // if(isShowList){
            setIsShowList(false)
          // }
        })

        /* //获取房源数据
        const res = await axios.get(`/area/map?id=${value}`)

        //遍历数据，创建覆盖物
        res.data.body.forEach(item => {
          //解构出需要的数据
          const { coord: { longitude, latitude }, label: areaName, count, value } = item

          const areaPoint = new window.BMapGL.Point(longitude, latitude)

          const opts = {
            position: areaPoint, // 指定文本标注所在的地理位置
            offset: new window.BMapGL.Size(-35, -35) // 设置文本偏移量
          };

          //创建label实例对象
          const label = new window.BMapGL.Label('', opts);

          //给每个覆盖物添加唯一标识
          label.id = value

          //设置房源覆盖物内容
          label.setContent(`
            <div class="${styles.bubble}">
              <p class="${styles.name}">${areaName}</p>
              <p>${count}套</p>
            </div>
          `)

          //添加样式
          label.setStyle(labelStyle)

          //覆盖物添加点击事件
          label.addEventListener('click', () => {
            console.log('房源信息被点击了', label.id)

          //  放大地图
          //  第一个参数：坐标对象
          //  第二个参数：放大级别
            map.centerAndZoom(point, 13);

          //  清除覆盖物
            map.clearOverlays()
          })

          map.addOverlay(label);
        })*/
      }else{
        alert('您选择的地址没有解析到结果！');
      }

    }, label)
  }

  //渲染覆盖物入口
  //1.接收区域id参数，获取该区域下的房源数据
  //2.获取房源类型以及下级地图缩放级别
  const renderOverlays = async (id) => {
    try{
      Toast.show({
        icon: 'loading',
        content: '加载中…',
        duration: 0
      })
      //获取房源数据
      const res = await axios.get(`/area/map?id=${id}`)
      Toast.clear()
      // console.log('调用renderOverlays，房源数据', res)
      const data = res.data.body

      //调用getTypeAndZoom方法获取级别和类型
      let {nextZoom, type} = getTypeAndZoom()

      data.forEach(item => {
        //创建覆盖物
        createOverlays(item, nextZoom, type)
      })
    }catch (e) {
      Toast.clear()
    }

  }

  //计算要绘制的覆盖物类型和下一个缩放级别
  //区 -> 11, 范围 >=10 <12
  //镇 -> 13, 范围 >=12 <14
  //小区 -> 15, 范围 >=14 <16
  const getTypeAndZoom = () => {
    // console.log(anotherMap)
    //调用地图的getZoom()方法，获取当前缩放级别
    const zoom = anotherMap.getZoom()
    let nextZoom, type

    // console.log('当前地图缩放级别', zoom)

    if(zoom >= 10 && zoom < 12){
      nextZoom = 13
      type = 'circle'
    }else if(zoom >= 12 && zoom < 14){
      nextZoom = 15
      type = 'circle'
    }else if(zoom >= 14 && zoom < 16){
      type = 'rect'
    }

    return {nextZoom, type}
  }

  //创建覆盖物的函数
  const createOverlays = (data, zoom, type) => {
    //根据type决定创建什么
    //解构出需要的数据
    const { coord: { longitude, latitude }, label: areaName, count, value } = data
    //坐标对象
    const areaPoint = new window.BMapGL.Point(longitude, latitude)

    if(type === 'circle'){
      createCircle(areaPoint, areaName, count, value, zoom)
    }else{
      createRect(areaPoint, areaName, count, value)
    }
  }

  //创建区、镇的函数
  const createCircle = (point, name, count, id, zoom) => {
    const opts = {
      position: point, // 指定文本标注所在的地理位置
      offset: new window.BMapGL.Size(-35, -35) // 设置文本偏移量
    };

    //创建label实例对象
    const label = new window.BMapGL.Label('', opts);

    //给每个覆盖物添加唯一标识
    label.id = id

    //设置房源覆盖物内容
    label.setContent(`
            <div class="${styles.bubble}">
              <p class="${styles.name}">${name}</p>
              <p>${count}套</p>
            </div>
          `)

    //添加样式
    label.setStyle(labelStyle)

    //覆盖物添加点击事件
    label.addEventListener('click', () => {
      // console.log('房源信息被点击了', label.id)

      //调用renderOverlays方法
      renderOverlays(id)

      //  放大地图
      //  第一个参数：坐标对象
      //  第二个参数：放大级别
      anotherMap.centerAndZoom(point, zoom);

      //  清除覆盖物
      anotherMap.clearOverlays()
    })

    anotherMap.addOverlay(label);
  }

  //创建小区的函数
  const createRect = (point, name, count, id ) => {
    const opts = {
      position: point, // 指定文本标注所在的地理位置
      offset: new window.BMapGL.Size(-50, -28) // 设置文本偏移量
    };

    //创建label实例对象
    const label = new window.BMapGL.Label('', opts);

    //给每个覆盖物添加唯一标识
    label.id = id

    //设置房源覆盖物内容
    label.setContent(`
      <div class="${styles.rect}">
        <span class="${styles.housename}">${name}</span>
        <span class="${styles.housenum}">${count}</span>
        <i class="${styles.arrow}"></i>
      </div>
    `)

    //添加样式
    label.setStyle(labelStyle)

    //覆盖物添加点击事件
    label.addEventListener('click', (e) => {
      // console.log('小区被点击了', e)
      //获取当前被点击项
      const target = e.domEvent.changedTouches[0]
      //调用地图的panBy方法，移动地图到中间位置
      anotherMap.panBy(
          window.innerWidth / 2 - target.clientX,
          (window.innerHeight - 330) / 2 - target.clientY
      )
      getHousesList(id)
    })

    anotherMap.addOverlay(label);
  }

  //获取小区房源列表数据
  const getHousesList = async (id) => {
    try{
      Toast.show({
        icon: 'loading',
        content: '加载中…',
        duration: 0
      })
      let res = await axios.get(`/houses?cityId=${id}`)

      Toast.clear()

      // console.log(res.data.body.list)
      setHouseList(res.data.body.list)
      //展示数据
      setIsShowList(true)
    }catch (e){
      Toast.clear()
    }
  }

  //渲染小区数据
  const renderHousesList = () => {
    return houseList.map(item => (
      <div className={styles.house} key={item.houseCode}>
        <div className={styles.imgWrap}>
          <img className={styles.img} src={`http://localhost:8080${item.houseImg}`} alt="" />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>${item.title}</h3>
          <div className={styles.desc}>${item.desc}</div>
          <div>
            {
              item.tags.map((tag, index) => {
                const tagClass = 'tag' + (index + 1)
                return (
                    <span key={tag} className={[styles.tag, styles[tagClass]].join(' ')} >{tag}</span>
                )
              })
            }
          </div>
          <div className={styles.price}>
            <span className={styles.priceNum}>${item.price}</span> 元/月
          </div>
        </div>
      </div>
    ))
  }

  return (
      <div className={styles.map}>
        <NavHeader>地图找房</NavHeader>
        <div id="container" className={styles.container}></div>

        {/* 房源列表 */}
        {/* 添加 styles.show 展示房屋列表 */}
        <div className={[styles.houseList,isShowList ? styles.show : ''].join(' ')}>
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <span className={styles.titleMore} onClick={() => {navigate('/home/list')}}>
              更多房源
            </span>
          </div>

          <div className={styles.houseItems}>
            {
              renderHousesList()
            }
          </div>
        </div>
      </div>
  )
}