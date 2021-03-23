import React from 'react'
import {Card, Spin, Button, Form, Input, Radio, List, Switch, Avatar,BackTop,Anchor,Affix,Icon, Table, Row, Col, Upload, message, Select} from 'antd'
import axios from 'axios'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import TypingCard from '../../../components/TypingCard'

import QuestionAdd from '../../../components/QuestionAdd/index'
import QuestionList from '../../../components/QuestionList/index'

class QuestionsDemo extends React.Component {

    render() {
        const { dispatch, getState, questionList } = this.props;
        const cardContent = `
        <li>这个页面用来进行对实验的提问。</li>
      `
        return (
            <div>
                <CustomBreadcrumb arr={['实验功能', '实验提问']} />
                <TypingCard source={cardContent} />
                <Card title='实验提问'>
                    <div>
                        <QuestionAdd dispatch={dispatch} />
                    </div>
                    <div>
                        <QuestionList questionList={questionList} dispatch={dispatch}/>
                    </div>
                </Card>
            </div>
        )
    }
}

export default QuestionsDemo