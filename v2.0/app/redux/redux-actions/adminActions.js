/* eslint-disable camelcase */
import firebase from 'firebase/app';
import 'firebase/auth';
import {
  LOAD_ALL_COMMUNITIES, LOAD_GRAPH_DATA, LOAD_AUTH_ADMIN, LOAD_ID_TOKEN, SELECTED_COMMUNITY, SELECTED_COMMUNITY_FULL, GET_ALL_ACTIONS, GET_ALL_TAG_COLLECTIONS, GET_ALL_USERS, GET_ALL_SUBSCRIBERS, GET_ALL_EVENTS, GET_ALL_TEAMS, GET_ALL_GOALS, GET_ALL_TESTIMONIALS, GET_ALL_VENDORS, GET_ALL_POLICIES, LOAD_SUMMARY_DATA
} from '../ReduxConstants';
import { apiCall } from '../../utils/messenger';
import { getTagCollectionsData } from '../../api/data';

export const loadAllPolicies = (data = null) => ({ type: GET_ALL_POLICIES, payload: data });
export const loadAllVendors = (data = null) => ({ type: GET_ALL_VENDORS, payload: data });
export const loadAllTestimonials = (data = null) => ({ type: GET_ALL_TESTIMONIALS, payload: data });
export const loadAllGoals = (data = null) => ({ type: GET_ALL_GOALS, payload: data });
export const loadAllTeams = (data = null) => ({ type: GET_ALL_TEAMS, payload: data });
export const loadAllEvents = (data = null) => ({ type: GET_ALL_EVENTS, payload: data });
export const loadAllUsers = (data) => ({ type: GET_ALL_USERS, payload: data });
export const loadAllSubscribers = (data) => ({ type: GET_ALL_SUBSCRIBERS, payload: data });
export const loadAllTags = (data) => ({ type: GET_ALL_TAG_COLLECTIONS, payload: data });
export const loadAllActions = (data) => ({ type: GET_ALL_ACTIONS, payload: data });
export const reduxLoadIdToken = (token = null) => ({ type: LOAD_ID_TOKEN, payload: token });
export const reduxLoadAccessToken = (data = []) => ({ type: 'LOAD_ACCESS_TOKEN', payload: data });


function redirectIfExpired(response) {
  if (!response.data && response.error === 'session_expired') {
    window.location = '/login';
    localStorage.removeItem('authUser');
    localStorage.removeItem('idToken');
  }
}

const reduxLoadFullSelectedCommunity = (data = null) => ({ type: SELECTED_COMMUNITY_FULL, payload: data });
export const reduxLoadAllCommunities = (data = []) => ({ type: LOAD_ALL_COMMUNITIES, payload: data });
export const reduxLoadSummaryData = (data = []) => ({ type: LOAD_SUMMARY_DATA, payload: data });
export const reduxLoadGraphData = (data = []) => ({ type: LOAD_GRAPH_DATA, payload: data });
export const reduxSignOut = () => dispatch => {
  if (firebase) {
    firebase.auth().signOut().then(() => {
      window.location = '/login';
      localStorage.removeItem('authUser');
      localStorage.removeItem('idToken');
      dispatch({ type: LOAD_AUTH_ADMIN, payload: null });
    });

    apiCall('/auth.logout').then(() => {
      console.log('Signed Out');
    });
  }
};


export const reduxGetAllCommunityPolicies = (community_id) => dispatch => {
  apiCall('/policies.listForCommunityAdmin', { community_id }).then(response => {
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllPolicies(response.data));
    }
    return { type: 'DO_NOTHING', payload: null };
  });
  return { type: 'DO_NOTHING', payload: null };
};

export const reduxGetAllCommunityVendors = (community_id) => dispatch => {
  apiCall('/vendors.listForCommunityAdmin', { community_id }).then(response => {
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllVendors(response.data));
    }
    return { type: 'DO_NOTHING', payload: null };
  });
  return { type: 'DO_NOTHING', payload: null };
};

export const reduxGetAllCommunityTestimonials = (community_id) => dispatch => {
  apiCall('/testimonials.listForCommunityAdmin', { community_id }).then(response => {
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllTestimonials(response.data));
    }
    return { type: 'DO_NOTHING', payload: null };
  });
  return { type: 'DO_NOTHING', payload: null };
};

export const reduxGetAllCommunityGoals = (community_id) => dispatch => {
  apiCall('/goals.listForCommunityAdmin', { community_id }).then(response => {
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllGoals(response.data));
    }
    return { type: 'DO_NOTHING', payload: null };
  });
  return { type: 'DO_NOTHING', payload: null };
};

