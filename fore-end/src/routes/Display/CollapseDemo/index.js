import React from 'react'
import { Card, Col, Row, Collapse, BackTop, Form, InputNumber, Input, Popconfirm, Button, Table, Select, message } from 'antd'
import axios from 'axios'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import TypingCard from '../../../components/TypingCard'
import Typing from '../../../utils/typing'
import { isAuthenticatedid } from '../../../utils/Session'
import $ from 'jquery'


const Panel = Collapse.Panel;
const { Option } = Select;

var ret = new Array()

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
const text2 = (
  <p style={{ paddingLeft: 24 }}>
    A dog is a type of domesticated animal.
    Known for its loyalty and faithfulness,
    it can be found as a welcome guest in many households across the world.
  </p>
);
const data = [];
const FormItem = Form.Item;
const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `请输入${title}!`,
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}



class CollapseDemo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      is_loading: false,
      dataSource: [],
      id: '',
      data: [
        {
          key: '0',
          sid: '120037910001',
          sname: '张三',
        },
        {
          key: '1',
          sid: '120037910002',
          sname: '李四',
        },
        {
          key: '2',
          sid: '120037910003',
          sname: '王五',
        }
      ],
      lectures: [
        '课程1',
        '课程2',
      ],
      lecture: '',
      studentList: []
    }
    this.loadlist = this.loadlist.bind(this)
  }

  componentWillMount() {
    this.setState({
      is_loading: true
    })
    let uid = isAuthenticatedid()
    console.log(0);
    this.setState({ id: uid }, () => {
      console.log(this.state.id);
      this.loadlist();
    })
  }

  loadlist() {
    var that = this
    $.ajax({
      type: 'POST',
      url: "/viewcourses",
      data: {
        userid: this.state.id,
      },
      success: function (data) {
        message.info("success");
        ret = JSON.parse(data)
        console.log("ret1 ", ret)
        this.setState({
          dataSource: ret,
          is_loading: false
        });
      }.bind(this)
    })
  }

  columns = [
    {
      title: '学号',
      dataIndex: 'sid',
      width: '40%',
      editable: true,
    },
    {
      title: '姓名',
      dataIndex: 'sname',
      width: '20%',
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        const editable = this.isEditing(record);
        return (
          <div>
            {editable ?
              <div>
                <EditableContext.Consumer>
                  {form => (
                    <a

                      onClick={() => this.save(form, record.sid)}
                      style={{ marginRight: 8 }}
                    >
                      保存
                    </a>
                  )}
                </EditableContext.Consumer>
                <Popconfirm
                  title="确定要取消吗？"
                  onConfirm={() => this.cancel(record.sid)}
                >
                  <a>取消</a>
                </Popconfirm>
              </div> :
              <Popconfirm title="确定要删除吗？" onConfirm={() => this.onDelete(record.sid)}>
                <a>删除   </a>
              </Popconfirm>
            }

          </div>
        );
      },
    },
  ]

  handleLectureChange = value => {
    this.setState({ lecture: value });
  }

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    })
  }
  clearFilters = () => {
    this.setState({ filteredInfo: null })
  }
  clearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null,
    })
  }
  setSort = (type) => {
    this.setState({
      sortedInfo: {
        order: 'descend',
        columnKey: type,
      },
    })
  }

  getRemoteData(params) {
    this.setState({
      loading: true
    })
    axios.get('https://randomuser.me/api', {
      params: {
        results: 10,
        size: 200,
        ...params
      }
    }).then(res => {
      const pagination = { ...this.state.pagination };
      pagination.total = 200
      this.setState({
        loading: false,
        data4: res.data.results,
        pagination
      })
    })
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.getRemoteData({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    })
  }

  onDelete = (key) => {
    const arr = this.state.studentList.slice()
    const index = arr.findIndex(item => item.sid === key)
    $.ajax({
      type: 'POST',
      url: "/viewcourses",
      data: {
        cid: this.state.lecture,
        sid: arr[index].sid
      },
      success: function (data) {
        message.info("success");
        this.setState({
          studentList: arr.filter(item => item.sid !== key)
        })
      }.bind(this)
    })
  }

  get_stu_list = () => {
    $.ajax({
      type: 'POST',
      url: "/viewstudents",
      data: {
        cid: this.state.lecture,
        uid: this.state.id,
      },
      success: function (data) {
        message.info("success");
        ret = JSON.parse(data)
        console.log(ret)
        this.setState({
          studentList: ret,
          count :this.state.count + 1,
          
        })
      }.bind(this)
    })
  }

  handleAdd = () => {
    const { studentList, count } = this.state //本来想用data7的length来代替count，但是删除行后，length会-1
    const newData = {
      sid: '',
      sname: '',
    };
    this.setState({
      studentList: [...studentList, newData],
      count: count + 1,
      editingKey : ''
    })
  }
  isEditing = (record) => {
    return record.sid === this.state.editingKey;
  };

  edit(key) {
    this.setState({ editingKey: key });
  }

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.studentList];
      const index = newData.findIndex(item => key === item.sid);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        $.ajax({
          type: 'POST',
          url: "/addstudents",
          data: {
            cid: this.state.lecture,
            sid: row.sid,
            sname: row.sname,
            uid: this.state.id
          },
          success: function (data) {
            message.info('success')
            this.setState({ studentList: newData, editingKey: '' });
          }.bind(this)
        })
      } else {
        newData.push(data);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }

  cancel = (key) => {
    const arr = this.state.studentList.slice()
    this.setState({
      studentList: arr.filter(item => item.sid !== key),
      editingKey: ''
    })
  };

  render() {
    /*
    const cardContent = ` <ul class="card-ul">
            <li>对复杂区域进行分组和隐藏，保持页面的整洁</li>
            <li>手风琴 是一种特殊的折叠面板，只允许单个内容区域展开</li>
          </ul>`
          */
    const cardContent = `<ul class="card-ul">
            <li>本页面用于对学生名单进行增加和删除</li>
          </ul>`
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const lectures = this.state.lectures
    const dataSource = this.state.dataSource
    const is_loading = this.state.is_loading
    const handleLectureChange = this.handleLectureChange

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    if (!is_loading) {
      return (
        <div>
          <CustomBreadcrumb arr={['课程功能', '学生管理']} />
          <TypingCard source={cardContent} height={178} />
          <Card bordered={false} title='学生列表' style={{ marginBottom: 10, minHeight: 440 }} id='studentList'>
            <p>
              <p>选择课程</p>
              <Select defaultValue={dataSource[0].cname} style={{ width: 240 }} onChange={handleLectureChange}>
                {dataSource.map(lecture => (
                  <Option key={lecture.cid}>{lecture.cname}</Option>
                ))}
              </Select>
              <Button onClick={this.get_stu_list}>确认</Button>
            </p>
            <p>
              <Button onClick={this.handleAdd}>添加学生</Button>
            </p>
            {/* <Table bordered dataSource={this.state.data7} columns={this.columns7} style={styles.tableStyle}/> */}
            <Table style={styles.tableStyle} components={components} dataSource={this.state.studentList}
              columns={columns} />
          </Card>
        </div>
        /*
        <div>
          <CustomBreadcrumb arr={['显示','折叠面板']}/>
          <TypingCard source={cardContent} height={178}/>
          <Row gutter={16}>
            <Col span={12}>
              <Card bordered={false} className='card-item' title='基本用法'>
                <Collapse defaultActiveKey={['1']}>
                  <Panel header="This is panel header 1" key="1"><p>{text}</p></Panel>
                  <Panel header="This is panel header 2" key="2"><p>{text}</p></Panel>
                  <Panel header="This is panel header 3" key="3"><p>{text}</p></Panel>
                </Collapse>
              </Card>
              <Card bordered={false} className='card-item' title='简洁风格-无边框'>
                <Collapse defaultActiveKey={['1']} bordered={false}>
                  <Panel header="This is panel header 1" key="1">{text2}</Panel>
                  <Panel header="This is panel header 2" key="2">{text2}</Panel>
                  <Panel header="This is panel header 3" key="3">{text2}</Panel>
                </Collapse>
              </Card>
            </Col>
            <Col span={12}>
              <Card bordered={false} className='card-item' title='手风琴-每次只打开一个tab'>
                <Collapse defaultActiveKey={['2']} accordion>
                  <Panel header="This is panel header 1" key="1"><p>{text}</p></Panel>
                  <Panel header="This is panel header 2" key="2"><p>{text}</p></Panel>
                  <Panel header="This is panel header 3" key="3"><p>{text}</p></Panel>
                </Collapse>
              </Card>
              <Card bordered={false} className='card-item' title='自定义面板'>
                <Collapse defaultActiveKey={['1']} bordered={false}>
                  <Panel header="This is panel header 1" key="1" style={styles.customPanelStyle}><p>{text}</p></Panel>
                  <Panel header="This is panel header 2" key="2" style={styles.customPanelStyle}><p>{text}</p></Panel>
                  <Panel header="This is panel header 3" key="3" style={styles.customPanelStyle}><p>{text}</p></Panel>
                </Collapse>
              </Card>
            </Col>
          </Row>
          <BackTop visibilityHeight={200} style={{right: 50}}/>
        </div>
        */
      )
    }
    else {
      return (<div></div>)
    }
  }
}

const styles = {
  tableStyle: {
    width: '80%'
  },
  colItem: {
    minHeight: 500,
    borderRadius: 3,
    margin: '10px 0'
  },
  customPanelStyle: {
    background: '#f7f7f7',
    borderRadius: 4,
    marginBottom: 24,
    border: 0,
    overflow: 'hidden'
  }
}

export default CollapseDemo