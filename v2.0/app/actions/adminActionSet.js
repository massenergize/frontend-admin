import * as types from './adminActionConstants';
import { fetchData } from './../utils/messenger';

 export const sendSetSummaryToReducer =(data)=>{
  return {type: types.SET_SUMMARY,action:data}
}

export const getAllSummaryAction =()=>{
  return dispatch =>{
    const data = fechData('v2/users') 
    .then( res => {
      console.log("I am in the action",res);
    })
  }
}