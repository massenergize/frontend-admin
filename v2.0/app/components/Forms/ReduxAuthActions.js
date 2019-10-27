import {apiCall } from './../../utils/messenger';
//set up whole auth system with redux later
export const redLoadUser =(data)=>{

  return {type: "LOAD_AUTHENTICATED_USER",payload:data}
} 
