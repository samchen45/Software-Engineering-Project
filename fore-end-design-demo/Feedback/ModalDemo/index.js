import React from 'react'
import {Card, Button, Form, Modal, Upload, Icon, Input, Tooltip ,Table} from 'antd'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb'
import TypingCard from '../../../components/TypingCard'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 8},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 12},
  },
};

const EditableContext = React.createContext();
const EditableRow = ({form, index, ...props}) => (
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
  state = {
    /*
    visible: false,
    visible2: false,
    visible3: false,
    visible4: false,
    visible5: false,
    */
    ModalText: '显示对话框的内容',
    confirmLoading: false,
    numbers : [
      {key:1}, 
      {key:2}, 
      {key:3}, 
      {key:4}, 
      {key:5}
    ]
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
  
  showConfirm1 = (num) => {
    
    const modal = Modal.confirm()
    
    modal.update({
      title:'作业',
      okText:'确认',
      cancelText:'取消',
      destroyOnClose:true,
      content:(
        <div>
          <p>{'作业内容说明'+num}</p>
          <p>{'作业内容说明'+num}</p>
          <p>{'作业内容说明'+num}</p>
          <form>
           <FormItem label='上传文件' {...formItemLayout}><Upload><Button type='primary'><Icon type='upload'/>上传文件</Button></Upload></FormItem>
           <FormItem label='备注（可选）' {...formItemLayout}>              
            <Input/></FormItem>
          </form>
        </div>
      ),
      onOk(){},
      onCancel(){}
    })
  }

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

  showConfirm2 = () => {
    const modal = Modal.confirm()
    modal.update({
      title:'作业',
      okText:'确认',
      cancelText:'取消',
      destroyOnClose:true,
      content:(
        <div>
          <p>{'作业内容'}</p>
          <form></form>
        </div>
      ),
      onOk(){},
      onCancel(){}
    })
  }

  render() {
    /*
    const {visible,visible1,visible2,visible3,visible4,visible5, ModalText, confirmLoading} = this.state
    */
    const cardContent = ` 该页面用于查看用户所有的作业。`

    
    /*
    const homeworks = numbers.map((number) => 
      <Card bordered={true} titie = {number.class_name}>
        <a href={'#'+ number.class_name} onclick={this.showConfirm1(number.class_name)}> {'作业'+ number.class_name} 
        </a>
      </Card>
    )
    */
    

    return (
      <div>
        <CustomBreadcrumb arr={['作业', '查看作业']}/>
        <TypingCard source={cardContent}/>
        <Card bordered={false} title='可编辑的表格' style={{marginBottom: 10, minHeight: 440}} id='editTable'>
          
          {/* <Table bordered dataSource={this.state.data7} columns={this.columns7} style={styles.tableStyle}/> */}
          <Table style={styles.tableStyle}  bordered dataSource={this.state.numbers}
                 columns={this.columns7}/>
        </Card>
      </div>
    )
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