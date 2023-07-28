/* eslint-disable camelcase */
import firebase from "firebase/app";
import React from "react";
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
  KEEP_FORM_CONTENT,
  LOAD_ADMIN_NEXT_STEPS_SUMMARY,
  SET_ENGAGMENT_OPTIONS,
  LOAD_USER_ENGAGEMENTS,
  TOGGLE_UNIVERSAL_TOAST,
  LOAD_ALL_META_DATA,
  ACTION_ENGAGMENTS,
  LOAD_TABLE_FILTERS,
  LOAD_VISIT_LOGS,
  LOAD_USER_ACTIVE_STATUS,
  LOAD_EMAIL_TEMPLATES,
  SET_IMAGE_FOR_EDIT,
  LOAD_ADMINS_OTHER_ADMINS,
  LOAD_OTHER_ADMINS,
  MEDIA_LIBRARY_MODAL_FILTERS,
  SET_MEDIA_LIBRARY_MODAL_FILTERS,
  SET_GALLERY_META_DATA,
  LOAD_EMAIL_TEMPLATES,
} from "../ReduxConstants";
import { apiCall, PERMISSION_DENIED } from "../../utils/messenger";
import { getTagCollectionsData } from "../../api/data";
import {
  CONNECTION_ESTABLISHED,
  LOADING,
  TIME_UNTIL_EXPIRATION,
  USER_SESSION_ALMOST_EXPIRED,
  USER_SESSION_EXPIRED,
  USER_SESSION_RENEWED,
} from "../../utils/constants";
import { API_HOST, IS_LOCAL } from "../../config/constants";
import {
  getLimit,
  prepareFilterAndSearchParamsFromLocal,
} from "../../utils/helpers";
import { PAGE_PROPERTIES } from "../../containers/MassEnergizeSuperAdmin/ME  Tools/MEConstants";
import SocketNotificationModal from "../../containers/MassEnergizeSuperAdmin/Misc/SocketNotificationModal";

// TODO: REOMVE THIS FUNCTiON
export const testRedux = (value) => {
  return { type: TEST_REDUX, payload: value };
};

const extendUserSession = (cb) => {
  fetchFirebaseToken((idToken, failed) => {
    if (failed) window.location.href = "/login";
    apiCall("auth.login", { idToken })
      .then(() => cb && cb(true))
      .catch((e) => {
        cb && cb(false);
        console.log(e);
      });
  });
};
export const setupSocketConnectionWithBackend = (auth) => (
  dispatch,
  getState
) => {
  const [_, hostname] = API_HOST.split("//");
  const url = IS_LOCAL
    ? `ws://${hostname}/ws/me-client/connect/`
    : `wss://${hostname}/ws/me-client/connect/`;
  const TAG = "[SOCK]: ";
  let socket;
  let numberOfRetries = 0;
  const MAXIMUM_RETRIES = 5;
  const WAIT_TIME = 4000; // 4 seconds before trying to reconnect, to give the server some time to recoup

  const connectSocket = () => {
    socket = new WebSocket(url);

    socket.onopen = () => {
      console.log(TAG, "connected");
      numberOfRetries = 0;
    };

    socket.onmessage = (e) => {
      const reduxState = getState();
      const thereIsUserActivity = reduxState.getIn(["userIsActive"]);
      let data = JSON.parse(e.data || "{}");
      const type = data?.type;
      if (type === USER_SESSION_EXPIRED) {
        // If session has expired and no activity, just redirect to login
        if (!thereIsUserActivity) window.location.href = "/login";
        else {
          // If the session has expired and there is activity, then automatically extend session behind the scenes
          extendUserSession((success) => {
            if (success)
              socket.send(JSON.stringify({ type: USER_SESSION_RENEWED }));
          });
          // ---------------------------------------------------------------------------
        }
      }
    };

    socket.onclose = () => {
      console.log(TAG, "disconnected :(");
      const message = `Hey ${auth?.preferred_name ||
        "admin"}, are you still there?`;

      if (numberOfRetries < MAXIMUM_RETRIES) {
        setTimeout(() => {
          console.log(TAG, "Reconnecting...");
          connectSocket();
        }, WAIT_TIME);
        numberOfRetries++;
      } else {
        // At this point, we have tried to reconnect 5 times, within "WAIT_TIME" intervals and still nothing,
        // So then we show the user the modal that says "Are you there?" Allowing them to manually reconnect, when they are ready
        console.log(
          TAG,
          "Tried to re-connect multiple times, giving up now..."
        );
        dispatch(
          reduxToggleUniversalModal({
            noTitle: true,
            show: true,
            noCancel: true,
            okText: "Yes, I'm Here",
            onConfirm: () => {
              console.log(TAG, "Reconnecting...");
              dispatch(setupSocketConnectionWithBackend(auth));
              dispatch(
                reduxToggleUniversalModal({ show: false, component: null })
              );
            },
            component: <SocketNotificationModal message={message} />,
          })
        );
      }
    };
    socket.onerror = () => {
      console.log(
        TAG,
        "Oops - Got an error, server did not respond as expected :( "
      );
    };
  };

  connectSocket();
};

