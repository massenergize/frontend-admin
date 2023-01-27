/* eslint-disable camelcase */
import firebase from "firebase/app";
import "firebase/auth";
import {
  LOAD_ALL_COMMUNITIES,
  LOAD_GRAPH_DATA,
  LOAD_AUTH_ADMIN,
  LOAD_ID_TOKEN,
  SELECTED_COMMUNITY,
  SELECTED_COMMUNITY_FULL,
  GET_ALL_ACTIONS,
  GET_ALL_TAG_COLLECTIONS,
  GET_ALL_USERS,
  GET_ALL_SUBSCRIBERS,
  GET_ALL_EVENTS,
  GET_ALL_TEAMS,
  GET_ALL_GOALS,
  GET_ALL_TESTIMONIALS,
  GET_ALL_VENDORS,
  GET_ALL_POLICIES,
  LOAD_SUMMARY_DATA,
  LOAD_GALLERY_IMAGES,
  LOAD_SEARCHED_IMAGES,
  KEEP_LOADED_IMAGE_INFO,
  LOAD_MODAL_LIBRARY,
  GET_ADMIN_MESSAGES,
  GET_TEAM_MESSAGES,
  UPDATE_HEAP,
  LOAD_CC_ACTIONS,
  TOGGLE_UNIVERSAL_MODAL,
  TEST_REDUX,
  LOAD_ALL_TASK_FUNCTIONS,
  LOAD_ALL_TASKS,
  LOAD_SETTINGS,
  LOAD_FEATURE_FLAGS,
  LOAD_ADMIN_ACTIVITIES,
  ADD_NEW_FEATURE_FLAG_INFO,
  SET_GALLERY_FILTERS,
  LOAD_ADMINS_FOR_MY_COMMUNITY,
  LOAD_SUPER_ADMIN_LIST,
  LOAD_ALL_OTHER_COMMUNITIES,
  LOAD_ALL_OTHER_EVENTS,
  SAVE_OTHER_EVENT_STATES,
  LOAD_ADMIN_NEXT_STEPS_SUMMARY,
} from "../ReduxConstants";
import { apiCall, PERMISSION_DENIED } from "../../utils/messenger";
import { getTagCollectionsData } from "../../api/data";
import { LOADING } from "../../utils/constants";

// TODO: REOMVE THIS FUNCTiON
export const testRedux = (value) => {
  return { type: TEST_REDUX, payload: value };
};

export const runAdminStatusCheck = async () => {
  try {
    const response = await apiCall("/auth.whoami");
    if (response.success) return;

    if (response.error === PERMISSION_DENIED)
      return (window.location = "/login");
  } catch (e) {
    console.log("ADMIN_SESSION_STATUS_ERROR:", e.toString());
    return (window.location = "/login");
  }
};

export const fetchLatestNextSteps = (cb) => (dispatch) => {
  apiCall("/summary.next.steps.forAdmins").then((response) => {
    cb && cb(response); // Just in case a scenario needs to know when the request is done....
    if (!response.success)
      return console.log("Could not load in next steps", response);
    console.log("I have just loaded in more next steps innit", response);
    dispatch(reduxLoadNextStepsSummary(response.data));
  });
};

export const checkFirebaseAuthentication = () => {
  return () =>
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) return (window.location = "/login");
      runAdminStatusCheck();
    });
};
export const loadSettings = (data = {}) => {
  return {
    type: LOAD_SETTINGS,
    payload: data,
  };
};
export const reduxSetGalleryFilters = (data = {}) => {
  return {
    type: SET_GALLERY_FILTERS,
    payload: data,
  };
};
export const reduxLoadSuperAdmins = (data = LOADING) => {
  return {
    type: LOAD_SUPER_ADMIN_LIST,
    payload: data,
  };
};
export const reduxLoadAdmins = (data = LOADING) => {
  return {
    type: LOAD_ADMINS_FOR_MY_COMMUNITY,
    payload: data,
  };
};

