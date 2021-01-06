import React from 'react'
import { Card, Carousel, Comment, message, Avatar, List, Form, Button, Input, Select } from 'antd'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import TypingCard from '../../../components/TypingCard'
import './css/style.css'
import 'animate.css'
import moment from 'moment'
import { isAuthenticatedid, isAuthenticated } from '../../../utils/Session'
import $ from 'jquery'


var ret = new Array()
/*
const animations = [
  ['bounceInDown','bounceInUp'],
  ['bounceInLeft','bounceInRight'],
  ['rotateIn','rotateIn'],
  ['flipInX','flipInY'],
  ['rotateInDownLeft','rotateInUpRight'],
  ['rotateInDownRight','rotateInUpLeft'],
  ['zoomInLeft','zoomInRight'],
  ['zoomInDown','zoomInUp'],
  ['zoomIn','zoomIn'],
  ['lightSpeedIn','bounceInLeft'],
]
// const colors = ['#364d79','#64cbcc','sandybrown','darksalmon','goldenrod','burlywood','darkseagreen','indianred']

function getAnimation(animations){
  let index = Math.floor(Math.random()*animations.length)
  let arr = animations[index]
  arr = arr.map(item=>{
    return `${item} animated slider-active`
  })
  return arr
}
*/
const { TextArea } = Input;
const { Option } = Select;

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length}条讨论`}
    itemLayout="horizontal"
    renderItem={props => <Comment {...props} />}
  />
);

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <div>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
        添加讨论
      </Button>
    </Form.Item>
  </div>
);

class CarouselDemo extends React.Component {
  constructor(props) {

    super(props)
    this.state = {
      experiments: [],
      cid: '',
      comments: [
        {
          author: 'Anonymous',
          avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
          content: <p>这是一个测试。</p>,
          datetime: '很久很久以前',
          type: 'teacher',
        },
      ],
      is_loading: false,
      dataSource: [],
      submitting: false,
      value: '',
      u_avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      id: '',
      name: '',
      type: '',
    }
    this.loadlist = this.loadlist.bind(this)
  }

  componentWillMount() {
    this.setState({
      is_loading: true
    })
    let uid = isAuthenticatedid()
    console.log(0);
    this.setState({
      id: uid
    }, () => {
      console.log(this.state.id);
      this.loadlist();
    })
  }

  loadlist() {
    var that = this
    $.ajax({
      type: 'POST',
      url: "/getlablist",
      data: {
        uid: this.state.id,
      },
      success: function (data) {
        message.info("success");
        ret = JSON.parse(data)
        console.log("ret_post ", ret)
        this.setState({
          experiments: ret,
          is_loading: false
        });
      }.bind(this)
    })
  }

  // 载入页面时需要获取每个comment的名字头像内容时间信息

  handleSubmit = () => {
    if (!this.state.value) {
      return;
    }

    this.setState({
      submitting: true,
    });
    $.ajax({
      type: 'POST',
      url: "/postreply",
      data: {
        postid: this.state.c_id,
        content: this.state.value,
        uid: this.state.id
      },
      success: function (data) {
        message.info("success");
        ret = JSON.parse(data)
        console.log("ret_post ", ret)
        this.setState({
          dataSource: ret,
          submitting: false
        });
      }.bind(this)
    })
    //    setTimeout(() => {
    //      this.setState({
    //        submitting: false,
    //        value: '',
    //        dataSource: [
    //          {
    //            author: this.state.name + (this.state.type == 'teacher' ? '老师' : ''),
    //            avatar: this.state.u_avatar,
    //            content: <p>{this.state.value}</p>,
    //            datetime: moment().fromNow(),
    //          },
    //          ...this.state.dataSource,
    //        ],
    //      });
    //    }, 1000);

    // 提交时要把内容传给后端
  };

  handleChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  onChangeExperiment = e => {
    this.setState({
      cid: e,
    })
    console.log("rinima")
    console.log(this.state.cid)
    $.ajax({
      type: 'POST',
      url: "/getpostlist",
      data: {
        labid: this.state.cid,
      },
      success: function (data) {
        message.info("success");
        ret = JSON.parse(data)
        console.log("ret_post2 ", ret)
        this.setState({
          dataSource: ret,
        });
      }.bind(this)
    })
  }

  render() {
    const { dataSource, submitting, value, is_loading, u_avatar, experiments } = this.state;
    const cardContent = `
      <li>这个页面用来讨论实验内容。</li>
      <li>教师的发言会被高亮表示方便学生看得更清楚。</li>
    `
    if (!is_loading) {
      return (
        <div>
          <CustomBreadcrumb arr={['实验功能', '实验讨论']} />
          <TypingCard source={cardContent} />
          <Card title='实验讨论'>
            <Select showSearch style={{ width: 200 }} placeholder='选择实验' onChange={this.onChangeExperiment}>
              {
                experiments.map(experiment => (
                  <Option key={experiment.labid}>
                    {experiment.labname}
                  </Option>
                ))
              }
            </Select>
            {dataSource.length > 0 && <CommentList comments={dataSource} />}
            <Comment
              avatar={
                <Avatar
                  src={u_avatar}
                  alt={isAuthenticated()}
                />
              }
              content={
                <Editor
                  onChange={this.handleChange}
                  onSubmit={this.handleSubmit}
                  submitting={submitting}
                  value={value}
                />
              }
            />
          </Card>
        </div>
      )
    }
    else {
      return (
        <div></div>
      )
    }
  }
  /*
  state = {
    current:0
  }
  animations = getAnimation(animations)
  componentWillUpdate(){
    //当current变化时，也就是state变化时重新给animations赋值，否则animations不会改变.实现类似vue的watch
    //用componentWUpdate还是componentDidUpdate根据具体场景，componentDidUpdate一般是需要用到state时调用（因为setState是异步，需要等更新完成）
    let temp  =  getAnimation(animations)
    while (this.animations[0] === temp[0] ) {
      temp = getAnimation(animations)
    }
    this.animations = temp

  }
  render(){
    const { current} = this.state
    const cardContent = `<ul class="card-ul">
            <li>当有一组平级的内容</li>
            <li>当内容空间不足时，可以用走马灯的形式进行收纳，进行轮播展现</li>
            <li>常用于一组图片或卡片轮播</li>
          </ul>`
    return (
      <div>
        <CustomBreadcrumb arr={['显示','轮播图']}/>
        <TypingCard source={cardContent} height={206}/>
        <Card title='基本用法'>
          <Carousel speed={100} arrows afterChange={(current)=>this.setState({current})} autoplay>
            <div>
              <div className='slider-item' style={{background:'#364d79'}}>
                <h3 className={current === 0 ? this.animations[0] : ''}>Ant Design of React</h3>
                <p className={current === 0 ? this.animations[1] : ''}>The Fast Way Use Animation In React</p>
              </div>
            </div>
            <div>
              <div className='slider-item' style={{background:'#64cbcc'}}>
                <h3 className={current === 1 ? this.animations[0] : ''}>Ant Design of React</h3>
                <p className={current === 1 ? this.animations[1] : ''}>The Fast Way Use Animation In React</p>
              </div>
            </div>
            <div>
              <div className='slider-item' style={{background:'sandybrown'}}>
                <h3 className={current === 2 ? this.animations[0] : ''}>Ant Design of React</h3>
                <p className={current === 2 ? this.animations[1] : ''}>The Fast Way Use Animation In React</p>
              </div>
            </div>
            <div>
              <div className='slider-item' style={{background:'darkseagreen'}}>
                <h3 className={current === 3 ? this.animations[0] : ''}>Ant Design of React</h3>
                <p className={current === 3 ? this.animations[1] : ''}>The Fast Way Use Animation In React</p>
              </div>
            </div>
          </Carousel>
        </Card>
      </div>
    )
  }
  */
}

const styles = {
  highlighted: {
    colors: '#0000FF',
  },
}

export default CarouselDemo