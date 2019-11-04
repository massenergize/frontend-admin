/* eslint-disable camelcase */
import {
  LOAD_ALL_COMMUNITIES, LOAD_AUTH_ADMIN, LOAD_ID_TOKEN, SELECTED_COMMUNITY, SELECTED_COMMUNITY_FULL, GET_ALL_ACTIONS, GET_ALL_TAG_COLLECTIONS, GET_ALL_USERS, GET_ALL_COMMUNITY_EVENTS, GET_ALL_EVENTS, GET_ALL_TEAMS, GET_ALL_GOALS, GET_ALL_TESTIMONIALS, GET_ALL_VENDORS, GET_ALL_POLICIES
} from '../ReduxConstants';
import { apiCall, fetchData } from '../../utils/messenger';
import firebase from '../../containers/App/fire-config';
import { getTagCollectionsData } from '../../api/data';

export const loadAllPolicies = (data = null) => ({ type: GET_ALL_POLICIES, payload: data });
export const loadAllVendors = (data = null) => ({ type: GET_ALL_VENDORS, payload: data });
export const loadAllTestimonials = (data = null) => ({ type: GET_ALL_TESTIMONIALS, payload: data });
export const loadAllGoals = (data = null) => ({ type: GET_ALL_GOALS, payload: data });
export const loadAllTeams = (data = null) => ({ type: GET_ALL_TEAMS, payload: data });
export const loadAllEvents = (data = null) => ({ type: GET_ALL_EVENTS, payload: data });
export const loadAllUsers = (data) => ({ type: GET_ALL_USERS, payload: data });
export const loadAllTags = (data) => ({ type: GET_ALL_TAG_COLLECTIONS, payload: data });
export const loadAllActions = (data) => ({ type: GET_ALL_ACTIONS, payload: data });
export const reduxLoadIdToken = (token = null) => ({ type: LOAD_ID_TOKEN, payload: token });
export const reduxLoadAccessToken = (data = []) => ({ type: 'LOAD_ACCESS_TOKEN', payload: data });

const reduxLoadFullSelectedCommunity = (data = null) => ({ type: SELECTED_COMMUNITY_FULL, payload: data });
export const reduxLoadAllCommunities = (data = []) => ({ type: LOAD_ALL_COMMUNITIES, payload: data });
export const reduxSignOut = () => dispatch => {
  if (firebase) {
    firebase.auth().signOut().then(() => {
      window.location = '/login';
      localStorage.removeItem('authUser');
      localStorage.removeItem('idToken');
      dispatch({ type: LOAD_AUTH_ADMIN, payload: null });
    });
  }
};


export const reduxGetAllCommunityPolicies = (community_id) => dispatch => {
  apiCall('/policies.listForCommunityAdmin', { community_id }).then(response => {
    if (response && response.success) {
      dispatch(loadAllPolicies(response.data));
    }
    return { type: 'DO_NOTHING', payload: null };
  });
  return { type: 'DO_NOTHING', payload: null };
};

export const reduxGetAllCommunityVendors = (community_id) => dispatch => {
  apiCall('/vendors.listForCommunityAdmin', { community_id }).then(response => {
    if (response && response.success) {
      dispatch(loadAllVendors(response.data));
    }
    return { type: 'DO_NOTHING', payload: null };
  });
  return { type: 'DO_NOTHING', payload: null };
};

export const reduxGetAllCommunityTestimonials = (community_id) => dispatch => {
  apiCall('/testimonials.listForCommunityAdmin', { community_id }).then(response => {
    if (response && response.success) {
      dispatch(loadAllTestimonials(response.data));
    }
    return { type: 'DO_NOTHING', payload: null };
  });
  return { type: 'DO_NOTHING', payload: null };
};

export const reduxGetAllCommunityGoals = (community_id) => dispatch => {
  apiCall('/goals.listForCommunityAdmin', { community_id }).then(response => {
    if (response && response.success) {
      dispatch(loadAllGoals(response.data));
    }
    return { type: 'DO_NOTHING', payload: null };
  });
  return { type: 'DO_NOTHING', payload: null };
};

export const reduxGetAllCommunityTeams = (community_id) => dispatch => {
  apiCall('/teams.listForCommunityAdmin', { community_id }).then(response => {
    if (response && response.success) {
      dispatch(loadAllTeams(response.data));
    }
    return { type: 'DO_NOTHING', payload: null };
  });
  return { type: 'DO_NOTHING', payload: null };
};

export const reduxGetAllCommunityEvents = (community_id) => dispatch => {
  apiCall('/events.listForCommunityAdmin', { community_id }).then(response => {
    if (response && response.success) {
      dispatch(loadAllEvents(response.data));
    }
    return { type: 'DO_NOTHING', payload: null };
  });
  return { type: 'DO_NOTHING', payload: null };
};