export const setGalleryMetaAction = (data) => {
  return { type: SET_GALLERY_META_DATA, payload: data };
};
export const reduxLoadOtherAdmins = (data) => {
  return { type: LOAD_OTHER_ADMINS, payload: data };
};
export const fetchOtherAdminsInMyCommunities = (body, cb) => (dispatch) => {
  apiCall("/communities.adminsOf", body).then((response) => {
    cb && cb(response.data, !response.success, response.error);
    if (!response.success)
      return console.log("Could not load other admins", response);
    dispatch(reduxLoadOtherAdmins(response.data));
  });
  // return { type: LOAD_OTHER_ADMINS, payload: data };
};
export const setLibraryModalFiltersAction = (data) => {
  return { type: SET_MEDIA_LIBRARY_MODAL_FILTERS, payload: data };
};
export const setImageForEditAction = (data) => {
  return { type: SET_IMAGE_FOR_EDIT, payload: data };
};
export const reduxLoadUserActiveStatus = (data) => {
  return { type: LOAD_USER_ACTIVE_STATUS, payload: data };
};
export const reduxLoadVisitLogs = (data) => {
  return { type: LOAD_VISIT_LOGS, payload: data };
};
export const reduxLoadTableFilters = (data) => {
  return { type: LOAD_TABLE_FILTERS, payload: data };
};
export const reduxLoadActionEngagements = (data) => {
  return { type: ACTION_ENGAGMENTS, payload: data };
};
export const loadUserEngagements = (data) => {
  return { type: LOAD_USER_ENGAGEMENTS, payload: data };
};
export const setEngagementOptions = (data) => {
  return { type: SET_ENGAGMENT_OPTIONS, payload: data };
};

export const fetchLatestNextSteps = (cb) => (dispatch) => {
  apiCall("/summary.next.steps.forAdmins").then((response) => {
    cb && cb(response); // Just in case a scenario needs to know when the request is done....
    if (!response.success)
      return console.log("Could not load in next steps", response);
    dispatch(reduxLoadNextStepsSummary(response.data));
  });
};