export const reduxFetchInitialContent = (auth) => (dispatch) => {
  if (!auth) return;
  const isSuperAdmin = auth && auth.is_super_admin;
  Promise.all([
    apiCall(
      isSuperAdmin
        ? "/communities.listForSuperAdmin"
        : "/communities.listForCommunityAdmin"
    ),
    apiCall(
      isSuperAdmin
        ? "/actions.listForSuperAdmin"
        : "/actions.listForCommunityAdmin"
    ),
    apiCall(
      isSuperAdmin
        ? "/events.listForSuperAdmin"
        : "/events.listForCommunityAdmin"
    ),
    apiCall("/messages.listForCommunityAdmin"),
    apiCall("/messages.listTeamAdminMessages"),
    apiCall(
      isSuperAdmin ? "/teams.listForSuperAdmin" : "/teams.listForCommunityAdmin"
    ),
    apiCall(
      isSuperAdmin
        ? "/subscribers.listForSuperAdmin"
        : "/subscribers.listForCommunityAdmin"
    ),
    apiCall(
      isSuperAdmin
        ? "/testimonials.listForSuperAdmin"
        : "/testimonials.listForCommunityAdmin"
    ),
    apiCall(
      isSuperAdmin ? "/users.listForSuperAdmin" : "/users.listForCommunityAdmin"
    ),
    apiCall(
      isSuperAdmin
        ? "/vendors.listForSuperAdmin"
        : "/vendors.listForCommunityAdmin"
    ),
    apiCall("/cc/info/actions"),
    apiCall(
      isSuperAdmin
        ? "/tag_collections.listForSuperAdmin"
        : "/tag_collections.listForCommunityAdmin"
    ),
    apiCall("/gallery.search", {
      any_community: true,
      filters: ["uploads", "actions", "events", "testimonials"],
      target_communities: [],
    }),
    isSuperAdmin && apiCall("/tasks.functions.list"),
    isSuperAdmin && apiCall("/tasks.list"),
    apiCall("/settings.list"),
    isSuperAdmin && apiCall("/featureFlags.listForSuperAdmins"),
    apiCall("/communities.others.listForCommunityAdmin"),
    apiCall("/summary.next.steps.forAdmins"),
  ]).then((response) => {
    const [
      communities,
      actions,
      events,
      messages,
      teamMessages,
      teams,
      subscribers,
      testimonials,
      users,
      vendors,
      ccActions,
      tagCollections,
      galleryImages,
      tasksFunctions,
      tasks,
      settings,
      featureFlags,
      otherCommunities,
      adminNextSteps,
    ] = response;
    dispatch(reduxLoadAllCommunities(communities.data));
    dispatch(loadAllActions(actions.data));
    dispatch(loadAllEvents(events.data));
    dispatch(loadAllAdminMessages(messages.data));
    dispatch(loadTeamMessages(teamMessages.data));
    dispatch(loadAllTeams(teams.data));
    dispatch(loadAllSubscribers(subscribers.data));
    dispatch(loadAllTestimonials(testimonials.data));
    dispatch(loadAllUsers(users.data));
    dispatch(loadAllVendors(vendors.data));
    dispatch(reduxLoadCCActions(ccActions.data.actions));
    dispatch(loadAllTags(tagCollections.data));
    dispatch(reduxLoadGalleryImages({ data: galleryImages.data }));
    dispatch(loadTaskFunctionsAction(tasksFunctions.data));
    dispatch(loadTasksAction(tasks.data));
    dispatch(loadSettings(settings.data || {}));
    dispatch(loadFeatureFlags(featureFlags.data || {}));
    dispatch(reduxLoadAllOtherCommunities(otherCommunities.data));
    dispatch(reduxLoadNextStepsSummary(adminNextSteps.data));
  });
};

export const reduxLoadNextStepsSummary = (data = {}) => ({
  type: LOAD_ADMIN_NEXT_STEPS_SUMMARY,
  payload: data,
});
export const reduxSaveOtherEventState = (data = {}) => ({
  type: SAVE_OTHER_EVENT_STATES,
  payload: data,
});
export const reduxLoadAllOtherEvents = (data = []) => ({
  type: LOAD_ALL_OTHER_EVENTS,
  payload: data,
});
export const reduxLoadAllOtherCommunities = (data = []) => ({
  type: LOAD_ALL_OTHER_COMMUNITIES,
  payload: data,
});

export const reduxAddFlagInfo = (data = {}) => ({
  type: ADD_NEW_FEATURE_FLAG_INFO,
  payload: data,
});

