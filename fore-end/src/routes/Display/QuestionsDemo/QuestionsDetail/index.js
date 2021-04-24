import React, {Fragment} from 'react'
import {Card, Spin, Button, Form, Input, Radio, List, Switch, Avatar,BackTop,Anchor,Affix,Icon, Table, Row, Col, Upload, message, Select} from 'antd'
import axios from 'axios'
import CustomBreadcrumb from '../../../../components/CustomBreadcrumb/index'
import TypingCard from '../../../../components/TypingCard'

import {Map,is} from 'immutable';

import Upvote from '../../../../components/public/Upvote.js';

import classnames from 'classnames';
import "./css/questionDetail.css";
import '../../../../components/public/css/style.css';
import '../../../../components/public/font-awesome/css/font-awesome.css'

import {eventBus} from '../../../../components/public/eventBus.js';
import moment from 'moment'
import AnswerList from '../../../../components/AnswerList'
import AnswerAdd from '../../../../components/AnswerAdd'


class QuestionsDetail extends React.Component {
    state = {
        questionDetail:
        {
            id: 0,
            title: 'title',
            subtime: '1999-9-9',
            substance: 'content',
            upvote: 999,
            username: 'User',
        }
    }

    render() {
        const { questionDetail } = this.state;

        const handle=eventBus.sub("ansToQue","updateTime",(data)=>{
            console.log("eventBus sub 执行啦！data："+JSON.stringify(data));
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
                                <div className={classnames("questioner-name", "color0099FF")}>{questionDetail.username}</div>
                                <div className={"questioner-time"}>
                                    {moment().fromNow((questionDetail.subtime))}
                                </div>
                            </div>
                        </div>
                        <div className="question-desc">
                            <div className="left-area">
                                <Upvote
                                    count={questionDetail.upvote}
                                    id={questionDetail.id}
                                    dispatch={dispatch}
                                ></Upvote>
                            </div>
                            <div className="right-area">
                                <div className="question-substance">
                                    {questionDetail.substance}
                                </div>
                            </div>
                        </div>
                    </Fragment>
                    <AnswerList/>
                    <AnswerAdd/>
                </Card>
            </div>
        )
    }
}

export default QuestionsDetail