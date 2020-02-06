import * as types from '../../actions/adminActionConstants.js';

export default function summaryReducer(state = [], action ={}){
  switch(action.type){
    case types.SET_SUMMARY: 
      return action.value
    default: 
     return state;
  }

}