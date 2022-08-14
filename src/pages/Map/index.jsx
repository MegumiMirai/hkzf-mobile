import React, {useEffect} from "react";
import NavHeader from "../../components/NavHeader";

//导入样式文件
// import './index.scss'
import styles from './index.module.css'

export default function Map() {

  const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))
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
    const map = new window.BMapGL.Map("container");
    // const point = new window.BMapGL.Point(116.404, 39.915);

    //创建地址解析器实例
    var myGeo = new window.BMapGL.Geocoder();
    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(label, (point) => {
      if(point){
        //初始化地图
        map.centerAndZoom(point, 11);
        map.addOverlay(new window.BMapGL.Marker(point))
        map.addControl(new window.BMapGL.ZoomControl())
        map.addControl(new window.BMapGL.ScaleControl())
      }else{
        alert('您选择的地址没有解析到结果！');
      }

      const opts = {
        position: point, // 指定文本标注所在的地理位置
        offset: new window.BMapGL.Size(-35, -35) // 设置文本偏移量
      };

      //创建label实例对象
      const label = new window.BMapGL.Label('', opts);

      //设置房源覆盖物内容
      label.setContent(`
        <div class="${styles.bubble}">
          <p class="${styles.name}">浦东</p>
          <p>99套</p>
        </div>
      `)

      //添加样式
      label.setStyle(labelStyle)

      //文本覆盖物添加点击事件
      map.addEventListener('click', () => {
        console.log('房源信息被点击了')
      })

      map.addOverlay(label);
    }, label)
  }

  return (
      <div className={styles.map}>
        <NavHeader>地图找房</NavHeader>
        <div id="container" className={styles.container}></div>
      </div>
  )
}