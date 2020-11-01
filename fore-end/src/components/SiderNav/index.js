import React from 'react'
import CustomMenu from "../CustomMenu/index";

const menus = [
  {
    title: '首页',
    icon: 'home',
    key: '/home'
  },
  // {
  //   title: '导航组件',
  //   icon: 'bars',
  //   key: '/home/navigation',
  //   subs: [
  //     {key: '/home/navigation/dropdown', title: '下拉菜单', icon: ''},
  //     {key: '/home/navigation/menu', title: '导航菜单', icon: ''},
  //     {key: '/home/navigation/steps', title: '步骤条', icon: ''},
  //   ]
  // },
  {
    title: '用户信息',
    icon: 'edit',
    key: '/home/entry',
    subs: [
      {
        key: '/home/entry/basic-form',
        title: '个人信息修改',
        icon: '',
      },
      // {
      //   key: '/home/entry/step-form',
      //   title: '个人信息一览',
      //   icon: '',
      // },
      // {key: '/home/entry/upload', title: '上传', icon: ''},
    ]
  },
  {
    title: '课程功能',
    icon: 'desktop',
    key: '/home/display',
    subs: [
      {key: '/home/display/carousel', title: '轮播图', icon: ''},
      {key: '/home/display/collapse', title: '折叠面板', icon: ''},
      {key: '/home/display/list', title: '列表', icon: ''},
      {key: '/home/display/table', title: '表格', icon: ''},
      {key: '/home/display/tabs', title: '标签页', icon: '',},
    ]
  },
  {
    title: '作业功能',
    icon: 'message',
    key: '/home/feedback',
    subs: [
      {key: '/home/feedback/modal', title: '对话框', icon: '',},
      {key: '/home/feedback/notification', title: '通知提醒框', icon: ''},
      {key: '/home/feedback/spin', title: '加载中', icon: '',}
    ]
  }
  //, {
  //   title: '其它',
  //   icon: 'bulb',
  //   key: '/home/other',
  //   subs:[
  //     {key: '/home/other/animation', title: '动画', icon: '',},
  //     {key: '/home/other/gallery', title: '画廊', icon: '',},
  //     {key:'/home/other/draft',title:'富文本',icon:''},
  //     {key:'/home/other/chart',title:'图表',icon:''},
  //     {key:'/home/other/loading',title:'加载动画',icon:''},
  //     {key:'/home/other/404',title:'404',icon:''},
  //     {key:'/home/other/springText',title:'弹性文字',icon:''},
  //   ]
  // },
  // {
  //   title: '关于',
  //   icon: 'info-circle-o',
  //   key: '/home/about'
  // }
]


class SiderNav extends React.Component {
  render() {

    return (
      <div style={{height: '100vh',overflowY:'scroll'}}>
        <div style={styles.logo}></div>
        <CustomMenu menus={menus}/>
      </div>
    )
  }
}

const styles = {
  logo: {
    height: '32px',
    background: 'rgba(255, 255, 255, .2)',
    margin: '16px'
  }
}

export default SiderNav