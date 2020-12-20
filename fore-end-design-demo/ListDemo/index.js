import React from 'react'
import {Card, Spin, Button, Form, Input, Radio, List, Switch, Avatar,BackTop,Anchor,Affix,Icon, Table, Row, Col, Upload, message} from 'antd'
import axios from 'axios'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import TypingCard from '../../../components/TypingCard'

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

class ListDemo extends React.Component {
  state = {
    size: 'default',
    bordered: true,
    data2: [],
    loading: false,
    loadingMore: false,
    experimentName: '实验1',
    studentName: '张三',
    studentId: '120037910001',
    experimentGoal: `实验目的
    实验目的1
    实验目的2`,
    experimentGeneratedReport: 
`后端生成的报告
内容1
内容2
`
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

  render() {
    const {size, bordered, loading, data2, loadingMore} = this.state
    const loadMore = (
      <div style={styles.loadMore}>
        {/*不知道为什么这种写法有问题，会报错*/}
        {/*{loadingMore ? <Spin/> : <Button onClick={() => this.getData2()}>加载更多</Button>}*/}
        <Spin style={loadingMore ? {} : { display: 'none' }} />
        <Button style={!loadingMore ? {} : { display: 'none' }} onClick={() => this.getData2()}>加载更多</Button>
      </div>
    )
    return (
      <div>
        <CustomBreadcrumb arr={['作业', '实验报告']} />
        <Card bordered={false} title='实验报告' style={{ marginBottom: 10 }} id='report'>
          <Form>
            <Card showHeader={false}>
              <Card.Grid style={{ width: '15%', textAlign: 'left', fontSize: 24 }} hoverable={false}>实验名称</Card.Grid>
              <Card.Grid style={{ width: '85%', textAlign: 'left', fontSize: 24 }} hoverable={false}>{this.state.experimentName}</Card.Grid>
              <Card.Grid style={{ width: '15%', textAlign: 'left', fontSize: 24 }} hoverable={false}>姓名</Card.Grid>
              <Card.Grid style={{ width: '35%', textAlign: 'left', fontSize: 24 }} hoverable={false}>{this.state.studentName}</Card.Grid>
              <Card.Grid style={{ width: '15%', textAlign: 'left', fontSize: 24 }} hoverable={false}>学号</Card.Grid>
              <Card.Grid style={{ width: '35%', textAlign: 'left', fontSize: 24 }} hoverable={false}>{this.state.studentId}</Card.Grid>
              <Card.Grid style={{ width: '100%', textAlign: 'left', fontSize: 24 }} hoverable={false}>一、实验目的</Card.Grid>
              <Card.Grid style={{ width: '100%', textAlign: 'left', fontSize: 24, whiteSpace: 'pre-wrap' }} hoverable={false}>{this.state.experimentGoal}</Card.Grid>
              <Card.Grid style={{ width: '100%', textAlign: 'left', fontSize: 24 }} hoverable={false}>二、自定义学生实验报告（根据实验和学科内容自拟实验报告格式，建议包括实验关键过程与参数、实验结果、分析与思考等。包括文字性描述、实验截图、表格等信息）</Card.Grid>
              <Card.Grid style={{ width: '100%', textAlign: 'left', fontSize: 24, whiteSpace: 'pre-wrap' }} hoverable={false}>
                {this.state.experimentGeneratedReport}
              </Card.Grid>
              <Card.Grid style={{ width: '100%', textAlign: 'left', fontSize: 24, whiteSpace: 'pre-wrap' }} hoverable={false}>
                分析与思考：
                <Input.TextArea />
              </Card.Grid>
              <Card.Grid style={{ width: '100%', textAlign: 'left', fontSize: 24, whiteSpace: 'pre-wrap' }} hoverable={false}>
                附件：
                <Upload {...props}>
                  <Button>Click to Upload</Button>
                </Upload>
              </Card.Grid>
              <Card.Grid style={{ width: '100%', textAlign: 'left', fontSize: 24 }} hoverable={false}>三、自定义实验评价报告（根据实验和学科内容自拟实验评价格式，包括实验得分项细节、总成绩、评语，以及可考虑采用评价教师电子签名）</Card.Grid>
              <Card.Grid style={{ width: '100%', textAlign: 'left', fontSize: 24, whiteSpace: 'pre-wrap' }} hoverable={false}></Card.Grid>
              <Button>提交</Button><Button>生成PDF</Button>
            </Card>
          </Form>
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
}

const styles = {
  haveBorder: {
    minHeight: 270,
    width:'80%',
    boxSizing: 'border-box'
  },
  noBorder: {
    minHeight: 270,
    width:'80%',
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
  listStyle:{
    width:'80%'
  },
  affixBox:{
    position: 'absolute',
    top: 100,
    right: 50,
    with: 170
  }
}

export default ListDemo