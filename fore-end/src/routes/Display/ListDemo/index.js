import React from 'react'
import { Card, Spin, Button, Form, Input, Radio, List, Switch, Avatar, BackTop, Anchor, Affix, Icon, Table, Row, Col, Upload, message, Select } from 'antd'
import axios from 'axios'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import TypingCard from '../../../components/TypingCard'
import Operation from 'antd/lib/transfer/operation'
import { values } from 'mobx'
import { isAuthenticatedid, isAuthenticated, isAuthenticatedtype } from '../../../utils/Session'
import $ from 'jquery'

/*
const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];
const data3 = []
for(let i=0;i<23;i++){
  data3.push({
    title: `ant design part ${i}`,
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    description: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    content: 'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
  })
}
const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);
*/

var ret = new Array()
const { Option } = Select;
const props = {
  name: 'file',
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

@Form.create()
class ListDemo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      size: 'default',
      bordered: true,
      id:'',
      data2: [],
      is_loading: false,
      repo: {},
      loadingMore: false,
      dl_url:'',
      experiments: [
        // '实验1',
        // '实验2',
        // '实验3',
      ],
      students: [
        // '张三',
        // '李四',
        // '王五',
      ],
      experimentName: '实验1',
      chosenExperiment: '',
      chosenStudent: '',
      studentName: '张三',
      studentId: '120037910001',
      experimentGoal: `实验目的
    实验目的1
    实验目的2`,
      experimentGeneratedReport:
        `后端生成的报告
内容1
内容2
`,
      experimentRatingReport:
        `后端生成的得分点和成绩
内容1
内容2
`,
      u_type: '',
      student_comment: `学生的评价。`,
      teacher_comment: `教师的评价。`,
      teacher_autograph: ``,
    }
    this.loadlist = this.loadlist.bind(this)
  }

  componentWillMount() {
    this.setState({
      is_loading: true
    })
    let uid = isAuthenticatedid()
    console.log("coanima")
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
    if (isAuthenticatedtype() === 'S') {
      $.ajax({
        type: 'POST',
        url: "/get_report_list",
        data: {
          sid: this.state.id,
        },
        success: function (data) {
          message.info("success");
          ret = JSON.parse(data)
          console.log("ret_post ", ret)
          this.setState({
            experiments: ret.report_list,
            chosenStudent: this.state.id,
            is_loading: false
          });
        }.bind(this)
      })
    }
    else {
      $.ajax({
        type: 'POST',
        url: "/getalllist",
        data: {
          uid: this.state.id,
        },
        success: function (data) {
          message.info("success");
          ret = JSON.parse(data)
          console.log("ret_post ", ret)
          this.setState({
            experiments: ret[0],
            students: ret[1],
            is_loading: false
          });
        }.bind(this)
      })
    }
  }

  componentDidMount() {
    this.setState({
      loading: true,
    })
    this.getData2();
    this.setState({
      loading: false
    })
  }

  getData2 = () => {
    this.setState({
      loadingMore: true
    })
    axios.get('https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo').then(res => {
      this.setState({
        data2: this.state.data2.concat(res.data.results),
        loadingMore: false
      })
    })
  }

  onChangeExperimentTeacher = value => {
    // request all student in this experiment
    this.setState({
      chosenExperiment: value,
      // students: [
        // '张三',
        // '李四',
        // '王五',
      // ],
      chosenStudent: this.state.students[0].id, // need request
    })
    // $.ajax({
    //   type: 'POST',
    //   url: "/getalllist",
    //   data: {
    //     labid: value,
    //   },
    //   success: function (data) {
    //     message.info("success");
    //     ret = JSON.parse(data)
    //     console.log("ret_post22 ", ret)
    //     this.setState({
    //       students: ret,
    //       chosenExperiment: value
    //     });
    //   }.bind(this)
    // })
  }

  onChangeExperimentStudent = value => {
    // request all report data
    $.ajax({
      type: 'POST',
      url: "/read_report",
      data: {
        labid: value,
        uid: this.state.id
      },
      success: function (data) {
        message.info("success");
        ret = JSON.parse(data)
        console.log("ret_post11 ", ret)
        this.setState({
          repo: ret[0],
          chosenExperiment: value 
        });
      }.bind(this)
    })
  }

  onChangeStudent = value => {
    // request all report data
    $.ajax({
      type: 'POST',
      url: "/read_report",
      data: {
        uid: value,
        labid: this.state.chosenExperiment
      },
      success: function (data) {
        message.info("success");
        ret = JSON.parse(data)
        console.log("ret_post11 ", ret)
        this.setState({
          repo: ret[0],
          chosenStudent: value
        });
      }.bind(this)
    })
  }

  download = () => {
    window.open(this.state.dl_url);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(e)
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        message.warning('请先填写正确的表单')
      }
      else {
        var s_comment
        var t_comment
        if (isAuthenticatedtype() === "T") {
          s_comment = this.state.repo.stu_comment
          t_comment = values.teacher_comment
        }
        else {
          s_comment = values.student_comment
          t_comment = this.state.repo.teacher_comment
        }
        $.ajax({
          type: 'POST',
          url: "/add_comment",
          data: {
            labid: this.state.chosenExperiment,
            uid: this.state.chosenStudent,
            stucomment: s_comment,
            teacomment: t_comment 
          },
          success: function (data) {
            console.log(data);
            message.info("提交成功")
          }
        });
      }
    });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { size, bordered, is_loading,repo, data2, loadingMore, experiments, students, chosenExperiment, chosenStudent } = this.state
    // const loadMore = (
    //   <div style={styles.loadMore}>
    //     <Spin style={loadingMore ? {} : { display: 'none' }} />
    //     <Button style={!loadingMore ? {} : { display: 'none' }} onClick={() => this.getData2()}>加载更多</Button>
    //   </div>
    // )
    if (!is_loading) {
      return (
        <div>
          <CustomBreadcrumb arr={['实验功能', '实验报告']} />
          <Card bordered={false} title='实验报告' style={{ marginBottom: 10 }} id='report'>
            <p>
              {
                isAuthenticatedtype() === 'T' ? <div>
                  <Select showSearch style={{ width: 200 }} placeholder='选择实验' onChange={this.onChangeExperimentTeacher}>
                    {
                      experiments.map(experiment => (
                        <Option key={experiment.id}>
                          {experiment.labname}
                        </Option>
                      ))
                    }
                  </Select>
                  <Select showSearch style={{ width: 220, marginLeft: 20 }} placeholder='选择学生' onChange={this.onChangeStudent}>
                    {
                      students.map(student => (
                        <Option key={student.id}>
                          {student.name}
                        </Option>
                      ))
                    }
                  </Select>
                </div> : <div>
                    <Select showSearch style={{ width: 200 }} placeholder='选择实验' onChange={this.onChangeExperimentStudent}>
                      {
                        experiments.map(experiment => (
                          <Option key={experiment.id}>
                            {experiment.labname}
                          </Option>
                        ))
                      }
                    </Select>
                  </div>
              }
            </p>
            { this.state.chosenExperiment != '' ?
            <a href="javascript:void(0)" onclick={this.download}></a>
            /*<Form onSubmit={this.handleSubmit}>
              <Card showHeader={false}>
                <Card.Grid style={{ width: '15%', textAlign: 'left', fontSize: 24 }} hoverable={false}>实验名称</Card.Grid>
                <Card.Grid style={{ width: '85%', textAlign: 'left', fontSize: 24 }} hoverable={false}>{repo.labname}</Card.Grid>
                <Card.Grid style={{ width: '15%', textAlign: 'left', fontSize: 24 }} hoverable={false}>姓名</Card.Grid>
                <Card.Grid style={{ width: '35%', textAlign: 'left', fontSize: 24 }} hoverable={false}>{repo.uname}</Card.Grid>
                <Card.Grid style={{ width: '15%', textAlign: 'left', fontSize: 24 }} hoverable={false}>学号</Card.Grid>
                <Card.Grid style={{ width: '35%', textAlign: 'left', fontSize: 24 }} hoverable={false}>{repo.uid}</Card.Grid>
                <Card.Grid style={{ width: '100%', textAlign: 'left', fontSize: 24 }} hoverable={false}>一、实验目的</Card.Grid>
                <Card.Grid style={{ width: '100%', textAlign: 'left', fontSize: 24, whiteSpace: 'pre-wrap' }} hoverable={false}>{repo.labaim}</Card.Grid>
                <Card.Grid style={{ width: '100%', textAlign: 'left', fontSize: 24 }} hoverable={false}>二、自定义学生实验报告（根据实验和学科内容自拟实验报告格式，建议包括实验关键过程与参数、实验结果、分析与思考等。包括文字性描述、实验截图、表格等信息）</Card.Grid>

                <Card.Grid style={{ width: '100%', textAlign: 'left', fontSize: 24, whiteSpace: 'pre-wrap' }} hoverable={false}>
                  评分:{repo.score_repo}
                </Card.Grid>
                
                {
                  isAuthenticatedtype() === 'S' ?
                    <div>
                      <Card.Grid style={{ width: '100%', textAlign: 'left', fontSize: 24, whiteSpace: 'pre-wrap' }} hoverable={false}>
                        分析与思考：
                      <Form.Item >
                          {
                            getFieldDecorator('student_comment', {
                              rules: [
                                {
                                  required: true,
                                  message: '请填写学生评价'
                                }
                              ]
                            })(
                              <Input defaultValue={ repo.stu_comment}/>
                            )
                          }
                      </Form.Item>
                      </Card.Grid>
                      <Card.Grid style={{ width: '100%', textAlign: 'left', fontSize: 24, whiteSpace: 'pre-wrap' }} hoverable={false}>
                        附件：
                        <Form.Item label='student_upload'>
                          <Upload {...props}>
                            <Button>Click to Upload</Button>
                          </Upload>
                        </Form.Item>
                      </Card.Grid>
                    </div> : <div>

                      <Card.Grid style={{ width: '100%', textAlign: 'left', fontSize: 24, whiteSpace: 'pre-wrap' }} hoverable={false}>
                        分析与思考：
                      <br />
                        {repo.stu_comment}
                      </Card.Grid>
                      <Card.Grid style={{ width: '100%', textAlign: 'left', fontSize: 24, whiteSpace: 'pre-wrap' }} hoverable={false}>
                        附件：
                      <Button>Click to Download</Button>
                      </Card.Grid>
                    </div>
                }
                <Card.Grid style={{ width: '100%', textAlign: 'left', fontSize: 24 }} hoverable={false}>三、自定义实验评价报告（根据实验和学科内容自拟实验评价格式，包括实验得分项细节、总成绩、评语，以及可考虑采用评价教师电子签名）</Card.Grid>
                <Card.Grid style={{ width: '100%', textAlign: 'left', fontSize: 24, whiteSpace: 'pre-wrap' }} hoverable={false}>
                  评分:{repo.score_repo}
                </Card.Grid>
                {
                  isAuthenticatedtype() === 'T' ?
                    <div>
                      <Card.Grid style={{ width: '100%', textAlign: 'left', fontSize: 24, whiteSpace: 'pre-wrap' }} hoverable={false}>
                        教师评语：
                         <Form.Item >
                          {
                            getFieldDecorator('teacher_comment', {
                              rules: [  
                                {
                                  required: true,
                                  message: '请填写老师评价'
                                }
                              ]
                            })(
                              <Input defaultValue={ repo.teacher_comment} />
                            )
                          }
                        </Form.Item>
                      </Card.Grid>
                      <Card.Grid style={{ width: '100%', textAlign: 'left', fontSize: 24, whiteSpace: 'pre-wrap' }} hoverable={false}>
                        电子签名：
                         <Form.Item name='teacher_upload'>
                    <Upload {...props}>
                          <Button>Click to Upload</Button>
                          </Upload>
                          </Form.Item>
                      </Card.Grid>
                    </div> : <div>
                      <Card.Grid style={{ width: '100%', textAlign: 'left', fontSize: 24, whiteSpace: 'pre-wrap' }} hoverable={false}>
                        教师评语：
                    <br />
                        {repo.teacher_comment}
                      </Card.Grid>
                      <Card.Grid style={{ width: '100%', textAlign: 'left', fontSize: 24, whiteSpace: 'pre-wrap' }} hoverable={false}>
                        电子签名：
                      </Card.Grid>
                    </div>
                }
                <Button htmlType = 'submit'>提交</Button><Button>生成PDF</Button>
              </Card>
              </Form>*/ :<div></div>}
          
          </Card>
        </div>
        /*
        <div>
          <CustomBreadcrumb arr={['显示', '列表']}/>
          <TypingCard id='howUse' source='最基础的列表展示，可承载文字、列表、图片、段落，常用于后台数据展示页面。'/>
          <Card bordered={false} title='基本用法' style={{marginBottom: 10}} id='basicUsage'>
            <Radio.Group value={size}
                         onChange={e => this.setState({size: e.target.value})}
                         style={{marginBottom: '1em'}}>
              <Radio.Button value='large'>Large</Radio.Button>
              <Radio.Button value='default'>Default</Radio.Button>
              <Radio.Button value='small'>Small</Radio.Button>
            </Radio.Group>&emsp;&emsp;&emsp;
            是否有边框&emsp;<Switch defaultChecked
                               onChange={checked => this.setState({bordered: checked})}/>
            <List dataSource={data}
                  bordered={bordered}
                  size={size}
                  style={bordered ? styles.haveBorder : styles.noBorder}
                  renderItem={item => (<List.Item>{item}</List.Item>)}/>
          </Card>
          <Card bordered={false} title='加载更多' style={{marginBottom: 10}} id='remoteLoading'>
            <List loading={loading}
                  dataSource={data2}
                  loadMore={loadMore}
                  style={styles.listStyle}
                  renderItem={item => (
                    <List.Item actions={[<a>edit</a>, <a>more</a>]}>
                      <List.Item.Meta
                        avatar={<Avatar
                          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}
                        title={<a>{item.name.last}</a>}
                        description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                      />
                    </List.Item>
                  )}
            />
          </Card>
          <Card bordered={false} title='竖排列表样式' style={{marginBottom: 15}} id='verticalStyle'>
            <List dataSource={data3}
                  itemLayout='vertical'
                  pagination={{pageSize: 3}}
                  style={styles.listStyle}
                  renderItem={item=>{
                    return (
                      <List.Item
                        actions={[<IconText type="star-o" text="156" />, <IconText type="like-o" text="156" />, <IconText type="message" text="2" />]}
                        extra={<img width={272} alt="logo" src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" />}>
                        <List.Item.Meta
                          avatar={<Avatar src={item.avatar} />}
                          title={<a>{item.title}</a>}
                          description={item.description}
                        />
                        {item.content}
                        </List.Item>
                    )
                  }}
            />
          </Card>
  
          <BackTop visibilityHeight={200} style={{right: 50}}/>
          <Affix style={styles.affixBox}>
            <Anchor offsetTop={50} affix={false}>
              <Anchor.Link href='#howUse' title='何时使用'/>
              <Anchor.Link href='#basicUsage' title='基本用法'/>
              <Anchor.Link href='#remoteLoading' title='加载更多'/>
              <Anchor.Link href='#verticalStyle' title='竖排列表样式'/>
            </Anchor>
          </Affix>
        </div>
        */
      )
    }
    else {
      return (
        <div></div>
      )
    }
  }
}

const styles = {
  haveBorder: {
    minHeight: 270,
    width: '80%',
    boxSizing: 'border-box'
  },
  noBorder: {
    minHeight: 270,
    width: '80%',
    padding: '0 24px',
    boxSizing: 'border-box',
    border: '1px solid #fff'
  },
  loadMore: {
    height: 32,
    marginTop: 16,
    lineHeight: '32px',
    textAlign: 'center',
  },
  listStyle: {
    width: '80%'
  },
  affixBox: {
    position: 'absolute',
    top: 100,
    right: 50,
    with: 170
  }
}

export default ListDemo