import React from 'react'
import { Form, Input, message, Row, Col, Button } from 'antd'
import { inject, observer } from 'mobx-react/index'
import { calculateWidth } from '../../utils/utils'
import PromptBox from '../../components/PromptBox'
import $ from 'jquery'


@inject('appStore') @observer @Form.create()
class RegisterForm extends React.Component {
  constructor(props) {
    super(props);

    this.registerSubmit = this.registerSubmit.bind(this);


  }
  state = {
    focusItem: -1
  }
  sendCode = () => { }
  registerSubmit = (e) => {
    e.preventDefault()
    this.setState({
      focusItem: -1
    })
    this.props.form.validateFields((err, values) => {
      if (!err) {
        $.ajax({
          type: 'POST',
          url: "/lesson9/api/register",
          data: {
            name: values.name,
            id: values.id,
            password: values.password,
            email: values.email,
            phonenum: values.phonenum
          },
          success: function (data) {
            console.log(data);
            let ret = JSON.parse(data);
            if (ret.info === 'S' || ret.info === 'T' || ret.info === 'A') {
              message.info("注册成功！！！");
              this.props.switchShowBox('login')
              setTimeout(() => this.props.form.resetFields(), 500)
              //console.log(ret.name);
              //this.setCookie("username",values.username,15)
              //this.props.appStore.toggleLogin(true, { username: values.name })
              //const { from } = this.props.location.state || { from: { pathname: '/' } }
              //this.props.history.push(from)
            }
            // if (ret.info === 'WRONGPWD' || ret.info === 'NULL') {
            else {
              //console.log('pwd error!! info is ')
              console.log(ret.info)
              //message.info("密码错误，请检查你的用户名和密码！！！");
              message.info(ret.info)
            }


          }.bind(this)
        });
        // const users = this.props.appStore.users
        // // 检测用户名是否存在
        // const result = users.find(item => item.username === values.registerUsername)
        // if (result) {
        //   this.props.form.setFields({
        //     registerUsername: {
        //       value: values.registerUsername,
        //       errors: [new Error('用户名已存在')]
        //     }
        //   })
        //   return
        // }

        // const obj = [...this.props.appStore.users, {
        //   username: values.registerUsername,
        //   password: values.registerPassword
        // }]
        // localStorage.setItem('users', JSON.stringify(obj))
        // this.props.appStore.initUsers()
        // message.success('注册成功')
      }
    })
  }
  gobackLogin = () => {
    this.props.switchShowBox('login')
    setTimeout(() => this.props.form.resetFields(), 500)
  }

