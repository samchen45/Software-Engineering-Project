import React from 'react';

import classnames from 'classnames';
import {Map} from 'immutable';

// import {addAnswer} from '../public/action.js';
// import {addQuestionSonCount} from '../../question/action.js'
import "../AnswerList/css/answerList.css";
import '../public/css/style.css';

class AnswerAdd extends React.Component{

	constructor(props){
		super(props);

		this.state={	
			answer:''
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		console.log('AnswerAdd is render?' +(this.state.answer!==nextState.answer));
		return this.state.answer!==nextState.answer
	}

	//答案改变
    answerChange=(ev)=>{
    	this.setState({
    		answer:ev.target.value
    	})
    }

    //添加新答案
    submitAnswer=(ev)=>{
    	ev.preventDefault();//阻止默认提交
        const {pid}=this.props;
    	let answer=this.state.answer;   	 	
    	// //this.props.addAnswer(pid,answer);
    	// this.props.dispatch(addAnswer(pid,answer));
    	// this.props.dispatch(addQuestionSonCount(pid));
		$.ajax({
			type: 'POST',
			url: "/",
			data: {
				uid: this.state.id,
				answer: answer
			},
			success: function (data) {
				message.info("success");
				ret = JSON.parse(data)
				console.log("a_new")
				this.props.addAnswer(ret)
				this.setState({
					answer: ''
				})
			}.bind(this)
		})

    }

	render(){
		return(
			<div className={"write-answer-area"}>
				<div className={"caption"}>撰写答案</div>	
				<form onSubmit={this.submitAmswer}>
					<div className={"write-amswer"}>
						<textarea className={"width100"} name="answer"  rows="8" 
							onChange={this.answerChange} value={this.state.answer}
							placeholder="撰写答案"></textarea>
					</div>	
					<div className={"write-tool"}>
						<button className={classnames("btn","submit-answer-btn")} type="sbumit">提交答案</button>
					</div>	
				</form>		
			</div>
		)
	}
}

export default AnswerAdd;