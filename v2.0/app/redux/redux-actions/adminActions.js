import { v3AllCommunities } from './../../../app/containers/Pages/CustomPages/DataRetriever';
import { LOAD_ACCESS_TOKEN, LOAD_ALL_COMMUNITIES, LOAD_AUTH_ADMIN, LOAD_ID_TOKEN, SELECTED_COMMUNITY, SELECTED_COMMUNITY_FULL, AUTH_SIGN_OUT, GET_ALL_ACTIONS, GET_ALL_TAG_COLLECTIONS, GET_ALL_USERS } from './../ReduxConstants';
import { apiCall, fetchData } from './../../utils/messenger';
import firebase from './../../containers/App/fire-config';
import { getTestimonialsData, getTagCollectionsData } from '../../api/data';



export const reduxGetAllUsers= () => {
  return dispatch => {
    fetchData("v2/users").then(response => {
      if (response && response.success) {
        dispatch(loadAllUsers(response.data));
      }
      return { type: "DO_NOTHING", payload: null };

    });
    return { type: "DO_NOTHING", payload: null };
  }
}
export const reduxGetAllTags= () => {
  return dispatch => {
    getTagCollectionsData().then(response => {
      if (response && response.success) {
        dispatch(loadAllTags(response.data));
      }
      return { type: "DO_NOTHING", payload: null };

    });
    return { type: "DO_NOTHING", payload: null };
  }
}

export const reduxGetAllActions = () => {
  return dispatch => {
    apiCall('/actions.listForSuperAdmin').then(response => {
      if (response && response.success) {
        dispatch(loadAllActions(response.data));
      }
      return { type: "DO_NOTHING", payload: null };

    });
    return { type: "DO_NOTHING", payload: null };
  }
}

export const loadAllUsers = (data) => {
  return { type: GET_ALL_USERS, payload: data };
}
export const loadAllTags = (data) => {
  return { type: GET_ALL_TAG_COLLECTIONS, payload: data };
}
export const loadAllActions = (data) => {
  return { type: GET_ALL_ACTIONS, payload: data };
}
//try to put checkUser in a a more general area later
export const reduxCheckUser = () => {
  fetchData("/auth/whoami")
    .then(res => {
      if (!res.data) { //means the user token has expired, redirect to login
        console.log("treating me right")
        localStorage.removeItem("idToken");
        localStorage.removeItem("authUser");
        window.location = "/login";
      }
      return { type: "DO_NOTHING", payload: null }
    });
  return { type: "DO_NOTHING", payload: null }
}
export const reduxIfExpired = (errorMsg) => {
  if (errroMsg === "Signature has expired") {
    reduxSignOut();
  }
}
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

export const reduxCallFullCommunity = (id) => {
  return dispatch => {
    fetchData(`v2/community/${id}/full`).then(res => {
      dispatch(reduxLoadFullSelectedCommunity(res.data));
    });

  }
}

export const reduxLiveOrNot = (community) => {
  const newCom = { ...community, is_published: !community.is_published }
  return reduxLoadFullSelectedCommunity(newCom);
}
export const reduxLoadSelectedCommunity = (data = null) => {
  return { type: SELECTED_COMMUNITY, payload: data }
}

const reduxLoadFullSelectedCommunity = (data = null) => {
  return { type: SELECTED_COMMUNITY_FULL, payload: data }
}
export const reduxLoadAllCommunities = (data = []) => {
  return { type: LOAD_ALL_COMMUNITIES, payload: data }
}
export const reduxSignOut = () => {
  return dispatch => {
    if (firebase) {
      firebase.auth().signOut().then(() => {
        localStorage.removeItem("authUser");
        localStorage.removeItem('idToken');
        dispatch({ type: LOAD_AUTH_ADMIN, payload: null });
      })
    }
  }
}
export const reduxLoadAuthAdmin = (data = null) => {
  reduxCallCommunities();
  return { type: LOAD_AUTH_ADMIN, payload: data };

}
export const reduxLoadIdToken = (token = null) => {
  return { type: LOAD_ID_TOKEN, payload: token }
}
export const reduxLoadAccessToken = (data = []) => {
  return { type: "LOAD_ACCESS_TOKEN", payload: data }
}

