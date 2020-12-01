import React from 'react'
import { Card, Button, Form, Modal, Upload, Icon, Input, Tooltip, Table, Notification, message, Select } from 'antd'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb'
import TypingCard from '../../../components/TypingCard'
import reqwest from 'reqwest';

const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

const LecturesRemote = ['课程1', '课程2']; // 更新这个当载入页面时从远程服务器
const { Option } = Select;

const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);
class ModalDemo extends React.Component {
  /*
  constructor(){
    super()
    

    this.state = {
      visible: false,
      visible2: false,
      visible3: false,
      visible4: false,
      visible5: false,
      ModalText: '显示对话框的内容',
      confirmLoading: false
  } 
  */
  constructor(props) {
    super(props)
    this.state = {
      /*
      visible: false,
      visible2: false,
      visible3: false,
      visible4: false,
      visible5: false,
      */
      is_loading: false,
      dataSource: [],
      id: '',
      lecture: '',
      organCertUrl: "",
      fileList: [],
      uploading: false,
      ModalText: '显示对话框的内容',
      confirmLoading: false,
      visible: false,
      homeworks: [
        { key: 1 },
        { key: 2 },
        { key: 3 },
        { key: 4 },
        { key: 5 },
      ],
      homework: 1,
      hoemwork_list:[],
      h_id:'',
      h_name:'',
      h_des:'',
      h_date:''
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
          lecture: ret[0].cid,
          is_loading: false
        });
      }.bind(this)
    })
  }

  get_hmk_list = () => {
    $.ajax({
      type: 'POST',
      url: "/viewcourses",
      data: {
        userid: this.state.id,
        cid: this.state.lecture
      },
      success: function (data) {
        message.info("success");
        ret = JSON.parse(data)
        console.log("ret2 ", ret)
        this.setState({
          homework_list: ret,
        });
      }.bind(this)
    })
  }
  handleUpload = () => {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('files[]', file);
    });

    this.setState({
      uploading: true,
    });

    // You can use any AJAX library you like
    reqwest({
      url: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      method: 'post',
      processData: false,
      data: {
        file: formData
      },
      success: () => {
        this.setState({
          fileList: [],
          uploading: false,
        });
        message.success('upload successfully.');
      },
      error: () => {
        this.setState({
          uploading: false,
        });
        message.error('upload failed.');
      },
    });
  }


  closeModal(a) {
    this.setState({
      [a]: false
    })
  }

  asynModalOnOk = (a) => {
    this.setState({
      confirmLoading: true,
      ModalText: '对话框将在2秒后关闭'
    })
    setTimeout(() => this.setState({
      [a]: false,
      confirmLoading: false,
      ModalText: '显示对话框的内容'
    }), 2000)
  }
  showConfirm = () => {
    Modal.confirm({
      title: 'Do you Want to delete these items?',
      content: 'Some descriptions',
    })
  }
  showDeleteConfirm = () => {
    Modal.confirm({
      title: 'Are you sure delete this task?',
      content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  showModalType = (type) => {
    switch (type) {
      case 'info':
        Modal.info({
          title: 'This is a notification message',
          content: (
            <div>
              <p>some messages...some messages...</p>
              <p>some messages...some messages...</p>
            </div>
          )
        })
        break;
      case 'success':
        Modal.success({
          title: 'This is a success message',
          content: 'some messages...some messages...',
        })
        break;
      case 'error':
        Modal.error({
          title: 'This is an error message',
          content: 'some messages...some messages...',
        })
        break;
      default:
        Modal.warning({
          title: 'This is a warning message',
          content: 'some messages...some messages...',
        })
        break;
    }
  }

  /*
  showConfirm1 = (num, props, uploading, fileList) => {

    const modal = Modal.confirm()
    const onUpdate = (value) => {
      modal.update({
        content: <div>

        </div>
      });
    }
    const onUploading = (value) => {
      onUpdate(value);
      this.handleUpload(value)
    }
    modal.update({
      title: '作业',
      okText: '确认',
      cancelText: '取消',
      destroyOnClose: true,
      content: (
        <div>
          <p>{'作业内容说明' + num}</p>
          <p>{'作业内容说明' + num}</p>
          <p>{'作业内容说明' + num}</p>
          <FormItem label='上传文件' {...formItemLayout}>
            <Upload {...props}>
              <Button onClick={onUpdate}><Icon type='upload' />选择文件</Button>
            </Upload>
            <Button
              type="primary"
              onClick={this.handleUpload}
              disabled={fileList.length === 0}
              loading={uploading}
              style={{ marginTop: 16 }}
            >
              {uploading ? 'Uploading' : 'Start Upload'}
            </Button>
          </FormItem>
          <FormItem label='备注（可选）' {...formItemLayout}></FormItem>
          {/*
          <Form layout="vertical" onSubmit={this.handleSubmit}>
            <Form.Item>
              <div  key={Math.random()}>//点击关闭在次打开还会有上次上传文件的缓存
                <Upload {...props}>
                  <Button type="primary">
                    <Icon type="upload" />选择文件
                 </Button>
                </Upload>
 
              </div>
            </Form.Item>
            <Form.Item label="文件名(可更改)">
              {getFieldDecorator('filename', {
                // initialValue:this.state.defEmail,
                rules: [
                  {
                    message: '请输入正确的文件名',
                    // pattern: /^[0-9]+$/,
                  },
                  {
                    required: true,
                    message: '请输入文件名',
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="描述(选填)">
              {getFieldDecorator('describe', {
 
                rules: [
                  {
                    message: '描述不能为空',
                  },
                  {
                    required: false,
                    message: '请输入描述',
                  },
                ],
              })(<TextArea />)}
            </Form.Item>
            <Form.Item label="文件类型">
              {getFieldDecorator('filetype', {
                rules: [
                  {
                    message: '文件类型',
                  },
                  {
                    required: true,
                    message: '文件类型',
                  },
                ],
              })(<Input disabled={true} />)}
            </Form.Item>
            </Form>}
        </div>
      ),
      onOk() { },
      onCancel() { }
    })
  }
  */

  /*
  columns7 = [
    {
      title: '课程编号',
      dataIndex: 'key',
      width: '10%',
    },
    {
      title: '课程名',
      dataIndex: 'name',
      width: '30%',
    },
    {
      title: '作业编号',
      dataIndex: 'num',
      width: '10%',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        return (
          <div>
            <Button onClick = {()=>this.showConfirm1(record.key)}>提交</Button>
          </div>
           )
           
      }
    },
    {
      title: '评分',
      dataIndex: 'score',
      render: () => {
        return <p>0/0</p>
      }
    },
  ]
  */

  showModal = (e, record) => {
    this.setState({
      visible: true,
      h_id: record.hid,
      h_name: record.hname,
      h_des: record.hdes,
      h_date: record.hdate,
    })
  }

  handleOk = e => {
    this.setState({
      visible: false,
    })
  }

  handleCancel = e => {
    this.setState({
      visible: false,
    })
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.modal.modalUpdateDetail) {
      this.props.form.resetFields();
    }
  }

  handleLectureChange = (value) => {
    this.setState({
      lecture:value
    })
  };

  render() {
    /*
    const {visible,visible1,visible2,visible3,visible4,visible5, ModalText, confirmLoading} = this.state
    */

    const { is_loading, dataSource,uploading, fileList, homework: num } = this.state;
    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };

    const cardContent = ` 该页面用于查看用户所有的作业。`

    const columns7 = [
      {
        title: '作业编号',
        dataIndex: 'hid',
        width: '10%',
      },
      {
        title: '作业名',
        dataIndex: 'hname',
        width: '10%',
      },
      {
        title: '作业说明',
        dataIndex: 'hdes',
        width: '30%',
      },
      {
        title: '作业日期',
        dataIndex: 'hdate',
        width: '10%',
      },
      {
        title: '作业状态',
        dataIndex: 'hstatus',
        width: '10%',
      },
      {
        title: '评分',
        dataIndex: 'hscore',
        width: '10%',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '10%',
        render: (text, record) => {
          return (
            <div>
              <Button onClick={e => this.showModal(e, record)}>提交</Button>
            </div>
          )
        }
      },
    ]

    const handleLectureChange = this.handleLectureChange;




    /*
    const homeworks = numbers.map((number) => 
      <Card bordered={true} titie = {number.class_name}>
        <a href={'#'+ number.class_name} onclick={this.showConfirm1(number.class_name)}> {'作业'+ number.class_name} 
        </a>
      </Card>
    )
    */

    if (!is_loading) {
      return (
        <div>
          <CustomBreadcrumb arr={['作业功能', '查看作业']} />
          <TypingCard source={cardContent} />
          <Card bordered={false} title='作业列表' style={{ marginBottom: 10, minHeight: 440 }} id='editTable'>
            {/* <Table bordered dataSource={this.state.data7} columns={this.columns7} style={styles.tableStyle}/> */}
            <p>选择课程：
            <Select defaultValue={dataSource[0].cname} style={{ width: 240 }} onChange={handleLectureChange}>
                {dataSource.map(lecture => (
                  <Option key={lecture.cid}>{lecture.cname}</Option>
                )
                )}
              </Select>
            </p>
            <p>
              <Button onclick = {this.get_hmk_list}>确认</Button>
            </p>
            <Table style={styles.tableStyle} dataSource={this.state.hoemwork_list}
              columns={columns7} />
          </Card>
          <Modal id='modal'
            visible={this.state.visible}
            title='作业'
            okText='确认'
            cancelText='取消'
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            destroyOnClose={false}
          >
            <div>
              <p>{'作业名称' + this.state.h_name}</p>
              <p>{'作业内容说明' + this.state.h_des}</p>
              <p>{'作业截止日期' + this.state.h_date}</p>
              <FormItem label='上传文件' {...formItemLayout}>
                <Upload {...props}>
                  <Button><Icon type='upload' />选择文件</Button>
                </Upload>
                <Button
                  type="primary"
                  onClick={this.handleUpload}
                  disabled={fileList.length === 0}
                  loading={uploading}
                  style={{ marginTop: 16 }}
                >
                  {uploading ? 'Uploading' : 'Start Upload'}
                </Button>
              </FormItem>
              <FormItem label='备注（可选）' {...formItemLayout}></FormItem>
            </div>
          </Modal>
        </div>
      )
    }
    else {
      return (
        <div></div>
      )
    }
    /*
    return (
      <div>
        <CustomBreadcrumb arr={['反馈','对话框']}/>
        <TypingCard source={cardContent} height={164}/>
        <Card bordered={false}>
          <p>
            <Button onClick={() => this.setState({visible: true})}>基本用法</Button>
            <Modal
              visible={visible}
              title='基本用法'
              onOk={() => this.closeModal('visible')}
              onCancel={() => this.closeModal('visible')}>
              <p>Some contents...</p>
              <p>Some contents...</p>
              <p>Some contents...</p>
            </Modal>
          </p>
          <p>
            <Tooltip title='点击确定后异步关闭对话框，例如提交表单' placement='right'>
              <Button onClick={() => this.setState({visible2: true})}>异步关闭</Button>
            </Tooltip>
            <Modal
              visible={visible2}
              title='异步关闭'
              onOk={() => this.asynModalOnOk('visible2')}
              confirmLoading={confirmLoading}
              onCancel={() => this.closeModal('visible2')}>
              <p>{ModalText}</p>
            </Modal>
          </p>
          <p>
            <Tooltip title='更复杂的例子，自定义了页脚的按钮' placement='right'>
              <Button onClick={() => this.setState({visible3: true})}>自定义页脚</Button>
            </Tooltip>
            <Modal
              visible={visible3}
              title='自定义页脚'
              onOk={() => this.asynModalOnOk('visible3')}
              onCancel={() => this.closeModal('visible3')}
              footer={
                <div>
                  <Button onClick={() => this.closeModal('visible3')}>Return</Button>
                  <Button type="primary" loading={confirmLoading} onClick={() => this.asynModalOnOk('visible3')}>
                    Submit
                  </Button>
                </div>}
            >
              <p>{ModalText}</p>
            </Modal>
          </p>
          <p>
            <Button onClick={this.showConfirm}>确认对话框</Button>&emsp;
            <Button onClick={this.showDeleteConfirm}>删除确认框</Button>
          </p>
          <p>
            <Button onClick={() => this.showModalType('info')}>信息提示</Button>&emsp;
            <Button onClick={() => this.showModalType('success')}>成功</Button>&emsp;
            <Button onClick={() => this.showModalType('error')}>错误</Button>&emsp;
            <Button onClick={() => this.showModalType('warning')}>警告</Button>
          </p>
          <p>
            <Button onClick={() => this.setState({visible4: true})}>距离顶部20px</Button>
            <Modal
              visible={visible4}
              title='距离顶部20px'
              style={{top: 20}}
              onOk={() => this.closeModal('visible4')}
              onCancel={() => this.closeModal('visible4')}>
              <p>Some contents...</p>
              <p>Some contents...</p>
              <p>Some contents...</p>
            </Modal>
          </p>
          <p>
            <Button onClick={() => this.setState({visible5: true})}>垂直居中</Button>
            <Modal
              visible={visible5}
              title='垂直居中'
              wrapClassName="vertical-center-modal"
              style={{top: '30%'}}
              onOk={() => this.closeModal('visible5')}
              onCancel={() => this.closeModal('visible5')}>
              <p>Some contents...</p>
              <p>Some contents...</p>
              <p>Some contents...</p>
            </Modal>
          </p>
        </Card>
      </div>
    )
    */
  }
}

// const styles = {
//   modalVertical: {
//     position: 'fixed',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%,-50%)'
//   }
// }

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

export default ModalDemo