export const loadFeatureFlags = (data = LOADING) => ({
  type: LOAD_FEATURE_FLAGS,
  payload: data,
});
export const reduxToggleUniversalModal = (data = {}) => ({
  type: TOGGLE_UNIVERSAL_MODAL,
  payload: data,
});
export const reduxLoadCCActions = (data = []) => ({
  type: LOAD_CC_ACTIONS,
  payload: data,
});
export const reduxAddToHeap = (data = {}) => (dispatch, getState) => {
  const heap = getState().heap || {};
  dispatch({
    type: UPDATE_HEAP,
    payload: { ...heap, ...data },
  });
};
export const reduxUpdateHeap = (heap = {}) => ({
  type: UPDATE_HEAP,
  payload: heap,
});
export const reduxLoadGalleryImages = ({
  data = {},
  old = {},
  append = false,
  prepend = false,
}) => {
  var images;
  if (append) {
    if (prepend) images = [...data.images, ...((old && old.images) || [])];
    else images = [...((old && old.images) || []), ...data.images];
  } else images = data.images;

  var upper_limit = data.upper_limit;
  var lower_limit = data.lower_limit;
  if (old.upper_limit)
    upper_limit = Math.max(data.upper_limit || 0, old.upper_limit || 0);
  if (old.lower_limit)
    lower_limit = Math.min(data.lower_limit || 0, old.lower_limit || 0);
  return {
    type: LOAD_GALLERY_IMAGES,
    payload: { images, upper_limit, lower_limit },
  };
};

export const loadTeamMessages = (data = null) => ({
  type: GET_TEAM_MESSAGES,
  payload: data,
});
export const loadAllAdminMessages = (data = null) => ({
  type: GET_ADMIN_MESSAGES,
  payload: data,
});
export const loadAllPolicies = (data = null) => ({
  type: GET_ALL_POLICIES,
  payload: data,
});
export const loadAllVendors = (data = null) => ({
  type: GET_ALL_VENDORS,
  payload: data,
});
export const loadAllTestimonials = (data = null) => ({
  type: GET_ALL_TESTIMONIALS,
  payload: data,
});
export const loadAllGoals = (data = null) => ({
  type: GET_ALL_GOALS,
  payload: data,
});
export const loadAllTeams = (data = null) => ({
  type: GET_ALL_TEAMS,
  payload: data,
});
export const loadAllEvents = (data = null) => ({
  type: GET_ALL_EVENTS,
  payload: data,
});
export const fetchUsersFromBackend = (cb) => (dispatch) => {
  apiCall("/users.listForCommunityAdmin").then((allUsersResponse) => {
    cb && cb(allUsersResponse.data, !allUsersResponse.success);
    if (allUsersResponse && allUsersResponse.success) {
      dispatch(loadAllUsers(allUsersResponse.data));
    }
  });
};
export const loadAllUsers = (data) => ({ type: GET_ALL_USERS, payload: data });
export const loadAllSubscribers = (data) => ({
  type: GET_ALL_SUBSCRIBERS,
  payload: data,
});
export const loadAllTags = (data) => ({
  type: GET_ALL_TAG_COLLECTIONS,
  payload: data,
});
export const loadAllActions = (data) => ({
  type: GET_ALL_ACTIONS,
  payload: data,
});
export const reduxLoadIdToken = (token = null) => ({
  type: LOAD_ID_TOKEN,
  payload: token,
});
export const reduxLoadAccessToken = (data = []) => ({
  type: "LOAD_ACCESS_TOKEN",
  payload: data,
});
export const reduxLoadImageInfos = ({ oldInfos, newInfo }) => ({
  type: KEEP_LOADED_IMAGE_INFO,
  payload: { ...(oldInfos || {}), [newInfo.id]: newInfo },
});

export const reduxLoadSearchedImages = ({ data, old, append = true }) => {
  var images;
  if (append) images = [...((old && old.images) || []), ...data.images];
  else images = data.images;
  var upper_limit = data.upper_limit;
  var lower_limit = data.lower_limit;
  if (old.upper_limit)
    upper_limit = Math.max(data.upper_limit || 0, old.upper_limit || 0);
  if (old.lower_limit)
    lower_limit = Math.min(data.lower_limit || 0, old.lower_limit || 0);
  return {
    type: LOAD_SEARCHED_IMAGES,
    payload: { images, upper_limit, lower_limit },
  };
};

