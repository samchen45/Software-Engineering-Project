import React from 'react'
import { Form, Input, message, Row, Col, Button } from 'antd'
import { inject, observer } from 'mobx-react/index'
import { calculateWidth } from '../../utils/utils'
import PromptBox from '../../components/PromptBox'


@inject('appStore') @observer @Form.create()
class RegisterForm extends React.Component {
  state = {
    focusItem: -1
  }
  sendCode = () => {}
  registerSubmit = (e) => {
    e.preventDefault()
    this.setState({
      focusItem: -1
    })
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const users = this.props.appStore.users
        // 检测用户名是否存在
        const result = users.find(item => item.username === values.registerUsername)
        if (result) {
          this.props.form.setFields({
            registerUsername: {
              value: values.registerUsername,
              errors: [new Error('用户名已存在')]
            }
          })
          return
        }

        const obj = [...this.props.appStore.users, {
          username: values.registerUsername,
          password: values.registerPassword
        }]
        localStorage.setItem('users', JSON.stringify(obj))
        this.props.appStore.initUsers()
        message.success('注册成功')
      }
    })
  }
  gobackLogin = () => {
    this.props.switchShowBox('login')
    setTimeout(() => this.props.form.resetFields(), 500)
  }

  render () {
    const {getFieldDecorator, getFieldError, getFieldValue} = this.props.form
    const {focusItem} = this.state
    return (
      <div className={this.props.className}>
        <h3 className='title'>用户注册</h3>
        <Form onSubmit={this.registerSubmit}>
          <Form.Item help={getFieldError('registerUsername') && <PromptBox info={getFieldError('registerUsername')}
                                                                           width={calculateWidth(getFieldError('registerUsername'))}/>}>
            {getFieldDecorator('registerUsername', {
              validateFirst: true,
              rules: [
                {required: true, message: '用户名不能为空'},
                {pattern: '^[^ ]+$', message: '不能输入空格'},
              ]
            })(
              <Input
                onFocus={() => this.setState({focusItem: 0})}
                onBlur={() => this.setState({focusItem: -1})}
                maxLength={16}
                placeholder='用户名'
                addonBefore={<span className='iconfont icon-User' style={focusItem === 0 ? styles.focus : {}}/>}/>
            )}
          </Form.Item>
          <Form.Item help={getFieldError('registerUserID') && <PromptBox info={getFieldError('registerUserID')}
                                                                           width={calculateWidth(getFieldError('registerUserID'))}/>}>
            {getFieldDecorator('registerUserID', {
              validateFirst: true,
              rules:[ 
                  {required: true, message: '学工号不能为空'},
                  {pattern: new RegExp(/^[1-9]\d*$/, "g"),
                  message: '请输入正确的ID'
              }],
              getValueFromEvent: (event) => {
                  return event.target.value.replace(/\D/g,'')
              },
              initialValue:''
            })(
              <Input
                onFocus={() => this.setState({focusItem: 1})}
                onBlur={() => this.setState({focusItem: -1})}
                maxLength={16}
                placeholder='学工号'
                addonBefore={<span className='iconfont icon-User' style={focusItem === 1 ? styles.focus : {}}/>}/>
            )}
          </Form.Item>
          <Form.Item help={getFieldError('registerPassword') && <PromptBox info={getFieldError('registerPassword')}
                                                                           width={calculateWidth(getFieldError('registerPassword'))}/>}>
            {getFieldDecorator('registerPassword', {
              validateFirst: true,
              rules: [
                {required: true, message: '密码不能为空'},
                {pattern: '^[^ ]+$', message: '密码不能有空格'}
              ]
            })(
              <Input
                onFocus={() => this.setState({focusItem: 2})}
                onBlur={() => this.setState({focusItem: -1})}
                type='password'
                maxLength={16}
                placeholder='密码'
                addonBefore={<span className='iconfont icon-suo1' style={focusItem === 2 ? styles.focus : {}}/>}/>
            )}
          </Form.Item>
          <Form.Item help={getFieldError('confirmPassword') && <PromptBox info={getFieldError('confirmPassword')}
                                                                          width={calculateWidth(getFieldError('confirmPassword'))}/>}>
            {getFieldDecorator('confirmPassword', {
              validateFirst: true,
              rules: [
                {required: true, message: '请确认密码'},
                {
                  validator: (rule, value, callback) => {
                    if (value && value !== getFieldValue('registerPassword')) {
                      callback('两次输入不一致！')
                    }
                    callback()
                  }
                },
              ]
            })(
              <Input
                onFocus={() => this.setState({focusItem: 3})}
                onBlur={() => this.setState({focusItem: -1})}
                type='password'
                maxLength={16}
                placeholder='确认密码'
                addonBefore={<span className='iconfont icon-suo1' style={focusItem === 3 ? styles.focus : {}}/>}/>
            )}
          </Form.Item>
          <Form.Item help={getFieldError('email_address') && <PromptBox info={getFieldError('email_address')}
                                                                          width={calculateWidth(getFieldError('email_address'))}/>}>
            {getFieldDecorator('email_address', {
              validateFirst: true,
              rules: [
                {required: true, message: '请输入邮箱'},
                {
                  validator: (rule, value, callback) => {
                    if(/^\w{3,}(\.\w+)*@[A-z0-9]+(\.[A-z]{2,5}){1,2}$/.test(value) == false) {
                      callback('请输入正确的email')
                    }
                    callback()
                  }
                },
              ]
            })(
              <Input
                onFocus={() => this.setState({focusItem: 4})}
                onBlur={() => this.setState({focusItem: -1})}
                type='email_address'
                maxLength={16}
                placeholder='邮箱地址'
                addonBefore={<span className='iconfont icon-suo1' style={focusItem === 4 ? styles.focus : {}}/>}/>
            )}
          </Form.Item>
          <Form.Item help={getFieldError('phone_num') && <PromptBox info={getFieldError('phone_num')}
                                                                          width={calculateWidth(getFieldError('phone_num'))}/>}>
            {getFieldDecorator('phone_num', {
              validateFirst: true,
              rules: [
                {required: true, message: '请输入手机号'},
                {
                  validator: (rule, value, callback) => {
                    if(/^((\+)?86|((\+)?86)?)0?1[3458]\d{9}$/.test(value) == false) {
                      callback('请输入正确的手机号')
                    }
                    callback()
                  }
                },
              ]
            })(
              <Input
                onFocus={() => this.setState({focusItem: 5})}
                onBlur={() => this.setState({focusItem: -1})}
                type='phone_num'
                maxLength={16}
                placeholder='手机号'
                addonBefore={<span className='iconfont icon-suo1' style={focusItem === 5 ? styles.focus : {}}/>}/>
            )}
          </Form.Item>
          <Row>
                  <Col span={17}>
                  <Input
                    onFocus={() => this.setState({focusItem: 6})}
                    onBlur={() => this.setState({focusItem: -1})}
                    maxLength={6}
                    placeholder='验证码'
                    addonBefore={<span className='iconfont icon-securityCode-b'
                                       style={focusItem === 6 ? styles.focus : {}}/>}/>
                </Col>
                <div className='button'>
                  <Button >发送</Button>
                </div>
          </Row>
          <div className='bottom'>
            <input className='loginBtn' type="submit" value='注册'/>
            <span className='registerBtn' onClick={this.gobackLogin}>返回登录</span>
          </div>
        </Form>
        <div className='footer'>
          <div>欢迎登陆后台管理系统</div>
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