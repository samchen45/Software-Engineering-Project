import React from 'react'
import { Button, Card, Input, Form, Select, Rate } from 'antd'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import TypingCard from '../../../components/TypingCard'

const { Option } = Select;
const { TextArea } = Input;

class TabsDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      experiments: [
        '实验1',
        '实验2',
        '实验3',
      ],
      chosenExperiment: '',
    }
  }

  onChangeExperiment = e => {
    this.setState({
      chosenExperiment: e,
    })
  }

  render() {
    const { experiments, chosenExperiment } = this.state;
    return (
      <div>
        <CustomBreadcrumb arr={['实验功能','实验评价']}/>
        <Card bordered={false} title='实验评价' style={{marginBottom: 10, minHeight: 400}} id='filterOrSort'>
          <p>
            <Select showSearch style={{ width: 200 }} placeholder='选择实验' onChange={this.onChangeExperiment}>
              {
                experiments.map(experiment => (
                  <Option key={experiment}>
                    {experiment}
                  </Option>
                ))
              }
            </Select>
          </p>
          <Form style={{ marginTop: 40 }}>
            <Form.Item name="suggestion"
              rules={[
                {
                  required: true,
                  message: '请输入对该实验的评价！',
                },
              ]}>
              <TextArea
                type='suggestion'
                placeholder='请输入你对该实验的评价。' />
            </Form.Item>
            <Form.Item name='rating'
              rules={[
                {
                  required: true,
                  message: '请为该实验打分！',
                }
              ]}>
              <Rate style={{ height: 0 }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="submit-form-button">
                提交
            </Button></Form.Item>
          </Form>
        </Card>
      </div>
    )
  }
}

export default TabsDemo