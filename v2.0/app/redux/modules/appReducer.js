import { Map, fromJS } from 'immutable';
import { START_UP } from '../../actions/actionConstants';
import { LOAD_ALL_COMMUNITIES,LOAD_AUTH_ADMIN,LOAD_AUTH_TOKEN,LOAD_ID_TOKEN, SELECTED_COMMUNITY, SELECTED_COMMUNITY_FULL} from './../ReduxConstants';

const initialState = Map({
  constants: {
    // API_HOST: 'http://127.0.0.1:8000',
    // API_HOST: 'http://api.massenergize.org',
  },
  profile: null
});


const initialImmutableState = fromJS(initialState);
export default function reducer(state = initialImmutableState, action = {}) {
  switch (action.type) {
    case START_UP:
      return state;
    default:
      return state;
  }
}

export const communitiesReducer = (state = null, action ={})=>{
  switch (action.type) {
    case LOAD_ALL_COMMUNITIES:
        return action.payload;
      return state;
  
    default:
      return state;
  }
}
export const authAdminReducer = (state = null, action ={})=>{
  switch (action.type) {
    case LOAD_AUTH_ADMIN:
        return action.payload;
      return state;
  
    default:
      return state;
  }
}
export const tokenReducer = (state = null, action ={})=>{
  switch (action.type) {
    case LOAD_ID_TOKEN:
        return action.payload;
      return state;
  
    default:
      return state;
  }
}
export const selectedCommunityReducer = (state = null, action ={})=>{
  switch (action.type) {
    case SELECTED_COMMUNITY:
        return action.payload;
      return state;
  
    default:
      return state;
  }
}
export const fullSelectedCommunityReducer = (state = null, action ={})=>{
  switch (action.type) {
    case SELECTED_COMMUNITY_FULL:
        return action.payload;
      return state;
  
    default:
      return state;
  }
}


export const allReducers = { 
  communities: communitiesReducer
}


