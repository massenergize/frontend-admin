import { v3AllCommunities } from './../../../app/containers/Pages/CustomPages/DataRetriever';
import { LOAD_ACCESS_TOKEN, LOAD_ALL_COMMUNITIES, LOAD_AUTH_ADMIN, LOAD_ID_TOKEN, SELECTED_COMMUNITY } from './../ReduxConstants';
import { apiCall } from './../../utils/messenger';
import firebase from './../../containers/App/fire-config';
export const reduxCallCommunities = () => {
  return dispatch => {
    apiCall('/communities.list').then(res => {
      if (res.data) {
        dispatch(reduxLoadAllCommunities(res.data))
      }
    })
  }
}
export const reduxCallIdToken = () => {
  return dispatch => {
      firebase.auth().currentUser.getIdToken(true).then(token => {
        localStorage.setItem('idToken', token.toString());
        dispatch(reduxLoadIdToken(token))
      }).catch(err => {
        console.log(err);
      })
    
  }
}
export const reduxLoadSelectedCommunity = (data =null) => {
  return { type: SELECTED_COMMUNITY, payload: data }
}
export const reduxLoadAllCommunities = (data = []) => {
  return { type: LOAD_ALL_COMMUNITIES, payload: data }
}
export const reduxLoadAuthAdmin = (data = null) => {
  return { type: LOAD_AUTH_ADMIN, payload: data }
}
export const reduxLoadIdToken = (token = null) => {
  return { type: LOAD_ID_TOKEN, payload: token }
}
export const reduxLoadAccessToken = (data = []) => {
  return { type: "LOAD_ACCESS_TOKEN", payload: data }
}

