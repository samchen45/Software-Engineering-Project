import React from 'react';
// import {connect} from 'react-redux';
// import { CSSTransitionGroup } from 'react-transition-group'

import {List,is} from 'immutable';
import classnames from 'classnames';
// import {sortAnswerList} from '../public/action;
import AnswerItem from '../AnswerItem/index';
import * as styles from "./css/answerList.less";

class AnswerList extends React.Component{

    shouldComponentUpdate(nextProps, nextState) {
        if(!is(nextProps.answerList,this.props.answerList) || nextProps.sort!==this.props.sort){
             console.log("answer list render!");
             return true
        }       
        return false;   
    }

    sortAnswerList(pd){
    	// let newSort=!this.props.sort;
    	// if(pd===newSort){ 	 
        //     this.props.dispatch(sortAnswerList(newSort))  	
    	// }
    }

    renderPanel(){        
        const {sort}=this.state;
        const {answerList} = this.props  
    	return(
    		<div className={styles["answer-list-area"]}>
                <div className={styles["caption-tool"]}>
                    <div className={styles["answer-caption"]}>{answerList.length}个回答</div>
                    {/* <div className={styles["filter-tool"]}>
                        <a href="javascript:;" className={classnames(styles["filter-item"],{[styles["active"]]:sort})}
                            onClick={this.sortAnswerList.bind(this,true)}>默认排序</a>
                        <a href="javascript:;" className={classnames(styles["filter-item"],{[styles["active"]]:!sort})}
                            onClick={this.sortAnswerList.bind(this,false)}>时间排序</a>
                    </div> */}
                </div>

                 {/* <CSSTransitionGroup key={sort}  className={styles["answer-list"]}
                    transitionName="leftMove" transitionEnterTimeout={300} transitionLeave={false}
                    transitionAppear={true} transitionAppearTimeout={300}> */}
                    <div>
                    {
                        answerList.map((item)=>{
                            return <AnswerItem key={item.id} answerValue={item} />
                        })
                    } 
                    </div>
                {/* </CSSTransitionGroup> */}


			</div>	
    	)
    }


	render(){
		return this.renderPanel() 				
	}
}

export default AnswerList;