export const reduxGetAllVendors = () => dispatch => {
  apiCall('/vendors.listForSuperAdmin').then(response => {
    if (response && response.success) {
      dispatch(loadAllVendors(response.data));
    }
    return { type: 'DO_NOTHING', payload: null };
  });
  return { type: 'DO_NOTHING', payload: null };
};

export const reduxGetAllGoals = () => dispatch => {
  apiCall('/goals.listForSuperAdmin').then(response => {
    if (response && response.success) {
      dispatch(loadAllGoals(response.data));
    }
    return { type: 'DO_NOTHING', payload: null };
  });
  return { type: 'DO_NOTHING', payload: null };
};

export const reduxGetAllTeams = () => dispatch => {
  apiCall('/teams.listForSuperAdmin').then(response => {
    if (response && response.success) {
      dispatch(loadAllTeams(response.data));
    }
    return { type: 'DO_NOTHING', payload: null };
  });
  return { type: 'DO_NOTHING', payload: null };
};

export const reduxGetAllPolicies = () => dispatch => {
  apiCall('/policies.listForSuperAdmin').then(response => {
    if (response && response.success) {
      dispatch(loadAllPolicies(response.data));
    }
    return { type: 'DO_NOTHING', payload: null };
  });
  return { type: 'DO_NOTHING', payload: null };
};

export const reduxGetAllEvents = () => dispatch => {
  apiCall('/events.listForSuperAdmin').then(response => {
    if (response && response.success) {
      dispatch(loadAllEvents(response.data));
    }
    return { type: 'DO_NOTHING', payload: null };
  });
  return { type: 'DO_NOTHING', payload: null };
};

export const reduxGetAllTestimonials = () => dispatch => {
  apiCall('/testimonials.listForSuperAdmin').then(response => {
    if (response && response.success) {
      dispatch(loadAllTestimonials(response.data));
    }
    return { type: 'DO_NOTHING', payload: null };
  });
  return { type: 'DO_NOTHING', payload: null };
};

export const reduxGetAllCommunityActions = (community_id) => dispatch => {
  apiCall('/actions.listForCommunityAdmin', { community_id }).then(response => {
    if (response && response.success) {
      dispatch(loadAllActions(response.data));
    }
    return { type: 'DO_NOTHING', payload: null };
  });
  return { type: 'DO_NOTHING', payload: null };
};

export const reduxGetAllUsers = () => dispatch => {
  fetchData('v2/users').then(response => {
    if (response && response.success) {
      dispatch(loadAllUsers(response.data));
    }
    return { type: 'DO_NOTHING', payload: null };
  });
  return { type: 'DO_NOTHING', payload: null };
};

export const reduxGetAllTags = () => dispatch => {
  getTagCollectionsData().then(response => {
    if (response && response.success) {
      dispatch(loadAllTags(response.data));
    }
    return { type: 'DO_NOTHING', payload: null };
  });
  return { type: 'DO_NOTHING', payload: null };
};

export const reduxGetAllActions = () => dispatch => {
  apiCall('/actions.listForSuperAdmin').then(response => {
    if (response && response.success) {
      dispatch(loadAllActions(response.data));
    }
    return { type: 'DO_NOTHING', payload: null };
  });
  return { type: 'DO_NOTHING', payload: null };
};


// try to put checkUser in a a more general area later
export const reduxCheckUser = () => {
  fetchData('/auth/whoami')
    .then(res => {
      if (!res.data) { // means the user token has expired, redirect to login
        localStorage.removeItem('idToken');
        localStorage.removeItem('authUser');
        window.location = '/login';
      }
      return { type: 'DO_NOTHING', payload: null };
    });
  return { type: 'DO_NOTHING', payload: null };
};

export const reduxIfExpired = (errorMsg) => {
  if (errorMsg === 'Signature has expired') {
    reduxSignOut();
  }
};

export const reduxCallCommunities = () => dispatch => {
  apiCall('/communities.listForCommunityAdmin').then(res => {
    if (res.data) {
      dispatch(reduxLoadAllCommunities(res.data));
    }
  });
};


export const reduxCallIdToken = () => dispatch => {
  firebase.auth().currentUser.getIdToken(true).then(token => {
    localStorage.setItem('idToken', token.toString());
    dispatch(reduxLoadIdToken(token));
  }).catch(err => {
    console.log(err);
  });
};

export const reduxCallFullCommunity = (id) => dispatch => {
  fetchData(`v2/community/${id}/full`).then(res => {
    dispatch(reduxLoadFullSelectedCommunity(res.data));
  });
};

export const reduxLiveOrNot = (community) => {
  const newCom = { ...community, is_published: !community.is_published };
  return reduxLoadFullSelectedCommunity(newCom);
};
export const reduxLoadSelectedCommunity = (data = null) => ({ type: SELECTED_COMMUNITY, payload: data });
export const reduxLoadAuthAdmin = (data = null) => {
  reduxCallCommunities();
  return { type: LOAD_AUTH_ADMIN, payload: data };
};
