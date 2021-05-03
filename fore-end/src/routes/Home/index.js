import React from 'react'
import './style.css'

class Home extends React.Component {
  render() {
    return (
      <div>
        <div style={{
          position: 'fixed',
          top: 0,
          left: '30%',
          width: '50%',
          fontSize: 42,
          textAlign: 'center',
        }}>
          交互媒体应用设计与开发VR实验项目
        </div>
        <div >
          <iframe src="http://dalab.se.sjtu.edu.cn/mse/" height={window.screen.height * window.devicePixelRatio * 0.70} width="100%" scrolling="auto"/>
           
          {/*<iframe src="http://10.119.7.114/mse_frontend/index.html" height={window.screen.height * window.devicePixelRatio * 0.70} width="100%" scrolling="auto"/>
           */}
        </div>
      </div>
    )
  }
}

const styles = {
  bg:{
    position:'absolute',
    top:0,
    left:0,
    width:'100%',
    height:'100%'
  }
}

export default Home