
import React from 'react';
//import {connect} from 'react-redux';
import { Link } from 'react-router-dom';

import classnames from "classnames";
import {Map,is} from 'immutable';
import moment from 'moment';

//import GetDateDiff from '../../../util/GetDateDiff.js';

import {changeQuestionUpvote} from '../public/action';
import "../QuestionList/css/questionList.css";
import '../public/css/style.css';
import '../public/font-awesome/css/font-awesome.css'
 
class QuestionItem extends React.Component {
    shouldComponentUpdate(nextProps, nextState){
        //console.log(is(this.state.stateMap,nextState.stateMap));
        if(!is(this.props.value,nextProps.value)){
            console.log('question item id '+this.props.value.id+' is rendered!');
            return true;       
        }       
        return false;          
    }
    //踩 or 赞
    changeQuestionUpvote(num){
        const {value,dispatch}=this.props;
        let count=value.upvote;
        if(count>0 || num>0){
            count+=num;
            this.props.dispatch(changeQuestionUpvote(value.id,count));//根据id修改数据中的点赞数
        }
    }

    renderPanel(){
        const {value}=this.props;
        return(
            <div className="question-show-content">
                
                <div className="left-area">
                    <div className="user-msg">
                        <div className={classnames("fa","fa-user-circle-o","fa-3x","user-pic")}></div>
                        <div className="user-name">LikeLit</div>
                    </div>
                        
                </div>
                <div className={classnames("right-area","width100")} >
                    <div className="question-title">
                        <Link to={{
                              pathname: '/home/display/questions/detail',
                              id: value.id
                            }}>{value.title}
                        </Link>
                    </div>
                    <div className="question-substance">{value.substance}</div>
                    <div className="question-msg">
                        <div className="question-tool">                                                          
                            <div className="question-item">
                                {/*GetDateDiff(value.get("subtime"))*/}
                                {moment().fromNow()}
                            </div>
                            <div className="dot">·</div>
                            <div className="question-item">
                                <span className={classnames("fa","fa-comments-o","fa-mrgr")}></span>
                                <span>{value.answerCount}</span>
                            </div>
                            
                        </div>
                        <div className="upvote-tool">
                            <div className="up-vote">
                                <a href="javascript:;" onClick={this.changeQuestionUpvote.bind(this,1)}>
                                    <span className={classnames("fa","fa-thumbs-o-up")}></span>
                                </a>
                            </div>  
                            <div className="dot">·</div>
                            <div className="upvote-count">{value.upvote}</div>
                            <div className="dot">·</div>
                            <div className="down-vote">
                                <a href="javascript:;" onClick={this.changeQuestionUpvote.bind(this,-1)}>
                                    <span className={classnames("fa","fa-thumbs-o-down")}></span>
                                </a>
                            </div>           
                        </div>
                    </div>
                    
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className={classnames("questionItem")}>
                {this.renderPanel()}
            </div>
        )
    }
}
export default QuestionItem