function redirectIfExpired(response) {
  if (!response.data && response.error === "session_expired") {
    window.location = "/login";
    localStorage.removeItem("authUser");
    localStorage.removeItem("idToken");
  }
}

const reduxLoadFullSelectedCommunity = (data = null) => ({
  type: SELECTED_COMMUNITY_FULL,
  payload: data,
});
export const reduxLoadAllCommunities = (data = []) => ({
  type: LOAD_ALL_COMMUNITIES,
  payload: data,
});
export const reduxLoadSummaryData = (data = []) => ({
  type: LOAD_SUMMARY_DATA,
  payload: data,
});
export const reduxLoadGraphData = (data = []) => ({
  type: LOAD_GRAPH_DATA,
  payload: data,
});
export const reduxLoadAdminActivities = (data = LOADING) => ({
  type: LOAD_ADMIN_ACTIVITIES,
  payload: data,
});

export const reduxFetchImages = (community_ids = [], callback) => {
  apiCall("gallery.fetch", { community_ids })
    .then((response) => {
      if (!response.success)
        console.log("GALLERY_FETCH_ERROR:", response.error);
      if (callback) callback(response.data || []);
    })
    .catch((e) => console.log("GALLERY_FETCH_ERROR:", e.toString()));
};

export const reduxSignOut = () => (dispatch) => {
  if (firebase) {
    firebase
      .auth()
      .signOut()
      .then(() => {
        window.location = "/login";
        localStorage.removeItem("authUser");
        localStorage.removeItem("idToken");
        dispatch({ type: LOAD_AUTH_ADMIN, payload: null });
      });

    apiCall("/auth.logout").then(() => {
      console.log("Signed Out");
    });
  }
};

export const reduxGetAllCommunityPolicies = (community_id) => (dispatch) => {
  apiCall("/policies.listForCommunityAdmin", { community_id }).then(
    (response) => {
      if (response && response.success) {
        redirectIfExpired(response);
        dispatch(loadAllPolicies(response.data));
      }
      return { type: "DO_NOTHING", payload: null };
    }
  );
  return { type: "DO_NOTHING", payload: null };
};

export const reduxGetAllCommunityVendors = (community_id) => (dispatch) => {
  apiCall("/vendors.listForCommunityAdmin", { community_id }).then(
    (response) => {
      if (response && response.success) {
        redirectIfExpired(response);
        dispatch(loadAllVendors(response.data));
      }
      return { type: "DO_NOTHING", payload: null };
    }
  );
  return { type: "DO_NOTHING", payload: null };
};

export const reduxGetAllCommunityTestimonials = (cb) => (dispatch) => {
  apiCall("/testimonials.listForCommunityAdmin").then((response) => {
    cb && cb(response.data, !response.success);
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllTestimonials(response.data));
    }
    return { type: "DO_NOTHING", payload: null };
  });
  return { type: "DO_NOTHING", payload: null };
};

export const reduxGetAllCommunityGoals = (community_id) => (dispatch) => {
  apiCall("/goals.listForCommunityAdmin", { community_id }).then((response) => {
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllGoals(response.data));
    }
    return { type: "DO_NOTHING", payload: null };
  });
  return { type: "DO_NOTHING", payload: null };
};

export const reduxGetAllCommunityTeams = (community_id) => (dispatch) => {
  apiCall("/teams.listForCommunityAdmin", { community_id }).then((response) => {
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllTeams(response.data));
    }
    return { type: "DO_NOTHING", payload: null };
  });
  return { type: "DO_NOTHING", payload: null };
};

export const reduxGetAllCommunityUsers = (community_id) => (dispatch) => {
  apiCall("/users.listForCommunityAdmin", { community_id }).then((response) => {
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllTeams(response.data));
    }
    return { type: "DO_NOTHING", payload: null };
  });
  return { type: "DO_NOTHING", payload: null };
};

export const reduxGetAllCommunityEvents = (community_id, cb) => (dispatch) => {
  apiCall("/events.listForCommunityAdmin", { community_id }).then(
    (response) => {
      if (response && response.success) {
        redirectIfExpired(response);
        dispatch(loadAllEvents(response.data));
      }
      cb && cb();
      return { type: "DO_NOTHING", payload: null };
    }
  );
  return { type: "DO_NOTHING", payload: null };
};