export const checkFirebaseAuthentication = () => {
  return () =>
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) return (window.location = "/login");
    });
};
export const loadSettings = (data = {}) => {
  return {
    type: LOAD_SETTINGS,
    payload: data,
  };
};
export const restoreFormProgress = (data = {}) => {
  return {
    type: KEEP_FORM_CONTENT,
    payload: data,
  };
};
export const reduxKeepFormContent = ({ key, data, whole }) => {
  const payload = { ...(whole || {}), [key]: data };
  // localStorage.setItem(ME_FORM_PROGRESS, JSON.stringify(payload)); // -- UNCOMMENT WHEN WE WANT TO CONTINUE WITH PERSISTING PROGRESS
  return {
    type: KEEP_FORM_CONTENT,
    payload,
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
  // dispatch(setupSocketConnectionWithBackend(auth)); Deactivated as of 30/06/23 (Will return when the PROD disconnection bug is fixed)

  const galleryQuery = { most_recent: true };
  Promise.all([
    apiCall("/policies.listForCommunityAdmin"),
    apiCall(
      isSuperAdmin
        ? "/communities.listForSuperAdmin"
        : "/communities.listForCommunityAdmin",
      {
        params: prepareFilterAndSearchParamsFromLocal(
          PAGE_PROPERTIES.ALL_COMMUNITIES.key
        ),
        limit: getLimit(PAGE_PROPERTIES.ALL_COMMUNITIES.key),
      }
    ),
    apiCall(
      isSuperAdmin
        ? "/actions.listForSuperAdmin"
        : "/actions.listForCommunityAdmin",
      {
        params: prepareFilterAndSearchParamsFromLocal(
          PAGE_PROPERTIES.ALL_ACTIONS.key
        ),
        limit: getLimit(PAGE_PROPERTIES.ALL_ACTIONS.key),
      }
    ),
    apiCall(
      isSuperAdmin
        ? "/events.listForSuperAdmin"
        : "/events.listForCommunityAdmin",
      {
        params: prepareFilterAndSearchParamsFromLocal(
          PAGE_PROPERTIES.ALL_EVENTS.key
        ),
        limit: getLimit(PAGE_PROPERTIES.ALL_EVENTS.key),
      }
    ),
    apiCall("/messages.listForCommunityAdmin", {
      params: prepareFilterAndSearchParamsFromLocal(
        PAGE_PROPERTIES.ALL_ADMIN_MESSAGES.key
      ),
      limit: getLimit(PAGE_PROPERTIES.ALL_ADMIN_MESSAGES.key),
    }),
    apiCall("/messages.listTeamAdminMessages", {
      params: prepareFilterAndSearchParamsFromLocal(
        PAGE_PROPERTIES.ALL_TEAM_MESSAGES.key
      ),
      limit: getLimit(PAGE_PROPERTIES.ALL_TEAM_MESSAGES.key),
    }),
    apiCall(
      isSuperAdmin
        ? "/teams.listForSuperAdmin"
        : "/teams.listForCommunityAdmin",
      {
        params: prepareFilterAndSearchParamsFromLocal(
          PAGE_PROPERTIES.ALL_TEAMS.key
        ),
        limit: getLimit(PAGE_PROPERTIES.ALL_TEAMS.key),
      }
    ),
    apiCall(
      isSuperAdmin
        ? "/subscribers.listForSuperAdmin"
        : "/subscribers.listForCommunityAdmin",
      {
        params: prepareFilterAndSearchParamsFromLocal(
          PAGE_PROPERTIES.ALL_SUBSCRIBERS.key
        ),
        limit: getLimit(PAGE_PROPERTIES.ALL_SUBSCRIBERS.key),
      }
    ),
    apiCall(
      isSuperAdmin
        ? "/testimonials.listForSuperAdmin"
        : "/testimonials.listForCommunityAdmin",
      {
        params: prepareFilterAndSearchParamsFromLocal(
          PAGE_PROPERTIES.ALL_TESTIMONIALS.key
        ),
        limit: getLimit(PAGE_PROPERTIES.ALL_TESTIMONIALS.key),
      }
    ),
    apiCall(
      isSuperAdmin
        ? "/users.listForSuperAdmin"
        : "/users.listForCommunityAdmin",
      {
        params: prepareFilterAndSearchParamsFromLocal(
          PAGE_PROPERTIES.ALL_USERS.key
        ),
        limit: getLimit(PAGE_PROPERTIES.ALL_USERS.key),
      }
    ),
    apiCall(
      isSuperAdmin
        ? "/vendors.listForSuperAdmin"
        : "/vendors.listForCommunityAdmin",
      {
        params: prepareFilterAndSearchParamsFromLocal(
          PAGE_PROPERTIES.ALL_VENDORS.key
        ),
        limit: getLimit(PAGE_PROPERTIES.ALL_VENDORS.key),
      }
    ),
    apiCall("/cc/info/actions"),
    apiCall(
      isSuperAdmin
        ? "/tag_collections.listForSuperAdmin"
        : "/tag_collections.listForCommunityAdmin",
      {
        params: prepareFilterAndSearchParamsFromLocal(
          PAGE_PROPERTIES.ALL_TAG_COLLECTS.key
        ),
        limit: getLimit(PAGE_PROPERTIES.ALL_TAG_COLLECTS.key),
      }
    ),
    apiCall("/gallery.search", galleryQuery),
    isSuperAdmin && apiCall("/tasks.functions.list"),
    isSuperAdmin && apiCall("/tasks.list"),
    apiCall("/preferences.list"),
    isSuperAdmin && apiCall("/featureFlags.listForSuperAdmins"),
    apiCall("/communities.others.listForCommunityAdmin", { limit: 50 }),
    apiCall("/summary.next.steps.forAdmins"),
  ]).then((response) => {
    const [
      policies,
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
      preferences,
      featureFlags,
      otherCommunities,
      adminNextSteps,
    ] = response;
    dispatch(loadAllPolicies(policies.data));
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
    dispatch(setGalleryMetaAction({ loadMoreMeta: { query: galleryQuery } }));
    dispatch(loadTaskFunctionsAction(tasksFunctions.data));
    dispatch(loadTasksAction(tasks.data));
    dispatch(loadSettings(preferences.data || {}));
    dispatch(loadFeatureFlags(featureFlags.data || {}));
    dispatch(reduxLoadAllOtherCommunities(otherCommunities.data));
    dispatch(reduxLoadNextStepsSummary(adminNextSteps.data));
    // dispatch(loadEmailTemplates(emailTemplates.data));
    const cursor = {
      communities: communities.cursor,
      actions: actions.cursor,
      events: events.cursor,
      adminMessages: messages.cursor,
      teamMessages: teamMessages.cursor,
      teams: teams.cursor,
      subscribers: subscribers.cursor,
      users: users.cursor,
      vendors: vendors.cursor,
      tagCollections: tagCollections.cursor,
      otherCommunities: otherCommunities.cursor,
      testimonials: testimonials.cursor,
      policies: policies.cursor,
    };
    dispatch(reduxLoadMetaDataAction(cursor));
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
// export const loadEmailTemplates = (data = LOADING) => ({
//          type: LOAD_EMAIL_TEMPLATES,
//          payload: data,
//        });
export const reduxToggleUniversalModal = (data = {}) => ({
  type: TOGGLE_UNIVERSAL_MODAL,
  payload: data,
});
export const reduxToggleUniversalToast = (data = {}) => ({
  type: TOGGLE_UNIVERSAL_TOAST,
  payload: data,
});
export const reduxLoadCCActions = (data = []) => ({
  type: LOAD_CC_ACTIONS,
  payload: data,
});

export const reduxAddToHeap = (data = {}, heap = {}) => (dispatch) => {
  dispatch(reduxUpdateHeap({ ...heap, ...data }));
};
export const reduxUpdateHeap = (heap = {}) => ({
  type: UPDATE_HEAP,
  payload: heap,
});

/**
 * Use this function if you just need to add images to the list in gallery
 * and nothing more!
 */
export const reduxAddToGalleryImages = ({ old, data }) => {
  const images = [...(data || []), ...(old.images || [])];
  return {
    type: LOAD_GALLERY_IMAGES,
    payload: { ...old, images: removeDupes(images) },
  };
};

const removeDupes = (images) => {
  if (!images || !images.length) return [];
  const recorded = [];
  const items = [];
  images.forEach((image) => {
    if (!recorded.includes(image.id)) {
      items.push(image);
      recorded.push(image.id);
    }
  });
  return items;
};
/**
 * When new content is loaded and all the limits need to be recorded, this
 * is the redux function to use
 * @param {*} param0
 * @returns
 */
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
    payload: { images: removeDupes(images), upper_limit, lower_limit },
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
  apiCall("/users.listForCommunityAdmin", {
    limit: getLimit(PAGE_PROPERTIES.ALL_USERS.key),
  }).then((allUsersResponse) => {
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

export const reduxLoadMetaDataAction = (meta) => ({
  type: LOAD_ALL_META_DATA,
  payload: meta,
});

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

export const reduxSignOut = (cb) => (dispatch) => {
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
      cb && cb();
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
  apiCall("/vendors.listForCommunityAdmin", {
    community_id,
    limit: getLimit(PAGE_PROPERTIES.ALL_VENDORS.key),
  }).then((response) => {
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllVendors(response.data));
    }
    return { type: "DO_NOTHING", payload: null };
  });
  return { type: "DO_NOTHING", payload: null };
};

export const reduxGetAllCommunityTestimonials = () => (dispatch) => {
  apiCall("/testimonials.listForCommunityAdmin", {
    limit: getLimit(PAGE_PROPERTIES.ALL_TESTIMONIALS.key),
  }).then((response) => {
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
  apiCall("/teams.listForCommunityAdmin", {
    community_id,
    limit: getLimit(PAGE_PROPERTIES.ALL_TEAMS.key),
  }).then((response) => {
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
  apiCall("/events.listForCommunityAdmin", {
    community_id,
    limit: getLimit(PAGE_PROPERTIES.ALL_EVENTS.key),
  }).then((response) => {
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllEvents(response.data));
    }
    cb && cb();
    return { type: "DO_NOTHING", payload: null };
  });
  return { type: "DO_NOTHING", payload: null };
};

export const reduxGetAllVendors = () => (dispatch) => {
  apiCall("/vendors.listForSuperAdmin", {
    limit: getLimit(PAGE_PROPERTIES.ALL_VENDORS.key),
  }).then((response) => {
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

export const reduxGetAllTeams = () => (dispatch) => {
  apiCall("/teams.listForCommunityAdmin", {
    limit: getLimit(PAGE_PROPERTIES.ALL_TEAMS.key),
  }).then((response) => {
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
  apiCall("/events.listForCommunityAdmin", {
    limit: getLimit(PAGE_PROPERTIES.ALL_EVENTS.key),
  }).then((response) => {
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllEvents(response.data));
    }
    return { type: "DO_NOTHING", payload: null };
  });
  return { type: "DO_NOTHING", payload: null };
};

export const reduxGetAllUsers = () => (dispatch) => {
  apiCall("/users.listForCommunityAdmin", {
    limit: getLimit(PAGE_PROPERTIES.ALL_USERS.key),
  }).then((response) => {
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllUsers(response.data));
    }
    return { type: "DO_NOTHING", payload: null };
  });
  return { type: "DO_NOTHING", payload: null };
};

export const reduxGetAllTestimonials = () => (dispatch) => {
  apiCall("/testimonials.listForSuperAdmin", {
    limit: getLimit(PAGE_PROPERTIES.ALL_TESTIMONIALS.key),
  }).then((response) => {
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllTestimonials(response.data));
    }
    return { type: "DO_NOTHING", payload: null };
  });
  return { type: "DO_NOTHING", payload: null };
};

export const reduxGetAllCommunityActions = (community_id, cb) => (dispatch) => {
  apiCall("/actions.listForCommunityAdmin", {
    community_id,
    params: prepareFilterAndSearchParamsFromLocal(
      PAGE_PROPERTIES.ALL_ACTIONS.key
    ),
    limit: getLimit(PAGE_PROPERTIES.ALL_ACTIONS.key),
  }).then((response) => {
    cb && cb(response.data, !response.success, response.error);
    if (response && response.success) {
      redirectIfExpired(response);
      dispatch(loadAllActions(response.data));
    }
    return { type: "DO_NOTHING", payload: null };
  });
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
  apiCall("/actions.listForCommunityAdmin", {
    limit: getLimit(PAGE_PROPERTIES.ALL_ACTIONS.key),
  }).then((response) => {
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

export const reduxCallCommunities = () => (dispatch) => {
  Promise.all([
    apiCall("/communities.listForCommunityAdmin", { limit: 100 }),
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
    if (activities && activities.data) {
      dispatch(reduxLoadAdminActivities(activities.data));
    }
  });
};

const fetchFirebaseToken = (cb) => {
  firebase
    .auth()
    .currentUser.getIdToken(true)
    .then((token) => {
      cb && cb(token, false);
    })
    .catch((err) => {
      cb && cb(null, true, err);
      console.log(err);
    });
};

export const reduxCallIdToken = () => (dispatch) => {
  fetchFirebaseToken((token, failed, error) => {
    if (failed) return console.log("Token fetch failed: ", error);
    localStorage.setItem("idToken", token.toString());
    dispatch(reduxLoadIdToken(token));
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
