import React from 'react'
import {Card, Button, Form, Modal, Upload, Icon, Input, Tooltip, Col, Row, message,notification, Select} from 'antd'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import TypingCard from '../../../components/TypingCard'
import FormItem from 'antd/lib/form/FormItem'
import { isAuthenticatedid } from '../../../utils/Session'
import $ from 'jquery'


const {TextArea} = Input
const {Option} = Select;

@Form.create()
class NotificationDemo extends React.Component{
  state = {
    placement:'',
    data_course: [
      
    ],
    data_homework: [],
    lecture:''
  }

  componentWillMount() {
    $.ajax({
      type: 'POST',
      url: "/UserLog",
      data: {
          userid: isAuthenticatedid(),
      },
      success: function (ret) {
        console.log(ret)
        if (ret === 'success'){
          const course = ret.map(data => {
            return{
              key: data.c_id,
              c_name: data.c_name
            }
          })
          this.state.data_course = course
        }
      }
    })
  }
  handleLectureChange = value => {
    this.setState({lecture: value});
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        message.warning('请先填写正确的表单')
      } 
      else {
        $.ajax({
          type: 'POST',
          url: "/",
          data: {
            id: isAuthenticatedid(),
            h_name: values.homework_name,
            h_des:values.homework_des
          },
          success:function(data){
            console.log(data);
            message.info("提交成功")
          }
        });
      }
    });
  }

  openNotification(obj){
    notification.open({
      message: 'Notification Title',
      description: 'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      ...obj
    })
  }
  openNotificationType(type){
    notification[type]({
      message: 'Notification Title',
      description: 'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    });
  }
  customNotification(){
    const key = Date.now()
    notification.open({
      message: 'Notification Title',
      description: 'A function will be be called after the notification is closed (automatically after the "duration" time of manually).',
      key,
      btn:<Button type="primary" onClick={() => notification.close(key)}>Confirm</Button>
    })
  }
  render(){
    const placement = this.state.placement
    const lectures = this.state.data_course
    const handleLectureChange = this.handleLectureChange
    /*
    const cardContent = ` 在系统四个角显示通知提醒信息。经常用于以下情况：
          <ul class="card-ul">
            <li>较为复杂的通知内容</li>
            <li>带有交互的通知，给出用户下一步的行动点</li>
            <li>系统主动推送</li>
          </ul>`
    */
   const cardContent = ` 这个页面用于布置作业。 `
   const {getFieldDecorator, getFieldValue} = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 4},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 12},
      },
    };
   
    return (
      <div>
        <CustomBreadcrumb arr={['作业','布置作业']}/>
        <TypingCard source={cardContent}/>
        <Card>
        <Form>
          <Form.Item label = '选择课程'>
          <Select defaultValue={lectures[0].c_id} style={{ width: 240 }} onChange={handleLectureChange}>
            {lectures.map(lecture => (
              <Option key={lecture.c_id}>{lecture.c_name}</Option>
            ))}
          </Select>
          </Form.Item>
          <Form.Item label = '作业名称'  {...formItemLayout}>
          {
            getFieldDecorator('homework_name', {
              rules: [
                {
                  type: 'homework_name',
                  message: '请输入正确的邮箱地址'
                },
                {
                  required: true,
                  message: '请填写作业名称'
                }
              ]
            })(
            <Input/>
            )
          }
          </Form.Item>
          <Form.Item label = '作业描述'>
          {
            getFieldDecorator('homework_des', {
              rules: [
                {
                  type: 'homework_des',
                  message: '请输入作业描述'
                },
                {
                  required: true,
                  message: '请输入作业描述'
                }
              ]
            })(
            <TextArea row = {4} />
            )
            }
            </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>
              提交
            </Button>
          </Form.Item>
        </Form>
        </Card>
      </div>
    )
    
    /*
    return (
      <div>
        <CustomBreadcrumb arr={['反馈','通知提醒框']}/>
        <TypingCard source={cardContent} height={234}/>
        <Row gutter={16}>
          <Col span={12}>
            <Card bordered={false} className='card-item'>
              <Tooltip title='最简单的用法，4.5 秒后自动关闭' placement='right'>
                <Button type='primary' onClick={this.openNotification}>基本用法</Button>
              </Tooltip>
            </Card>
          </Col>
          <Col span={12}>
            <Card bordered={false} className='card-item'>
              <Tooltip title='设置duration: 0来取消自动关闭' placement='right'>
                <Button type='primary' onClick={()=>this.openNotification({duration:0})}>取消自动关闭</Button>
              </Tooltip>
            </Card>
          </Col>
          <Col span={12}>
            <Card bordered={false} className='card-item'>
             <Button type='primary' onClick={()=>this.openNotificationType('success')}>成功</Button>&emsp;
             <Button type='primary' onClick={()=>this.openNotificationType('info')}>提醒</Button>&emsp;
             <Button type='primary' onClick={()=>this.openNotificationType('warning')}>警告</Button>&emsp;
             <Button type='primary' onClick={()=>this.openNotificationType('error')}>错误</Button>
            </Card>
          </Col>
          <Col span={12}>
            <Card bordered={false} className='card-item'>
              <Tooltip title='使用 style 和 className 来定义样式' placement='right'>
                <Button type='primary' onClick={()=>this.openNotification({style:{width: 600, marginLeft: 335 - 600,}})}>自定义样式</Button>
              </Tooltip>
            </Card>
          </Col>
          <Col span={12}>
            <Card bordered={false} className='card-item'>
              <Tooltip title='自定义关闭按钮的样式和文字' placement='right'>
                <Button type='primary' onClick={this.customNotification}>自定义按钮</Button>
              </Tooltip>
            </Card>
          </Col>
          <Col span={12}>
            <Card bordered={false} className='card-item'>
              <Select defaultValue='topRight' style={{width:160}} onChange={v=>this.setState({placement:v})}>
                <Select.Option value='topLeft'>topLeft</Select.Option>
                <Select.Option value='topRight'>topRight</Select.Option>
                <Select.Option value='bottomLeft'>topLeft</Select.Option>
                <Select.Option value='bottomRight'>bottomRight</Select.Option>
              </Select>&emsp;&emsp;
              <Button onClick={()=>this.openNotification({placement})}>打开消息通知</Button>
            </Card>
          </Col>
        </Row>
      </div>
    )
    */
    
  }
}

export default NotificationDemo