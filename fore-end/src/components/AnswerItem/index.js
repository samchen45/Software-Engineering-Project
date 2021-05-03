import React from 'react';
// import {connect} from 'react-redux';

import classnames from 'classnames';
import { is } from 'immutable';

// import GetDateDiff from '../../../util/GetDateDiff.js';
import "../AnswerList/css/answerList.css";
import '../public/css/style.css';
import '../public/font-awesome/css/font-awesome.css';
import moment from 'moment';

class AnswerItem extends React.Component {

    shouldComponentUpdate(nextProps, nextState) {
        if (!is(nextProps.answerValue, this.props.answerValue)) {
            console.log('AnswerItem id ' + this.props.answerValue.id + ' is rendered!');
            return true;
        }
        return false;
    }
    renderPanel() {
        const { answerValue } = this.props;
        return (
            <div className={"answer-item"}>
                <div className={"left-area"}>
                    {/*<div className={classnames("question-upvote", "upvote-item")}>
                        <span className={classnames("fa", "fa-chevron-up")}></span>
                        <div>
                            1
                        </div>
                    </div>

                    <div className={classnames("question-downvote", "upvote-item")}>
                        <span className={classnames("fa", "fa-chevron-down")}></span>
        </div>*/}
                    <div className={classnames("user-msg", "color82CCB0")}>
                        <a href="javascript:;" >
                            <span className={classnames("fa", "fa-user-circle-o")}></span>
                            <span className="user-name">{answerValue.author}</span>
                        </a>
                    </div>

                </div>
                <div className={"right-area"}>
                    <div className={"answer-content"}>{answerValue.content}</div>
                    <div className={"respondent-msg"}>
                        <div className={"answer-msg"}>
                            <span className={"msg-item"}>
                                {/* <span>{GetDateDiff(answerValue.get("timestamp"))}</span> */}
                                <span>{answerValue.datetime}</span>
                                {/*<span> 回答  </span>
                            </span>
                            <span className={"msg-item"}>
                                <span className={classnames("fa", "fa", "fa-cny", "pdr5px")}></span>
                                <span>赞赏</span>
                                </span>*/}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return this.renderPanel()
    }

}

export default AnswerItem;