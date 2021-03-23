import React from 'react';
import { Map, is } from 'immutable';
import classnames from "classnames";

import { addQuestion } from '../public/action.js';
// import * as mainStyles from '../public/style.less';
// import * as styles from './questionAdd.less';
import './css/questionAdd.css';
import '../public/css/style.css';


import { eventBus } from '../public/eventBus.js';

class QuestionAdd extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: Map({
                title: "", //标题
                substance: "", //内容
                hideQuestion: true //隐藏提示框
            })
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log(!is(this.state, nextState) ? "QuestionAdd is render" : "");
        return !is(this.state, nextState);
    }


    //显示提交问题
    showAddQuestion = () => {
        const { value } = this.state;
        this.setState({
            value: value.update("hideQuestion", pd => !pd)
        })
    }

    //隐藏提交问题
    hideAddQuestion = () => {

        this.setState({
            value: Map({
                title: "",//标题
                substance: "",//内容
                hideQuestion: true//隐藏提示框
            })
        })

    }


    //提交问题
    submitQuestion = (ev) => {
        ev.preventDefault();//阻止默认的提交
        const { value } = this.state;
        const title = this.state.value.get("title");
        const substance = this.state.value.get("substance");
        if (!title || !substance) {
            alert('不能为空！');
            return;
        }
        // this.props.dispatch(addQuestion(title, substance))

        // alert('成功');
        // 测试
        eventBus.pub("ansToQue", "updateTime", { dd: 110 }, () => {
            console.log("eventBus 执行 publish");
        })
        this.hideAddQuestion();

    }

    //标题改变
    titleChange = (event) => {
        const { value } = this.state;
        this.setState({
            value: value.update("title", val => event.target.value)
        })
    }

    //内容改变
    substanceChange = (event) => {
        const { value } = this.state;
        this.setState({
            value: value.update("substance", val => event.target.value)
        })
    }

    renderPanel() {
        const { value } = this.state;
        let displayStatus = "display-none";
        if (!value.get("hideQuestion")) {
            displayStatus = "display-block"
        }
        return (
            <div className="add-question-box">
                <div className={classnames("header-down-tool", "add-tool")}>
                    <a href="javascript:;" className={classnames("btn", "show-btn")} onClick={this.showAddQuestion}>添加问题</a>
                </div>
                <div className={classnames("question-add-parent", displayStatus)}>
                    <div className={classnames("question-add-area", "fadeIn")} >
                        <form onSubmit={this.submitQuestion}>
                            <h4>问题</h4>
                            <div className={classnames("add-title", "width100")}>
                                <input type="title" className={classnames("new-title", "width100")} placeholder="问题标题"
                                    onChange={this.titleChange} value={value.get("title")} />
                            </div>
                            <div className={"add-substance"}>
                                <textarea rows="5" className={classnames("new-substance", "width100")} placeholder="问题描述"
                                    onChange={this.substanceChange} value={value.get("substance")} />
                            </div>

                            <div className={"add-tools"}>
                                <button className={classnames("btn", "cancel-btn")} type="button" onClick={this.hideAddQuestion}>
                                    取消
				          		</button>
                                <button className={classnames("btn", "add-btn")} type="submit">
                                    确认
				          		</button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return this.renderPanel()
    }
}

export default QuestionAdd;