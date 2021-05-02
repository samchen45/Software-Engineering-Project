import React, { Fragment } from 'react'
import { Card, Spin, Button, Form, Input, Radio, List, Switch, Avatar, BackTop, Anchor, Affix, Icon, Table, Row, Col, Upload, message, Select } from 'antd'
import axios from 'axios'
import CustomBreadcrumb from '../../../../components/CustomBreadcrumb/index'
import TypingCard from '../../../../components/TypingCard'

import { Map, is } from 'immutable';

import Upvote from '../../../../components/public/Upvote.js';
import { isAuthenticatedid, isAuthenticated } from '../../../../utils/Session'
import $ from 'jquery'
import classnames from 'classnames';
import "./css/questionDetail.css";
import '../../../../components/public/css/style.css';
import '../../../../components/public/font-awesome/css/font-awesome.css'

import { eventBus } from '../../../../components/public/eventBus.js';
import moment from 'moment'
import AnswerList from '../../../../components/AnswerList'
import AnswerAdd from '../../../../components/AnswerAdd'


let ret = '';
class QuestionsDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            /*questionDetail:
            {
                id: 0,
                title: 'title',
                subtime: '1999-9-9',
                substance: 'content',
                upvote: 999,
                username: 'User',
            }*/
            is_loading: false,
            questionDetail: [],
            answerList:[],
        }
        this.addAnswer = this.addAnswer.bind(this)
        this.loadlist = this.loadlist.bind(this)
    }

    addAnswer(answer) {
        this.setState({
            answerList: answer
        })
    }

    componentWillMount() {
        this.setState({
            is_loading: true
        })
        let uid = isAuthenticatedid()
        console.log('qd test');
        this.setState({
            id: uid
        }, () => {
            console.log(this.state.id);
            //console.log(this.props.location.state.questionDetail)
            this.loadlist();
        })
    }

    loadlist() {
        var that = this
        var id = ''
        var qid = localStorage.getItem('qid')
        if (qid != ''){
            id = parseInt(qid)
        }
        else {
            id = this.props.location.state.id
        }
        $.ajax({
            type: 'POST',
            url: "/viewreplies",
            data: {
                uid: this.state.id,
                postid:id,
            },
            success: function (data) {
                message.info("success");
                ret = JSON.parse(data)
                console.log("qd_list_post ", ret)
                this.setState({
                    answerList: ret,
                    is_loading: false
                });
            }.bind(this)
        })
    }

    render() {
        const { questionDetail,answerList } = this.state;

        const handle = eventBus.sub("ansToQue", "updateTime", (data) => {
            console.log("eventBus sub 执行啦！data：" + JSON.stringify(data));
        })

        const { dispatch } = this.props;
        return (
            <div>

                <CustomBreadcrumb arr={['实验功能', { title: '实验提问', to: '/home/display/questions' }, '提问详情']} />
                <Card bordered={false} title='提问详情' style={{ marginBottom: 10 }} id='detail'>
                    <Fragment>
                        <div className="question-header">
                            <div className="question-title">
                                <span className={classnames("fa", "fa-question-circle")}></span>  {questionDetail.title}
                            </div>
                            <div className="questioner-msg">
                                <div className="tag-list">
                                    <span className="tag">React</span>
                                    <span className="tag">JavaScript</span>
                                    <span className="tag">前端</span>
                                </div>
                                <div className={classnames("questioner-name", "color0099FF")}>{questionDetail.author}</div>
                                <div className={"questioner-time"}>
                                    {moment().fromNow((questionDetail.createtime))}
                                </div>
                            </div>
                        </div>
                        <div className="question-desc">
                            <div className="right-area">
                                <div className="question-substance">
                                    {questionDetail.text}
                                </div>
                            </div>
                        </div>
                    </Fragment>
                    <AnswerList answerList={answerList} dispatch={dispatch}/>
                    <AnswerAdd postid = {this.props.location.state.id} dispatch={dispatch} addAnswer={this.addAnswer}/>
                </Card>
            </div>
        )
    }
}

export default QuestionsDetail