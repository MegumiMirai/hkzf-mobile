import React, {useEffect} from "react";

//导入样式文件
import './index.scss'

export default function Map() {

  useEffect(() => {
    const map = new window.BMapGL.Map("container");
    const point = new window.BMapGL.Point(116.404, 39.915);
    map.centerAndZoom(point, 15);
  }, [])

  return (
      <div className="map">
        <div id="container"></div>
      </div>
  )
}