export const reduxGetAllVendors = () => (dispatch) => {
  apiCall("/vendors.listForSuperAdmin").then((response) => {
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllVendors(response.data));
    }
    return { type: "DO_NOTHING", payload: null };
  });
  return { type: "DO_NOTHING", payload: null };
};

export const reduxGetAllGoals = () => (dispatch) => {
  apiCall("/goals.listForCommunityAdmin").then((response) => {
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllGoals(response.data));
    }
    return { type: "DO_NOTHING", payload: null };
  });
  return { type: "DO_NOTHING", payload: null };
};

export const reduxGetAllTeams = (cb) => (dispatch) => {
  apiCall("/teams.listForCommunityAdmin").then((response) => {
    cb && cb(response.data, !response.success);
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllTeams(response.data));
    }
    return { type: "DO_NOTHING", payload: null };
  });
  return { type: "DO_NOTHING", payload: null };
};

export const reduxGetAllPolicies = () => (dispatch) => {
  apiCall("/policies.listForCommunityAdmin").then((response) => {
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllPolicies(response.data));
    }
    return { type: "DO_NOTHING", payload: null };
  });
  return { type: "DO_NOTHING", payload: null };
};

export const reduxGetAllEvents = () => (dispatch) => {
  apiCall("/events.listForCommunityAdmin").then((response) => {
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllEvents(response.data));
    }
    return { type: "DO_NOTHING", payload: null };
  });
  return { type: "DO_NOTHING", payload: null };
};

export const reduxGetAllUsers = () => (dispatch) => {
  apiCall("/users.listForCommunityAdmin").then((response) => {
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllUsers(response.data));
    }
    return { type: "DO_NOTHING", payload: null };
  });
  return { type: "DO_NOTHING", payload: null };
};

export const reduxGetAllTestimonials = () => (dispatch) => {
  apiCall("/testimonials.listForSuperAdmin").then((response) => {
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllTestimonials(response.data));
    }
    return { type: "DO_NOTHING", payload: null };
  });
  return { type: "DO_NOTHING", payload: null };
};

export const reduxGetAllCommunityActions = (community_id, cb) => (dispatch) => {
  apiCall("/actions.listForCommunityAdmin", { community_id }).then(
    (response) => {
      cb && cb(response.data, !response.success, response.error);
      if (response && response.success) {
        redirectIfExpired(response);
        dispatch(loadAllActions(response.data));
      }
      return { type: "DO_NOTHING", payload: null };
    }
  );
  return { type: "DO_NOTHING", payload: null };
};

export const reduxGetAllTags = () => (dispatch) => {
  getTagCollectionsData().then((response) => {
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllTags(response.data));
    }
    return { type: "DO_NOTHING", payload: null };
  });
  return { type: "DO_NOTHING", payload: null };
};

export const reduxGetAllActions = (cb) => (dispatch) => {
  console.log("reduxGetAllActions calls actions.listForCommunityAdmin");
  apiCall("/actions.listForCommunityAdmin").then((response) => {
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllActions(response.data));
    }
    return { type: "DO_NOTHING", payload: null };
  });
  return { type: "DO_NOTHING", payload: null };
};

// try to put checkUser in a a more general area later
export const reduxCheckUser = () => {
  apiCall("/auth.whoami").then((res) => {
    if (!res.data || Object.keys(res.data).length === 0) {
      // means the user token has expired, redirect to login
      // means the user token has expired, redirect to login
      localStorage.removeItem("idToken");
      localStorage.removeItem("authUser");
      window.location = "/login";
    }
    return { type: "DO_NOTHING", payload: null };
  });
  return { type: "DO_NOTHING", payload: null };
};

export const reduxIfExpired = (errorMsg) => {
  if (errorMsg === "Signature has expired") {
    reduxSignOut();
  }
};

export const reduxLoadLibraryModalData = (props) => {
  let { data = {}, old } = props;
  var images = data.images || [];

  const upper_limit = Math.max(data.upper_limit || 0, old.upper_limit || 0);
  var lower_limit = old.lower_limit || 0;
  lower_limit = lower_limit
    ? Math.min(lower_limit, data.lower_limit)
    : data.lower_limit;
  const payload = { images, lower_limit, upper_limit };
  return {
    type: LOAD_MODAL_LIBRARY,
    payload,
  };
};

