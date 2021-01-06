import React from 'react'
import { message, Card, Popconfirm, Button, Icon, Table, Divider, BackTop, Affix, Anchor, Form, InputNumber, Input } from 'antd'
import axios from 'axios'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import TypingCard from '../../../components/TypingCard'
import { isAuthenticatedid, isAuthenticatedtype } from '../../../utils/Session'
import $ from 'jquery'

var ret = new Array()
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
  }, {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  }, {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  }, {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <span>
        <a>Action 一 {record.name}</a>
        <Divider type="vertical" />
        <a>Delete</a>
        <Divider type="vertical" />
        <a className="ant-dropdown-link">
          More actions <Icon type="down" />
        </a>
      </span>
    ),
  }]

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  }, {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  }, {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  }]

const columns2 = [
  {
    title: 'Name',
    dataIndex: 'name',
  }, {
    title: 'Age',
    dataIndex: 'age',
  }, {
    title: 'Address',
    dataIndex: 'address',
  }]

const data2 = []
for (let i = 0; i < 46; i++) {
  data2.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
  })
}

const data3 = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  }, {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  }, {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  }, {
    key: '4',
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park',
  }]

const columns4 = [
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: true,
    render: name => `${name.first} ${name.last}`,
    width: '20%',
  }, {
    title: 'Gender',
    dataIndex: 'gender',
    filters: [
      { text: 'Male', value: 'male' },
      { text: 'Female', value: 'female' },
    ],
    width: '20%',
  }, {
    title: 'Email',
    dataIndex: 'email',
  }]

const columns5 = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
  { title: 'Action', dataIndex: '', key: 'x', render: () => <a>Delete</a> },
];

const data5 = [
  {
    key: 1,
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
  },
  {
    key: 2,
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.'
  },
  {
    key: 3,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.'
  },
];

