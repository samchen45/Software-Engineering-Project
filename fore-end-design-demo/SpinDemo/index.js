import React, { useState } from 'react'
import { Card, Col, Row, Spin, Icon, Alert, Switch, Select, Button, Table, Input, Divider } from 'antd'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import TypingCard from '../../../components/TypingCard'

const { Option } = Select;

const LecturesRemote = ['课程1', '课程2'];
const HomeworksForEachLectureRemote = {
  '课程1': ['课程1作业1', '课程1作业2', '课程1作业3'],
  '课程2': ['课程2作业1', '课程2作业2', '课程2作业3', '课程2作业4'],
};
// 更新这两个当载入页面时从远程服务器

class SpinDemo extends React.Component {
  state = {
    //loading: false,
    //loading2: false
    lecture: HomeworksForEachLectureRemote[LecturesRemote[0]],
    homework: HomeworksForEachLectureRemote[LecturesRemote[0]][0],
    submissions: [
      {id: '1', name: '张三'},
      {id: '2', name: '李四', file:'https://www.baidu.com'},
    ]
  }

  columns7 = [
    {
      title: '学号',
      dataIndex: 'id',
      width: '20%',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: '15%',
    },
    {
      title: '查看作业',
      dataIndex: 'file',
      width: '30%',
      render: (text, record) => {
        return <a href={record.file}>作业链接</a>
      }
    },
    {
      title: '评分',
      dataIndex: 'score',
      render: (text, record) => {
        return (
          <div>
            <Input></Input>
          </div>
        )
      }
    },
    {
      title: '操作',
      width: '10%',
      render: ()=>{
        return <Button>确认</Button>
      }
    }
  ]

  componentWillMount() {
    //页面路由加载的进度条，React有没有方法可以使路由加载自动调用这个方法，避免在每个页面都设置
    //vue有方法可以实现https://segmentfault.com/q/1010000006653683/a-1020000007724198
    NProgress.start()
  }
  componentDidMount() {
    NProgress.done()
  }
  componentWillUnmount() {
    //这里是防止下面调用NProgress.start()方法后离开组件后还未关闭
    NProgress.done()
  }
  NProgressStart = () => {
    NProgress.start()
    this.setState({
      loading2: true
    })
  }
  NProgressDone = () => {
    NProgress.done()
    this.setState({
      loading2: false
    })
  }

  render() {
    //const loading2 = this.state.loading2
    const lecture = this.state.lecture
    const homework = this.state.homework

    const setLectures = value => {
      this.setState({ lecture: value })
    }
    const setHomework = value => {
      this.setState({ homework: value })
      //更新作业列表
    }

    const handleLectureChange = value => {
      setLectures(HomeworksForEachLectureRemote[value]);
      setHomework(HomeworksForEachLectureRemote[value][0]);
    };

    const onHomeworkChange = value => {
      setHomework(value);
    };

    return (
      <div>
        <CustomBreadcrumb arr={['作业功能', '批改作业']} />
        <TypingCard source='该页面用于教师批改作业。' />
        <Card bordered={false} title='批改作业'>
          <p>选择课程与作业</p>
          <Select defaultValue={LecturesRemote[0]} style={{ width: 240 }} onChange={handleLectureChange}>
            {LecturesRemote.map(lecture => (
              <Option key={lecture}>{lecture}</Option>
            ))}
          </Select>
          <Select style={{ width: 480, margin: 20 }} value={homework} onChange={onHomeworkChange}>
            {lecture.map(homework => (
              <Option key={homework}>{homework}</Option>
            ))}
          </Select>
          <Button>确认</Button>
          <Divider/>
          <p>批改作业</p>
          <Table style={styles.tableStyle} dataSource={this.state.submissions}
            columns={this.columns7} />
        </Card>
      </div>
      /*
      <Row gutter={16}>
        <Col span={12}>
          <Card bordered={false} className='card-item'>
            <Spin/>&emsp;
            <Spin indicator={<Icon type='loading'/>}/>
          </Card>
          <Card bordered={false} className='card-item'>
            <Spin tip="Loading...">
              <Alert
                message="Alert message title"
                description="Further details about the context of this alert."
                type="info"
              />
            </Spin>
          </Card>
          <Card bordered={false} className='card-item'>
            <Button onClick={this.NProgressStart} loading={loading2}>页面顶部进度条加载</Button>&emsp;
            <Button onClick={this.NProgressDone}>顶部进度条加载完成</Button>
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered={false} className='card-item'>
            <Spin size='small'/>&emsp;
            <Spin/>&emsp;
            <Spin size='large'/>
          </Card>
          <Card bordered={false} className='card-item'>
            <div style={{marginBottom: '1em'}}>
              <Spin tip="Loading..." spinning={this.state.loading}>
                <Alert
                  message="Alert message title"
                  description="Further details about the context of this alert."
                  type="info"
                />
              </Spin>
            </div>
            Loading state：<Switch onChange={(checked) => this.setState({loading: checked})}/>
          </Card>
        </Col>
      </Row>
      */

    )
  }
}

const styles = {
  tableStyle: {
    width: '80%'
  },
  affixBox: {
    position: 'absolute',
    top: 100,
    right: 50,
    with: 170
  }
}

export default SpinDemo