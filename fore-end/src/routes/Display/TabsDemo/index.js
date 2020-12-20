import React from 'react'
import { Card, Popconfirm, Button, Icon, Table, Divider, BackTop, Affix, Anchor, Form, InputNumber, Input, message } from 'antd'
import axios from 'axios'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import TypingCard from '../../../components/TypingCard'
import { isAuthenticatedid } from '../../../utils/Session'
import $ from 'jquery'

var ret = new Array()
const { SearchOutlined } = Icon;
const data3 = [
  {
    key: '1',
    c_id: 'CN001',
    c_name: 'Chinese',
    t_name: 'CYH',
    book: '大学语文',
    info: '上海交大语文课程，你值得拥有',
    state: 'studied',
  },
  {
    key: '2',
    c_id: 'MA001',
    c_name: 'Maths',
    t_name: 'WY',
    book: '微积分',
    info: '上海交大数学课程，你值得拥有',
    state: 'studying',
  },
  {
    key: '3',
    c_id: 'EN001',
    c_name: 'English',
    t_name: 'PSY',
    book: '大学英语',
    info: '上海交大英语课程，你值得拥有',
    state: 'to be studied',
  },
  {
    key: '4',
    c_id: 'SE001',
    c_name: '高级软件开发与管理',
    t_name: '沈备军',
    book: '软件工程',
    info: '上海交大软件课程，你特别值得拥有',
    state: 'to be studied',
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
                      message: `Please Input ${title}!`,
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
      dataSource: [],
      id: '',
      is_loading: '',
      filteredInfo: null,
      sortedInfo: null,
      loading: false,
      data4: [],
      pagination: {
        pageSize: 8
      },
      count: 2,
      data8: [{
        key: '0',
        c_name: 'Chinese',
        info: '上海交大语文课程，你值得拥有',
        book: '美的探索-xxx著',
      }, {
        key: '1',
        c_name: 'Math',
        info: '上海交大数学课程，你值得拥有',
        book: '高等数学',
      }],
      editingKey: '',
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
        verbose: true
      },
      success: function (data) {
        message.info("success");
        ret = JSON.parse(data)
        console.log("ret1 ", ret)
        this.setState({
          dataSource: ret,
          lecture: ret[0].cid,
          is_loading: false
        });
      }.bind(this)
    })
  }


  componentDidMount() {
    this.getRemoteData()
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`搜索课程名`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          //icon={<div />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          搜索
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          重置
        </Button>
      </div>
    ),
    //filterIcon: filtered => <div style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: text =>
      text
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  columns7 = [
    {
      title: 'name',
      dataIndex: 'name',
      width: '30%',
    },
    {
      title: 'age',
      dataIndex: 'age',
    },
    {
      title: 'address',
      dataIndex: 'address',
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (text, record) => {
        return (
          this.state.data7.length > 1 ?
            <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(record.key)}>
              <a>Delete</a>
            </Popconfirm> : null
        )
      }
    }
  ]
  columns8 = [
    {
      title: '课程编号',
      dataIndex: 'cid',
      width: '8%',
      editable: true,
    },
    {
      title: '课程名',
      dataIndex: 'cname',
      width: '18%',
      editable: true,
      ...this.getColumnSearchProps('c_name'),
    },
    {
      title: '任课教师',
      dataIndex: 'cteacher',
      width: '10%',
      editable: true,
    },
    {
      title: '课程介绍',
      dataIndex: 'cdes',
      width: '26%',
      editable: true,
    },
    {
      title: '参考文献',
      dataIndex: 'ctextbook',
      width: '23%',
      editable: true,
    },
    {
      title: '修读情况',
      dataIndex: 'status',
      width: '15%',
      editable: true,
      render: (value, record) => {
        if (record.status === 'completed') return '已修读';
        else if (record.status === 'active') return '正在修读';
        else if (record.status === 'NULL') return '未修读';
      },
      filters: [
        {
          text: '已修读',
          value: 'studied',
        },
        {
          text: '正在修读',
          value: 'studying',
        },
        {
          text: '未修读',
          value: 'to be studied',
        },
      ],
      onFilter: (value, record) => record.status === value,
    },
    /*{
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

                        onClick={() => this.save(form, record.key)}
                        style={{marginRight: 8}}
                      >
                        Save
                      </a>
                    )}
                  </EditableContext.Consumer>
                  {this.state.data7.length > 1 ?
                  <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(record.key)}>
                  <a>Delete     </a>
                  </Popconfirm> : null
                  }
                  <Popconfirm
                    title="Sure to cancel?"
                    onConfirm={() => this.cancel(record.key)}
                  >
                    <a>Cancel</a>
                  </Popconfirm>
                  
                </span>
            ) : (
              <a onClick={() => this.edit(record.key)}>Edit</a>
            )}
          </div>
        );
      },
    },*/
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
    const arr = this.state.data8.slice()
    this.setState({
      data8: arr.filter(item => item.key !== key)
    })
  }
  handleAdd = () => {
    const { data8, count } = this.state //本来想用data7的length来代替count，但是删除行后，length会-1
    const newData = {
      key: count,
      c_name: 'new_course',
      info: 'introction',
      book: 'book',
    };
    this.setState({
      data8: [...data8, newData],
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
      const newData = [...this.state.data8];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ data8: newData, editingKey: '' });
      } else {
        newData.push(data8);
        this.setState({ data8: newData, editingKey: '' });
      }
    });
  }

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  render() {
    const rowSelection = {
      selections: true
    }
    let { sortedInfo, filteredInfo } = this.state
    sortedInfo = sortedInfo || {}
    filteredInfo = filteredInfo || {}
    const columns3 = [
      {
        title: '课程名',
        dataIndex: 'c_name',
        key: 'c_name',
        filters: [
          { text: 'Joe', value: 'Joe' },
          { text: 'Jim', value: 'Jim' },
        ],
        filteredValue: filteredInfo.c_name || null,
        onFilter: (value, record) => record.c_name.includes(value),
        sorter: (a, b) => a.c_name.length - b.c_name.length,
        sortOrder: sortedInfo.columnKey === 'c_name' && sortedInfo.order,
      }, {
        title: '教师名',
        dataIndex: 't_name',
        key: 't_name',
        filteredValue: filteredInfo.t_name || null,
        onFilter: (value, record) => record.t_name.includes(value),
        sorter: (a, b) => a.t_name.length - b.t_name.length,
        sortOrder: sortedInfo.columnKey === 't_name' && sortedInfo.order,
      }, {
        title: '课程简介',
        dataIndex: 'info',
        key: 'info',
        filters: [
          { text: 'London', value: 'London' },
          { text: 'New York', value: 'New York' },
        ],
        filteredValue: filteredInfo.info || null,
        onFilter: (value, record) => record.info.includes(value),
        sorter: (a, b) => a.info.length - b.info.length,
        sortOrder: sortedInfo.columnKey === 'info' && sortedInfo.order,
      }]
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
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
            <li>学生课程功能导览</li>
            <li>可以对课程进行搜索查找排序筛选等</li>
          </ul>`
    const is_loading = this.state.is_loading
    if (!is_loading) {
      return (
        <div>
          <CustomBreadcrumb arr={['课程功能', '课程管理']} />
          <TypingCard id='howUse' source={cardContent} height={178} />
          <Card bordered={false} title='课程列表' style={{ marginBottom: 10, minHeight: 400 }} id='filterOrSort'>
            {/*
          <p>
            <Button onClick={() => this.setSort('c_name')}>课程名排序</Button>&emsp;
            <Button onClick={() => this.setSort('t_name')}>教师排序</Button>&emsp;
            <Button onClick={this.clearFilters}>清空过滤规则</Button>&emsp;
            <Button onClick={this.clearAll}>重置</Button>
          </p>*/}
            <Table dataSource={this.state.dataSource} columns={columns8} style={styles.tableStyle} />
          </Card>
          <BackTop visibilityHeight={200} style={{ right: 50 }} />
        </div>
      )
    } else {
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