import React from 'react'
import {Carousel} from 'antd'
import './style.css'


class Home extends React.Component {
  render() {
    return (
      <div>
        <div style={styles.bg} className='home'>
          <Carousel arrows effect='fade' className='size'>
            <iframe src="http://dalab.se.sjtu.edu.cn/mse/" height="780px" frameborder="1" scrolling="auto"/>
          </Carousel>
        </div>
        <div style={{
          position: 'fixed',
          top: 0,
          left: '30%',
          width: '50%',
          fontSize: 42,
          textAlign: 'center',
        }}>
          DALAB实验管理系统
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