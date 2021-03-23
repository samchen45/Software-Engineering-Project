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
      // {
      //   key: '/home/entry/step-form',
      //   title: '个人信息一览',
      //   icon: '',
      // },
      {
        key: '/home/entry/basic-form',
        title: '个人信息修改',
        icon: '',
      },
      // {key: '/home/entry/upload', title: '上传', icon: ''},
    ]
  },
  {
    title: '实验功能',
    icon: 'desktop',
    key: '/home/display',
    subs: [
      {key: '/home/display/table', title: '实验管理', icon: ''},
      {key: '/home/display/collapse', title: '学生管理', icon: ''},
      {key: '/home/display/list', title: '实验报告', icon: ''},
      {key: '/home/display/carousel', title: '实验讨论', icon: ''},
      {key: '/home/display/tabs', title: '实验评价', icon: ''},
      {key: '/home/display/questions', title: '实验提问', icon: ''},
    ]
  },
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