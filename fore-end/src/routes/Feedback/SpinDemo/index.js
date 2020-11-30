import React, { useState } from 'react'
import { Card, Col, Row, Spin, Icon, Alert, Switch, Select, Button, Table, Input, Divider } from 'antd'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import TypingCard from '../../../components/TypingCard'
import { isAuthenticatedid } from '../../../utils/Session'
import $ from 'jquery'

const { Option } = Select;


const LectureId = ['课程1', '课程2'];
const HomeworkId = {
  课程1: ['课程1作业1', '课程1作业2', '课程1作业3'],
  课程2: ['课程2作业1', '课程2作业2', '课程2作业3', '课程2作业4'],
};

class SpinDemo extends React.Component {
  state = {
    //loading: false,
    //loading2: false
    lecture: HomeworkId[LectureId[0]],
    homework: HomeworkId[LectureId[0]][0],
    data_course:[],
    data_homework:[],
    student:[],
    submissions: [
      {id: '1', name: '张三'},
      {id: '2', name: '李四'},
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
      dataIndex: 'u_name',
      width: '15%',
    },
    {
      title: '查看作业',
      dataIndex: 'hmk',
      width: '30%',
      render: (text, record) => {
        return <a href='#'>作业链接</a>
      }
    },
    {
      title: '提交状态',
      dataIndex: 'status',
      width: '10%',
      
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

  //
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
              c_name: data.c_name,
              homework: data.homework
            }
          })
          this.setState({
            data_course : course,
            data_homework : course[0].homework
          })
        }
      }
    })
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

  getStudent = () =>{
    $.ajax({
      type: 'POST',
      url: "/UserLog",
      data: {
          userid: isAuthenticatedid(),
          h_id: this.state.homework
      },
      success: function (ret) {
        console.log(ret)
        if (ret === 'success'){
          const stu = ret.map(data => {
            return{
              id: data.u_id,
              u_name: data.u_name,
              hmk: data.url,
              status: data.status
            }
          })
          this.setState({
            student: stu
          })
        }
      }
    })
  }

  render() {
    //const loading2 = this.state.loading2
    const lecture = this.state.lecture
    const homework = this.state.homework
    const data_course = this.state.data_course
    const data_homework = this.state.data_homework

    const setLectures = value => {
      this.setState({ lecture: value })
    }
    const setHomework = value => {
      this.setState({ homework: value })
      //更新作业列表
    }

    const handleLectureChange = value => {
      setLectures(value);
      const id = this.state.data_course.findIndex(item=>item.c_id === value)
      setHomework(this.state.data_course[id].homework[0].h_id);
    };

    const onHomeworkChange = value => {
      setHomework(value);
    };

    return (
      <div>
        <CustomBreadcrumb arr={['作业', '批改作业']} />
        <TypingCard source='该页面用于教师批改作业。' />
        <Card bordered={false}>
          <p>选择课程与作业</p>
          <Select defaultValue={data_course[0].c_id} style={{ width: 240 }} onChange={handleLectureChange}>
            {data_course.map(course => (
              <Option key={course.c_id}>{course.c_name}</Option>
            ))}
          </Select>
          
          <Select style={{ width: 480, margin: 20 }} value={data_homework[0].h_id} onChange={onHomeworkChange}>
            {data_homework.map(hmk => (
              <Option key={hmk.h_id}>{hmk.h_name}</Option>
            ))}
          </Select>
          <p>
            <Button onClick= {this.getStudent}>确认</Button>
          </p>
          <Divider/>
          
          <p>批改作业</p>
          <Table style={styles.tableStyle} bordered dataSource={this.state.submissions}
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