  render() {
    const { getFieldDecorator, getFieldError, getFieldValue } = this.props.form
    const { focusItem } = this.state
    return (
      <div className={this.props.className}>
        <h3 className='title'>用户注册</h3>
        <Form onSubmit={this.registerSubmit}>
          <Form.Item help={getFieldError('name') && <PromptBox info={getFieldError('name')}
            width={calculateWidth(getFieldError('name'))} />}>
            {getFieldDecorator('name', {
              validateFirst: true,
              rules: [
                { required: true, message: '姓名不能为空' },
                {
                  validator: (rule, value, callback) => {
                    console.log(value)
                    
                    if(value != ''){
                      var reg = /^[0-9a-z_]+$/
                      console.log(reg.test(value))
                      reg.test(value) ? callback():callback("请输入小写字母数字及下划线的组合")
                    }
                    //if (/^[0-9a-z_]+$/.test(value) == false) {
                      //if (/^[a-zA-Z0-9_-] +@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]{2,5}){1,2}$/.test(value) == false){
                      //callback('请输入小写字母数字及下划线的组合')
                    //}
                    else{
                      callback("不能为空")
                    }
                  }
                },
              ]
            })(
              <Input
                onFocus={() => this.setState({ focusItem: 0 })}
                onBlur={() => this.setState({ focusItem: -1 })}
                maxLength={16}
                placeholder='姓名'
                addonBefore={<span className='iconfont icon-User' style={focusItem === 0 ? styles.focus : {}} />} />
            )}
          </Form.Item>
          <Form.Item help={getFieldError('id') && <PromptBox info={getFieldError('id')}
            width={calculateWidth(getFieldError('id'))} />}>
            {getFieldDecorator('id', {
              validateFirst: true,
              rules: [
                { required: true, message: '学工号不能为空' },
                {
                  pattern: new RegExp(/^[0-9]\d*$/, "g"),
                  message: '请输入正确的ID'
                }],
              getValueFromEvent: (event) => {
                return event.target.value.replace(/\D/g, '')
              },
              initialValue: ''
            })(
              <Input
                onFocus={() => this.setState({ focusItem: 1 })}
                onBlur={() => this.setState({ focusItem: -1 })}
                maxLength={16}
                placeholder='学工号'
                addonBefore={<span className='iconfont icon-User' style={focusItem === 1 ? styles.focus : {}} />} />
            )}
          </Form.Item>
          <Form.Item help={getFieldError('password') && <PromptBox info={getFieldError('password')}
            width={calculateWidth(getFieldError('password'))} />}>
            {getFieldDecorator('password', {
              validateFirst: true,
              rules: [
                { required: true, message: '密码不能为空' },
                {
                  validator: (rule, value, callback) => {
                    console.log(value)

                    if (value != '' && value.length >= 6) {
                      var testPassword = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,15}$/

                      console.log(testPassword.test(value))
                      testPassword.test(value) ? callback() : callback("请输入大小写字母数字及符号的任意三种组合")
                    }
                    //if (/^[0-9a-z_]+$/.test(value) == false) {
                    //if (/^[a-zA-Z0-9_-] +@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]{2,5}){1,2}$/.test(value) == false){
                    //callback('请输入小写字母数字及下划线的组合')
                    //}
                    else if (value != '' && value.length < 6){
                      callback("密码长度应不小于六位")
                    }
                    else{
                      callback("密码不能为空")
                    }
                  }
                },
              ]
            })(
              <Input
                onFocus={() => this.setState({ focusItem: 2 })}
                onBlur={() => this.setState({ focusItem: -1 })}
                type='password'
                maxLength={16}
                placeholder='密码'
                addonBefore={<span className='iconfont icon-suo1' style={focusItem === 2 ? styles.focus : {}} />} />
            )}
          </Form.Item>
          <Form.Item help={getFieldError('confirmPassword') && <PromptBox info={getFieldError('confirmPassword')}
            width={calculateWidth(getFieldError('confirmPassword'))} />}>
            {getFieldDecorator('confirmPassword', {
              validateFirst: true,
              rules: [
                { required: true, message: '请确认密码' },
                {
                  validator: (rule, value, callback) => {
                    if (value && value !== getFieldValue('password')) {
                      callback('两次输入不一致！')
                    }
                    callback()
                  }
                },
              ]
            })(
              <Input
                onFocus={() => this.setState({ focusItem: 3 })}
                onBlur={() => this.setState({ focusItem: -1 })}
                type='password'
                maxLength={30}
                placeholder='确认密码'
                addonBefore={<span className='iconfont icon-suo1' style={focusItem === 3 ? styles.focus : {}} />} />
            )}
          </Form.Item>
          {/*<Form.Item help={getFieldError('email') && <PromptBox info={getFieldError('email')}
            width={calculateWidth(getFieldError('email'))} />}>
            {getFieldDecorator('email', {
              validateFirst: true,
              rules: [
                { required: true, message: '请输入邮箱' },
                {
                  validator: (rule, value, callback) => {
                    if (/^[\w-]{3,}(\.\w+)*@[A-z0-9]+(\.[A-z]{2,5}){1,2}$/.test(value) == false) {
                      callback('请输入正确的email')
                    }
                    callback()
                  }
                },
              ]
            })(
              <Input
                onFocus={() => this.setState({ focusItem: 4 })}
                onBlur={() => this.setState({ focusItem: -1 })}
                type='email'
                
                placeholder='邮箱地址'
                addonBefore={<span className='iconfont icon-suo1' style={focusItem === 4 ? styles.focus : {}} />} />
            )}
          </Form.Item>
          <Form.Item help={getFieldError('phonenum') && <PromptBox info={getFieldError('phonenum')}
            width={calculateWidth(getFieldError('phonenum'))} />}>
            {getFieldDecorator('phonenum', {
              validateFirst: true,
              rules: [
                { required: true, message: '请输入手机号' },
                {
                  validator: (rule, value, callback) => {
                    //if (/^((\+)?86|((\+)?86)?)0?1[34758]\d{9}$/.test(value) == false) {
                      if (/^((\+)?86|((\+)?86)?)0?1\d{10}$/.test(value) == false) {
                      callback('请输入正确的手机号')
                    }
                    callback()
                  }
                },
              ]
            })(
              <Input
                onFocus={() => this.setState({ focusItem: 5 })}
                onBlur={() => this.setState({ focusItem: -1 })}
                type='phonenum'
                maxLength={16}
                placeholder='手机号'
                addonBefore={<span className='iconfont icon-suo1' style={focusItem === 5 ? styles.focus : {}} />} />
            )}
          </Form.Item>
          <Row>
            <Col span={17}>
              <Input
                onFocus={() => this.setState({ focusItem: 6 })}
                onBlur={() => this.setState({ focusItem: -1 })}
                maxLength={6}
                placeholder='验证码'
                addonBefore={<span className='iconfont icon-securityCode-b'
                  style={focusItem === 6 ? styles.focus : {}} />} />
            </Col>
            <div className='button'>
              <Button >发送</Button>
            </div>
          </Row>
          */}
          <div className='bottom'>
            <input className='loginBtn' type="submit" value='注册' />
            <span className='registerBtn' onClick={this.gobackLogin}>返回登录</span>
          </div>
        </Form>
        <div className='footer'>
          <div>欢迎登陆平台系统</div>
        </div>
      </div>
    )
  }
}

const styles = {
  focus: {
    width: '20px',
    opacity: 1
  },
}

export default RegisterForm
