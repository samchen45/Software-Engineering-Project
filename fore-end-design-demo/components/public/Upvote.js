import React from 'react';

import {Map,is} from 'immutable';
import classnames from 'classnames';

import {changeQuestionUpvote} from './action.js';
import './css/style.css';
import './font-awesome/css/font-awesome.css'

class Upvote extends React.Component {

	changeQuestionUpvote(value, id, count) {
		// if(count>0 || value>0){
		// 	count+=value;
		// 	this.props.dispatch(changeQuestionUpvote(id,count));
		// }
	}
	render() {
		const { id, count } = this.props;
		return (
			<div>
				<div className={classnames("question-upvote", "upvote-item")}
					onClick={this.changeQuestionUpvote.bind(this, 1, id, count)}>
					{/* <span className={classnames(fontStyles["fa"],fontStyles["fa-chevron-up"])}></span> */}
					<span className={classnames("fa", "fa-chevron-up")}></span>
					<div>
						{count}
					</div>
				</div>

				<div className={classnames("question-downvote", "upvote-item")}
					onClick={this.changeQuestionUpvote.bind(this, -1, id, count)}>
					{/* <span className={classnames(fontStyles["fa"],fontStyles["fa-chevron-down"])}></span> */}
					<span className={classnames("fa", "fa-chevron-down")}></span>
				</div>
			</div>
		)
	}
}

export default Upvote;