export const reduxGetAllCommunityTeams = (community_id) => dispatch => {
  apiCall('/teams.listForCommunityAdmin', { community_id }).then(response => {
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllTeams(response.data));
    }
    return { type: 'DO_NOTHING', payload: null };
  });
  return { type: 'DO_NOTHING', payload: null };
};

export const reduxGetAllCommunityUsers = (community_id) => dispatch => {
  apiCall('/users.listForCommunityAdmin', { community_id }).then(response => {
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllTeams(response.data));
    }
    return { type: 'DO_NOTHING', payload: null };
  });
  return { type: 'DO_NOTHING', payload: null };
};

export const reduxGetAllCommunityEvents = (community_id) => dispatch => {
  apiCall('/events.listForCommunityAdmin', { community_id }).then(response => {
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllEvents(response.data));
    }
    return { type: 'DO_NOTHING', payload: null };
  });
  return { type: 'DO_NOTHING', payload: null };
};

export const reduxGetAllVendors = () => dispatch => {
  apiCall('/vendors.listForCommunityAdmin').then(response => {
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllVendors(response.data));
    }
    return { type: 'DO_NOTHING', payload: null };
  });
  return { type: 'DO_NOTHING', payload: null };
};

export const reduxGetAllGoals = () => dispatch => {
  apiCall('/goals.listForCommunityAdmin').then(response => {
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllGoals(response.data));
    }
    return { type: 'DO_NOTHING', payload: null };
  });
  return { type: 'DO_NOTHING', payload: null };
};

export const reduxGetAllTeams = () => dispatch => {
  apiCall('/teams.listForCommunityAdmin').then(response => {
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllTeams(response.data));
    }
    return { type: 'DO_NOTHING', payload: null };
  });
  return { type: 'DO_NOTHING', payload: null };
};

export const reduxGetAllPolicies = () => dispatch => {
  apiCall('/policies.listForCommunityAdmin').then(response => {
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllPolicies(response.data));
    }
    return { type: 'DO_NOTHING', payload: null };
  });
  return { type: 'DO_NOTHING', payload: null };
};

export const reduxGetAllEvents = () => dispatch => {
  apiCall('/events.listForCommunityAdmin').then(response => {
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllEvents(response.data));
    }
    return { type: 'DO_NOTHING', payload: null };
  });
  return { type: 'DO_NOTHING', payload: null };
};

export const reduxGetAllUsers = () => dispatch => {
  apiCall('/users.listForCommunityAdmin').then(response => {
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllUsers(response.data));
    }
    return { type: 'DO_NOTHING', payload: null };
  });
  return { type: 'DO_NOTHING', payload: null };
};

export const reduxGetAllTestimonials = () => dispatch => {
  apiCall('/testimonials.listForCommunityAdmin').then(response => {
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllTestimonials(response.data));
    }
    return { type: 'DO_NOTHING', payload: null };
  });
  return { type: 'DO_NOTHING', payload: null };
};

export const reduxGetAllCommunityActions = (community_id) => dispatch => {
  apiCall('/actions.listForCommunityAdmin', { community_id }).then(response => {
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllActions(response.data));
    }
    return { type: 'DO_NOTHING', payload: null };
  });
  return { type: 'DO_NOTHING', payload: null };
};


export const reduxGetAllTags = () => dispatch => {
  getTagCollectionsData().then(response => {
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllTags(response.data));
    }
    return { type: 'DO_NOTHING', payload: null };
  });
  return { type: 'DO_NOTHING', payload: null };
};

export const reduxGetAllActions = () => dispatch => {
  apiCall('/actions.listForCommunityAdmin').then(response => {
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllActions(response.data));
    }
    return { type: 'DO_NOTHING', payload: null };
  });
  return { type: 'DO_NOTHING', payload: null };
};


// try to put checkUser in a a more general area later
export const reduxCheckUser = () => {
  apiCall('/auth.whoami')
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
  Promise.all([
    apiCall('/communities.listForCommunityAdmin'),
    apiCall('/summary.listForCommunityAdmin'),
    apiCall('/graphs.listForCommunityAdmin')
  ]).then(res => {
    const [commResponse, summaryResponse, graphResponse] = res;
    if (commResponse.data) {
      dispatch(reduxLoadAllCommunities(commResponse.data));
    }
    if (summaryResponse.data) {
      dispatch(reduxLoadSummaryData(summaryResponse.data));
    }
    if (graphResponse.data) {
      dispatch(reduxLoadGraphData(graphResponse.data));
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
  apiCall('/communities.info', { community_id: id }).then(res => {
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