export const universalFetchFromGallery = (props) => {
  let {
    body = {},
    community_ids,
    old = {},
    cb,
    url = "/gallery.search",
    reduxFunction = reduxLoadGalleryImages,
    append,
  } = props;
  old = old || {};
  community_ids = community_ids || [];
  var requestBody = { target_communities: community_ids, ...body };
  if (old.upper_limit)
    requestBody = { ...requestBody, upper_limit: old.upper_limit };
  if (old.lower_limit)
    requestBody = { ...requestBody, lower_limit: old.lower_limit };

  return (dispatch) => {
    apiCall(url, requestBody)
      .then((response) => {
        if (cb) cb(response);
        if (!response || !response.success)
          return console.log(" FETCH ERROR_BE: ", response.error);
        return dispatch(
          reduxFunction({
            data: response.data,
            old,
            append,
          })
        );
      })
      .catch((e) => {
        if (cb) cb();
        console.log("FETCH ERROR_SYNT: ", e.toString());
      });
  };
};
export const reduxCallLibraryModalImages = (props) => {
  let { community_ids, old = {}, cb } = props;
  old = old || {};
  community_ids = community_ids || [];
  var requestBody = { community_ids };

  if (old.upper_limit)
    requestBody = { ...requestBody, upper_limit: old.upper_limit };
  if (old.lower_limit)
    requestBody = { ...requestBody, lower_limit: old.lower_limit };

  return (dispatch) => {
    apiCall("/gallery.fetch", requestBody)
      .then((response) => {
        if (cb) cb(response);
        if (!response || !response.success)
          return console.log(" FETCH ERROR_BE: ", response.error);
        const newData = [
          ...((old && old.images) || []),
          ...((response.data && response.data.images) || []),
        ];
        return dispatch(
          reduxLoadLibraryModalData({
            data: { ...response.data, images: newData },
            old,
            append: true,
          })
        );
      })
      .catch((e) => {
        if (cb) cb(response);
        console.log("FETCH ERROR_SYNT: ", e.toString());
      });
  };
};

export const reduxCallCommunities = () => (dispatch) => {
  Promise.all([
    apiCall("/communities.listForCommunityAdmin"),
    apiCall("/summary.listForCommunityAdmin"),
    apiCall("/graphs.listForCommunityAdmin"),
    apiCall("/what.happened"),
  ]).then((res) => {
    const [commResponse, summaryResponse, graphResponse, activities] = res;
    if (commResponse.data) {
      dispatch(reduxLoadAllCommunities(commResponse.data));
    }
    if (summaryResponse.data) {
      dispatch(reduxLoadSummaryData(summaryResponse.data));
    }
    if (graphResponse.data) {
      dispatch(reduxLoadGraphData(graphResponse.data));
    }
    dispatch(reduxLoadAdminActivities(activities && activities.data));
  });
};

export const reduxCallIdToken = () => (dispatch) => {
  firebase
    .auth()
    .currentUser.getIdToken(true)
    .then((token) => {
      localStorage.setItem("idToken", token.toString());
      dispatch(reduxLoadIdToken(token));
    })
    .catch((err) => {
      console.log(err);
    });
};

export const reduxCallFullCommunity = (id) => (dispatch) => {
  apiCall("/communities.info", { community_id: id }).then((res) => {
    dispatch(reduxLoadFullSelectedCommunity(res.data));
  });
};

export const reduxLiveOrNot = (community) => {
  const newCom = { ...community, is_published: !community.is_published };
  return reduxLoadFullSelectedCommunity(newCom);
};
export const reduxLoadSelectedCommunity = (data = null) => ({
  type: SELECTED_COMMUNITY,
  payload: data,
});
export const reduxLoadAuthAdmin = (data = null) => {
  //reduxCallCommunities();
  return { type: LOAD_AUTH_ADMIN, payload: data };
};

export const loadTaskFunctionsAction = (data = []) => {
  return {
    type: LOAD_ALL_TASK_FUNCTIONS,
    payload: data,
  };
};
export const loadTasksAction = (data = []) => {
  return {
    type: LOAD_ALL_TASKS,
    payload: data,
  };
};
