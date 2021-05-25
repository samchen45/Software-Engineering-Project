import React from 'react'
import { Card, Spin, Button, Form, Input, Radio, List, Switch, Avatar, BackTop, Anchor, Affix, Icon, Table, Row, Col, Upload, message, Select } from 'antd'
import axios from 'axios'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import TypingCard from '../../../components/TypingCard'
import { isAuthenticatedid, isAuthenticated } from '../../../utils/Session'
import $ from 'jquery'
import QuestionAdd from '../../../components/QuestionAdd/index'
import QuestionList from '../../../components/QuestionList/index'

let ret = '';
class QuestionsDemo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            is_loading: false,
            questionList: [],
        }
        this.addList = this.addList.bind(this),
            this.loadlist = this.loadlist.bind(this)
    }
    addList(list) {
        this.setState({
            questionList: list
        })
    }

    componentWillMount() {
        this.setState({
            is_loading: true
        })
        let uid = isAuthenticatedid()
        console.log('q test');
        this.setState({
            id: uid
        }, () => {
            console.log(this.state.id);
            this.loadlist();
        })
    }

    loadlist() {
        var that = this
        $.ajax({
            type: 'POST',
            url: "/lesson9/api/viewposts",
            data: {
                uid: this.state.id,
            },
            success: function (data) {
                message.info("success");
                ret = JSON.parse(data)
                console.log("q_list_post ", ret)
                localStorage.setItem('qid','')
                this.setState({
                    questionList: ret,
                    is_loading: false
                });
            }.bind(this)
        })
    }

    render() {
        const { dispatch, getState } = this.props;
        const { questionList,is_loading } = this.state;
        const cardContent = `
        <li>这个页面用来进行对实验的提问。</li>
      `
        if (!is_loading) {
            return (
                <div>
                    <CustomBreadcrumb arr={['实验功能', '实验提问']} />
                    <TypingCard source={cardContent} />
                    <Card title='实验提问'>
                        <div>
                            <QuestionAdd dispatch={dispatch} addList={this.addList} />
                        </div>
                        <div>
                            <QuestionList questionList={questionList} dispatch={dispatch} />
                        </div>
                    </Card>
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

export default QuestionsDemo