import axios from "axios";

//根据IP获取当前城市位置
export const getCurrentCity = () => {
  const localCity = JSON.parse(localStorage.getItem('hkzf_city'))
  //先判断localStorage中是否有定位城市
  if(!localCity){
    return new Promise((resolve, reject) => {
      //如果没有，就发送请求获取，并保存到localStorage
      const myCity = new window.BMapGL.LocalCity()
      //获取城市
      myCity.get(async res => {
        try {
          //发送请求获取城市
          let result = await axios.get(`/area/info?name=${res.name}`)
          if(result.status === 200){
            //存储到localStorage中
            localStorage.setItem('hkzf_city', JSON.stringify(result.data.body))
            resolve(result.data.body)
          }
        }catch (e){
          //获取城市定位失败
          reject(e)
        }
      })
    })
  }
  //如果有，直接返回本地存储中的城市数据
  //因为上面为了处理异步操作，使用了Promise，因此，为了该函数返回值的统一，此处也使用Promise
  //因为此处的Promise不会失败，所以，此处只要返回一个成功的PRomise即可
  return Promise.resolve(localCity)
}