import React from 'react'
import { Card, Col, Row, Collapse, BackTop, Form, InputNumber, Input, Popconfirm, Button, Table, Select} from 'antd'
import axios from 'axios'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import TypingCard from '../../../components/TypingCard'
import Typing from '../../../utils/typing'
import { isAuthenticatedid } from '../../../utils/Session'
import $ from 'jquery'

const Panel = Collapse.Panel;
const {Option} = Select;

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
const data =[];
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
  state = {
    data: [
      {
        key: '0',
        s_id: '120037910001',
        s_name: '张三',
      },
      {
        key: '1',
        s_id: '120037910002',
        s_name: '李四',
      },
      {
        key: '2',
        s_id: '120037910003',
        s_name: '王五',
      }
    ],
    data_student:[],
    lectures: [{
        key: 1,
        c_name :  '课程1'
      }, {
        key: 2,
        c_name :  '课程2'
      }, 
    ],
    lecture: '课程1',
    data_course: []
  }

  columns = [
    {
      title: '学号',
      dataIndex: 's_id',
      width: '40%',
      editable: true,
    },
    {
      title: '姓名',
      dataIndex: 's_name',
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

                      onClick={() => this.save(form, record.key)}
                      style={{ marginRight: 8 }}
                    >
                      保存
                    </a>
                  )}
                </EditableContext.Consumer>
                <Popconfirm
                  title="确定要取消吗？"
                  onConfirm={() => this.cancel(record.key)}
                >
                  <a>取消</a>
                </Popconfirm>
              </div> :
              <Popconfirm title="确定要删除吗？" onConfirm={() => this.onDelete(record.key)}>
                <a>删除   </a>
              </Popconfirm>
            }
            
          </div>
        );
      },
    },
  ]

  componentWillMount() {
    $.ajax({
      type: 'GET',
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
          this.setState({data_course : course})
        }
      }
    })
  }

  handleLectureChange = value => {
    this.setState({lecture: value});
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
  onDelete = (key_val) => {
    const arr = this.state.data_course.slice()
    const item = arr.find(item => item.key === key_val )
    $.ajax({
      type: 'POST',
      url: "/UserLog",
      data: {
          userid: isAuthenticatedid(),
          stu_id : item.s_id,
      },
      success: function (ret) {
        console.log(ret)
        if (ret === 'success'){
          this.setState({
            data_course: arr.filter(item => item.key !== key_val)
          })
        }
      }
    })
  }

  handleAdd = () => {
    const { data,data_student, count } = this.state //本来想用data7的length来代替count，但是删除行后，length会-1
    const newData = {
      key: count,
      s_id : '0',
      s_name: '0',
    };
    this.setState({
      data: [...data_student, newData],
      count: count + 1
    })
  }
  isEditing = (record) => {
    return record.key === this.state.editingKey;
  };

  edit(key) {
    this.setState({ editingKey: key });
  }

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data_student];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        $.ajax({
          type: 'POST',
          url: "/UserLog",
          data: {
              userid: isAuthenticatedid(),
              s_id: item.s_id,
              s_name:item.s_name
          },
          success: function (ret) {
            console.log(ret)
            if (ret != 'error'){
              this.setState({data_student: newData, editingKey: ''});
            }
          }
        })
      } else {
        newData.push(data);
        this.setState({ data_student: newData, editingKey: '' });
      }
    });
  }

  cancel = () => {
    this.setState({ editingKey: '' });
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

    return (
      <div>
        <CustomBreadcrumb arr={['课程', '学生管理']} />
        <TypingCard source={cardContent} height={178} />
        <Card bordered={false} title='学生列表' style={{ marginBottom: 10, minHeight: 440 }} id='studentList'>
          <p>
          <p>选择课程</p>
          <Select defaultValue={lectures[0]} style={{ width: 240 }} onChange={handleLectureChange}>
            {lectures.map(lecture => (
              <Option key={lecture}>{lecture}</Option>
            ))}
          </Select>
          </p>
          <p>
            <Button>确认</Button>
          </p>
          <p>
            <Button onClick={this.handleAdd}>添加学生</Button>
          </p>
          {/* <Table bordered dataSource={this.state.data7} columns={this.columns7} style={styles.tableStyle}/> */}
          <Table style={styles.tableStyle} components={components} bordered dataSource={this.state.data}
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