const columns6 = [
  { title: 'Full Name', width: 100, dataIndex: 'name', key: 'name', fixed: 'left' },
  { title: 'Age', width: 100, dataIndex: 'age', key: 'age', fixed: 'left' },
  { title: 'Column 1', dataIndex: 'address', key: '1', width: 150 },
  { title: 'Column 2', dataIndex: 'address', key: '2', width: 150 },
  { title: 'Column 3', dataIndex: 'address', key: '3', width: 150 },
  { title: 'Column 4', dataIndex: 'address', key: '4', width: 150 },
  { title: 'Column 5', dataIndex: 'address', key: '5', width: 150 },
  { title: 'Column 6', dataIndex: 'address', key: '6', width: 150 },
  { title: 'Column 7', dataIndex: 'address', key: '7', width: 150 },
  { title: 'Column 8', dataIndex: 'address', key: '8' },
  {
    title: 'Action',
    key: 'operation',
    fixed: 'right',
    width: 100,
    render: () => <a>action</a>,
  },
];
const data6 = [];
for (let i = 0; i < 100; i++) {
  data6.push({
    key: i,
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}
const data8 = [];
for (let i = 0; i < 100; i++) {
  data8.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}
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

class TableDemo extends React.Component {
  constructor(props) {

    super(props)
    this.state = {
      is_loading: '',
      dataSource: [],
      id: '',
      filteredInfo: null,
      sortedInfo: null,
      loading: false,
      pagination: {
        pageSize: 8
      },
      createmode:false,
      data8: [
        {
          c_id: 'CN001',
          c_name: 'Chinese',
          info: '上海交大语文课程，你值得拥有',
          book: '美的探索-xxx著',
        },
        {
          c_id: 'MA001',
          c_name: 'Math',
          info: '上海交大数学课程，你值得拥有',
          book: '高等数学',
        },
        {
          c_id: 'EN001',
          c_name: 'English',
          info: '上海交大数学课程，你值得拥有，而且这个介绍特别长以至于无法显示完全',
          book: '大学英语',
        }
      ],
      u_type: 'T',
      editingKey: '',
      count: 3,
      creatingCount: 0,
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
      url: "/getlablist",
      data: {
        uid: this.state.id,
      },
      success: function (data) {
        message.info("success");
        ret = JSON.parse(data)
        console.log("ret1 ", ret)
        this.setState({
          dataSource: ret,
          lecture: ret[0].labid,
          is_loading: false
        });
      }.bind(this)
    })
  }

  componentDidMount() {
    this.getRemoteData()
  }

  columns7 = [
    {
      title: '实验编号',
      dataIndex: 'labid',
      width: '15%',
      editable: true,
    },
    {
      title: '实验名',
      dataIndex: 'labname',
      width: '30%',
      editable: true,
    },
    {
      title: '实验目的',
      dataIndex: 'labaim',
      width: '55%',
      editable: true,
      render: (value, record) => {
        if (record.labaim.length >= 25) {
          console.log("meinv")
          console.log()
          var sub = '';
          for (var i = 0; i < 24; i++) {
            sub += record.labaim[i];
          }
          sub += '...'
          return <div title={record.labaim}>{sub}</div>;
        }
        else return record.labaim;
      }
    },
  ]

  columns8 = [
    {
      title: '实验编号',
      dataIndex: 'labid',
      width: '10%',
      editable: true,
    },
    {
      title: '实验名',
      dataIndex: 'labname',
      width: '20%',
      editable: true,
    },
    {
      title: '实验目的',
      dataIndex: 'labaim',
      width: '40%',
      editable: true,
      render: (value, record) => {
        if (record.labaim.length >= 25) {
          console.log("meinv")
          console.log()
          var sub = '';
          for (var i = 0; i < 24; i++) {
            sub += record.labaim[i];
          }
          sub += '...'
          return <div title={record.labaim}>{sub}</div>;
        }
        else return record.labaim;
      }
    },
    // {
    //   title: '参考文献',
    //   dataIndex: 'ctextbook',
    //   width: '20%',
    //   editable: true,
    // },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        const editable = this.isEditing(record);
        return (
          <div>
            {editable ? (
              <span>
                <EditableContext.Consumer>
                  {form => (
                    <a

                      onClick={() => this.save(form, record.labid)}
                      style={{ marginRight: 8 }}
                    >
                      保存
                    </a>
                  )}
                </EditableContext.Consumer>
                {this.state.data8.length > 1 ?
                  <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(record.labid)}>
                    <a>删除   </a>
                  </Popconfirm> : null
                }
                <Popconfirm
                  title="Sure to cancel?"
                  onConfirm={() => {
                    console.log(this.state.creatingCount);
                    this.state.creatingCount > 0 ?
                      this.cancelCreate(record.labid) :
                      this.cancel(record.labid)
                  }}
                >
                  <a>取消</a>
                </Popconfirm>

              </span>
            ) : (
                <a onClick={() => this.edit(record.labid)}>编辑</a>
              )}
          </div>
        );
      },
    },
  ]

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
    const arr = this.state.dataSource.slice()
    const index = arr.findIndex(item => item.labid === key)
    $.ajax({
      type: 'POST',
      url: "/deletelab",
      data: {
        labid: arr[index].labid,
        id: this.state.id
      },
      success: function (data) {
        message.info("success");
        this.setState({
          dataSource: arr.filter(item => item.labid !== key)
        })
      }.bind(this)
    })
  }
  handleAdd = () => {
    const { data8, count, creatingCount,dataSource } = this.state //本来想用data7的length来代替count，但是删除行后，length会-1
    const newData = {
      labid: '',
      labname: '',
      labaim: '',
    };
    console.log(dataSource, count, creatingCount);
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
      creatingCount: creatingCount + 1,
      editingKey: '',
      createmode:true
    })
  }
  isEditing = (record) => {
    return record.labid === this.state.editingKey;
  };

  edit(key) {
    const creatingCount = this.state.creatingCount;
    if (creatingCount > 0) {
      this.setState({
        dataSource: this.state.dataSource.slice(0, this.state.count - creatingCount),
        count: this.state.count - creatingCount,
        creatingCount: 0,
      })
    }
    this.setState({ editingKey: key });
  }

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.dataSource];
      const index = newData.findIndex(item => key === item.labid);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        var _labid = this.state.createmode ? 'null' : row.labid;
        $.ajax({
          type: 'POST',
          url: "/editlab",
          data: {
            labid: _labid,
            labname: row.labname,
            labaim: row.labaim,
            id: this.state.id
          },
          success: function (data) {
            message.info('success')
            ret = JSON.parse(data)
            console.log(ret)
            this.setState({
              dataSource: ret, editingKey: '',
              createmode: false
            });
          }.bind(this)
        })
      } else {
        newData.push(row);
        this.setState({ dataSource: newData, editingKey: '' });
      }
    });
  }

  cancelCreate = (key) => {
    this.setState({
      dataSourse: this.state.dataSource.slice(0, this.state.count - 1),
      editingKey: '',
      createmode:false,
      count: this.state.count - 1,
      creatingCount: this.state.creatingCount - 1
    })
  }

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  render() {
    const rowSelection = {
      selections: true
    }
    let { sortedInfo, filteredInfo, is_loading } = this.state
    sortedInfo = sortedInfo || {}
    filteredInfo = filteredInfo || {}
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns7 = this.columns7;
    const columns8 = this.columns8.map((col) => {
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
    const cardContent = `<ul class="card-ul">
            <li>教师课程功能界面</li>
            <li>可以对课程内容进行增删改查</li>
          </ul>`
    if (!is_loading) {
      return (
        <div>
          <CustomBreadcrumb arr={['课程功能', '课程管理']} />
          <TypingCard id='howUse' source={cardContent} height={178} />
          <Card bordered={false} title='课程列表' style={{ marginBottom: 10, minHeight: 440 }} id='editTable'>
            <p>
              <Button onClick={this.handleAdd}>添加课程</Button>
            </p>
            <Table style={styles.tableStyle} components={components} dataSource={this.state.dataSource}
              columns={isAuthenticatedtype() === 'T' ? columns8 : columns7} />
          </Card>
          <BackTop visibilityHeight={200} style={{ right: 50 }} />
        </div>
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

export default TableDemo