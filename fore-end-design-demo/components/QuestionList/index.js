import React from 'react';

import classnames from "classnames";
import {List,Map,is} from 'immutable';

import QuestionItem from '../QuestionItem/index';
import "./css/questionList.css";

class QuestionList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questionList: [
                {
                    id: 114514,
                    title: "标题",
                    substance: "内容",
                    answerCount: 5,
                    upvote: 1919,
                },
            ]
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!is(this.props.questionList, nextProps.questionList)) {
            console.log(" question list render !");
            return true;
        }

        return false;
    }

    render() {
        const { dispatch } = this.props;
        const { questionList } = this.state;
        
        return (
            <div className="question-list"
                transitionName="upMove" transitionEnterTimeout={300} transitionLeaveTimeout={300}
                transitionAppear={true} transitionAppearTimeout={300}>
                {
                    questionList.map((item) => {
                        return <QuestionItem
                            key={item.id}
                            value={item}
                            dispatch={dispatch}
                        />
                    })
                }

            </div>
        )
    }
}
export default QuestionList;