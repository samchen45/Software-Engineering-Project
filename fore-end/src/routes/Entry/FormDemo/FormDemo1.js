import React from 'react'
import {Card,Cascader, Tooltip, Icon, Form, Checkbox, Select, Input, Button, Col, Row, message, BackTop} from 'antd'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import TypingCard from '../../../components/TypingCard'
import { isAuthenticated,isAuthenticatedid } from '../../../utils/Session'
import $ from 'jquery'

const FormItem = Form.Item
const Option = Select.Option

const options = [
  {
    label: '湖北',
    value: 'hubei',
    children: [
      {
        label: '武汉',
        value: 'wuhang',
        children: [
          {
            label: '蔡甸区',
            value: 'caidian'
          },
          {
            label: '江夏',
            value: 'jiangxia'
          }
        ]
      },
      {
        label: '宜昌',
        value: 'yichang',
        children: [
          {
            label: '伍家岗',
            value: 'wujiagang'
          },
          {
            label: '夷陵区',
            value: 'yilingqu'
          },
          {
            label: '江南',
            value: 'jiangnan'
          },
          {
            label: '开发区',
            value: 'kaifaqu'
          },
          {
            label: 'CBD',
            value: 'CBD'
          }
        ]
      }
    ]
  }
]

@Form.create()
class FormDemo1 extends React.Component {
  state = {
    text: '获取验证码',
    disabled: false,
    
  }
  timer = 0
  countdown = (e) => {
    let time = 60
    this.setState({
      text: --time + 's',
      disabled: true
    })
    this.timer = setInterval(() => {
      if (time > 0) {
        this.setState({
          text: --time + 's',
          disabled: true
        })
      } else {
        this.setState({
          text: '获取验证码',
          disabled: false
        })
      }
    }, 1000)
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
          url: "/updateinfo",
          data: {
            name: isAuthenticated(),
            id: isAuthenticatedid(),
            password: values.password,
            password_new: values.password_new,
            email: values.email,
            phonenum: values.phonenum
          },
          success:function(data){
            console.log(data);
            message.info("提交成功")
          }
        });
      }
    });
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
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
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 12,
          offset: 4,
        },
      },
    }
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: 86,
    })(
      <Select style={{width: 70}}>
        <Option value={86}>+86</Option>
        <Option value={87}>+87</Option>
      </Select>
    );
    const cardContent = '该页面用于修改用户的基础信息'
    return (
      <div>
        <CustomBreadcrumb arr={['用户信息', '个人信息修改']}/>
        <TypingCard source={cardContent}/>
        <Card bordered={false} title='基础表单'>
          <Form layout='horizontal' style={{width: '70%', margin: '0 auto'}} onSubmit={this.handleSubmit}>
            <FormItem label='姓名' {...formItemLayout} >
              <Input disabled = {true}  defaultValue = {isAuthenticated()}></Input>
            </FormItem>
            <FormItem label='学工号' {...formItemLayout} >
              <Input disabled = {true}  defaultValue = {isAuthenticatedid()}></Input>
            </FormItem>
            <FormItem label='邮箱' {...formItemLayout}>
              {
                getFieldDecorator('email', {
                  rules: [
                    {
                      type: 'email',
                      message: '请输入正确的邮箱地址'
                    },
                    {
                      required: true,
                      message: '请填写邮箱地址'
                    }
                  ]
                })(
                  <Input/>
                )
              }
            </FormItem>
            <FormItem label='密码' {...formItemLayout}>
              {
                getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: '请输入密码'
                    },
                    {
                      min: 6,
                      message: '密码至少为6个字符'
                    },
                    {
                      max: 16,
                      message: '密码最多为16个字符'
                    },
                    {
                      whitespace: true,
                      message: '密码中不能有空格'
                    }
                  ]
                })(
                  <Input type='password'/>
                )
              }
            </FormItem>
            <FormItem label='新密码' {...formItemLayout}>
              {
                getFieldDecorator('password_new', {
                  rules: [
                    {
                      required: true,
                      message: '请输入密码'
                    },
                    {
                      min: 6,
                      message: '密码至少为6个字符'
                    },
                    {
                      max: 16,
                      message: '密码最多为16个字符'
                    },
                    {
                      whitespace: true,
                      message: '密码中不能有空格'
                    }
                  ]
                })(
                  <Input type='password'/>
                )
              }
            </FormItem>
            <FormItem label='确认新密码' {...formItemLayout} required>
              {
                getFieldDecorator('confirm', {
                  rules: [
                    {
                      validator: (rule, value, callback) => {
                        const {getFieldValue} = this.props.form
                        if (!getFieldValue('password')) {
                          callback('请先输入上面的密码！')
                        }
                        if (value && value !== getFieldValue('password_new')) {
                          callback('两次输入不一致！')
                        }
                        callback()
                      }
                    }
                  ]
                })(
                  <Input type='password'/>
                )
              }
            </FormItem>
            <FormItem label='电话' {...formItemLayout}>
              {
                getFieldDecorator('phonenum', {
                  rules: [
                    {
                      len: 11,
                      pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
                      required: true,
                      message: '请输入正确的11位手机号码'
                    }
                  ]
                })(
                  <Input addonBefore={prefixSelector}/>
                )
              }
            </FormItem>
            <FormItem {...formItemLayout} label="验证码">
              <Row gutter={8}>
                <Col span={12}>
                  {getFieldDecorator('captcha', {
                    rules: [{required: true, message: '请输入验证码！'}],
                  })(
                    <Input/>
                  )}
                </Col>
                <Col span={12}>
                  <Button disabled={this.state.disabled} onClick={(e) => this.countdown(e)}>{this.state.text}</Button>
                </Col>
              </Row>
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              {getFieldDecorator('agreement', {
                valuePropName: 'checked',
              })(
                <Checkbox>我已阅读并同意<a>协议</a></Checkbox>
              )}
            </FormItem>
            <FormItem style={{textAlign: 'center'}} {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit" disabled={!getFieldValue('agreement')}>提交</Button>
            </FormItem>
          </Form>
        </Card>
        <BackTop visibilityHeight={200} style={{right: 50}}/>
      </div>
    )
  }
}

export default FormDemo1