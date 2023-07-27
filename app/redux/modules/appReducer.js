import { Map, fromJS } from "immutable";
import { START_UP } from "../../actions/actionConstants";
import { LOADING } from "../../utils/constants";
import {
  LOAD_ALL_COMMUNITIES,
  LOAD_AUTH_ADMIN,
  LOAD_ID_TOKEN,
  SELECTED_COMMUNITY,
  SELECTED_COMMUNITY_FULL,
  GET_ALL_ACTIONS,
  GET_ALL_TESTIMONIALS,
  GET_ALL_EVENTS,
  GET_ALL_USERS,
  GET_ALL_TAG_COLLECTIONS,
  GET_ALL_TEAMS,
  GET_ALL_GOALS,
  GET_ALL_VENDORS,
  GET_ALL_POLICIES,
  LOAD_SUMMARY_DATA,
  LOAD_GRAPH_DATA,
  LOAD_GALLERY_IMAGES,
  LOAD_SEARCHED_IMAGES,
  KEEP_LOADED_IMAGE_INFO,
  LOAD_MODAL_LIBRARY,
  GET_ADMIN_MESSAGES,
  GET_TEAM_MESSAGES,
  GET_ALL_SUBSCRIBERS,
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
  SOCKET_CONNECTED,
  LOAD_VISIT_LOGS,
  LOAD_USER_ACTIVE_STATUS,
  LOAD_EMAIL_TEMPLATES,
} from "../ReduxConstants";

const initialState = Map({
  constants: {},
  profile: null,
});

const initialImmutableState = fromJS(initialState);

// TODO: REMOVE THIS
export function testReduxReducer(state = null, action = {}) {
  switch (action.type) {
    case TEST_REDUX:
      return state;
    default:
      return state;
  }
}

export default function reducer(state = initialImmutableState, action = {}) {
  switch (action.type) {
    case START_UP:
      return state;
    default:
      return state;
  }
}

export const reducerForUserActiveStatus = (state = false, action = {}) => {
  switch (action.type) {
    case LOAD_USER_ACTIVE_STATUS:
      return action.payload;
    default:
      return state;
  }
};
export const reducerForTableFilters = (state = {}, action = {}) => {
  switch (action.type) {
    case LOAD_TABLE_FILTERS:
      return action.payload;
    default:
      return state;
  }
};
export const reducerForVisitLogs = (state = null, action = {}) => {
  switch (action.type) {
    case LOAD_VISIT_LOGS:
      return action.payload;
    default:
      return state;
  }
};
export const reducerForActionEngagements = (state = LOADING, action = {}) => {
  switch (action.type) {
    case ACTION_ENGAGMENTS:
      return action.payload;
    default:
      return state;
  }
};
export const reducerForUserEngagements = (state = LOADING, action = {}) => {
  switch (action.type) {
    case LOAD_USER_ENGAGEMENTS:
      return action.payload;
    default:
      return state;
  }
};
export const reducerForEngagementOptions = (
  state = { range: ["last-month"] },
  action = {}
) => {
  switch (action.type) {
    case SET_ENGAGMENT_OPTIONS:
      return action.payload;
    default:
      return state;
  }
};
export const reducerForNextStepsSummary = (state = {}, action = {}) => {
  switch (action.type) {
    case LOAD_ADMIN_NEXT_STEPS_SUMMARY:
      return action.payload;
    default:
      return state;
  }
};
export const reducerForSavingOtherEventState = (state = {}, action = {}) => {
  switch (action.type) {
    case SAVE_OTHER_EVENT_STATES:
      return action.payload;
    default:
      return state;
  }
};
export const reducerForLoadingOtherEvents = (state = [], action = {}) => {
  switch (action.type) {
    case LOAD_ALL_OTHER_EVENTS:
      return action.payload;
    default:
      return state;
  }
};
export const reducerForKeepingFormContent = (state = {}, action = {}) => {
  switch (action.type) {
    case KEEP_FORM_CONTENT:
      return action.payload;
    default:
      return state;
  }
};
export const reducerForAdminActivities = (state = LOADING, action = {}) => {
  switch (action.type) {
    case LOAD_ADMIN_ACTIVITIES:
      return action.payload;
    default:
      return state;
  }
};
export const reducerForAllOtherCommunities = (state = [], action = {}) => {
  switch (action.type) {
    case LOAD_ALL_OTHER_COMMUNITIES:
      return action.payload;
    default:
      return state;
  }
};
export const reducerForFlagInfo = (state = {}, action = {}) => {
  switch (action.type) {
    case ADD_NEW_FEATURE_FLAG_INFO:
      return action.payload;
    default:
      return state;
  }
};
export const reducerForLoadingSuperAdmins = (state = LOADING, action = {}) => {
  switch (action.type) {
    case LOAD_SUPER_ADMIN_LIST:
      return action.payload;
    default:
      return state;
  }
};
export const reducerForLoadingAdmins = (state = LOADING, action = {}) => {
  switch (action.type) {
    case LOAD_ADMINS_FOR_MY_COMMUNITY:
      return action.payload;
    default:
      return state;
  }
};
export const reducerForFeatureFlags = (state = LOADING, action = {}) => {
  switch (action.type) {
    case LOAD_FEATURE_FLAGS:
      return action.payload;
    default:
      return state;
  }
};
export const reducerForEmailTemplates = (state = LOADING, action = {}) => {
  switch (action.type) {
    case LOAD_EMAIL_TEMPLATES:
      return action.payload;
    default:
      return state;
  }
};
export const reducerForSettings = (state = null, action = {}) => {
  switch (action.type) {
    case LOAD_SETTINGS:
      return action.payload;
    default:
      return state;
  }
};

export const reducerForGalleryFilters = (state = {}, action = {}) => {
  switch (action.type) {
    case SET_GALLERY_FILTERS:
      return action.payload;
    default:
      return state;
  }
};

export const reducerForUniversalModal = (state = {}, action = {}) => {
  switch (action.type) {
    case TOGGLE_UNIVERSAL_MODAL:
      return action.payload;

    default:
      return state;
  }
};
export const reducerForUniversalToast = (state = {}, action = {}) => {
  switch (action.type) {
    case TOGGLE_UNIVERSAL_TOAST:
      return action.payload;

    default:
      return state;
  }
};
export const reducerForCCAction = (state = [], action = {}) => {
  switch (action.type) {
    case LOAD_CC_ACTIONS:
      return action.payload;

    default:
      return state;
  }
};
export const reducerForHeap = (state = {}, action = {}) => {
  switch (action.type) {
    case UPDATE_HEAP:
      return action.payload;

    default:
      return state;
  }
};
export const subscribersReducer = (state = [], action = {}) => {
  switch (action.type) {
    case GET_ALL_SUBSCRIBERS:
      return action.payload;

    default:
      return state;
  }
};
export const teamMessagesReducer = (state = [], action = {}) => {
  switch (action.type) {
    case GET_TEAM_MESSAGES:
      return action.payload;

    default:
      return state;
  }
};
export const adminMessagesReducer = (state = [], action = {}) => {
  switch (action.type) {
    case GET_ADMIN_MESSAGES:
      return action.payload;

    default:
      return state;
  }
};
export const modalLibraryReducer = (state = {}, action = {}) => {
  switch (action.type) {
    case LOAD_MODAL_LIBRARY:
      return action.payload;

    default:
      return state;
  }
};
export const imageInfosReducer = (state = {}, action = {}) => {
  switch (action.type) {
    case KEEP_LOADED_IMAGE_INFO:
      return action.payload;

    default:
      return state;
  }
};
export const searchedImagesReducer = (state = {}, action = {}) => {
  switch (action.type) {
    case LOAD_SEARCHED_IMAGES:
      return action.payload;

    default:
      return state;
  }
};
export const galleryImagesReducer = (state = [], action = {}) => {
  switch (action.type) {
    case LOAD_GALLERY_IMAGES:
      return action.payload;

    default:
      return state;
  }
};
export const communitiesReducer = (state = [], action = {}) => {
  switch (action.type) {
    case LOAD_ALL_COMMUNITIES:
      return action.payload;

    default:
      return state;
  }
};

export const summaryDataReducer = (state = [], action = {}) => {
  switch (action.type) {
    case LOAD_SUMMARY_DATA:
      return action.payload;

    default:
      return state;
  }
};

export const graphDataReducer = (state = [], action = {}) => {
  switch (action.type) {
    case LOAD_GRAPH_DATA:
      return action.payload;

    default:
      return state;
  }
};
export const policiesReducer = (state = [], action = {}) => {
  switch (action.type) {
    case GET_ALL_POLICIES:
      return action.payload;
    default:
      return state;
  }
};
export const vendorsReducer = (state = [], action = {}) => {
  switch (action.type) {
    case GET_ALL_VENDORS:
      return action.payload;
    default:
      return state;
  }
};
let localUser = localStorage.getItem("authUser");
localUser = localUser ? JSON.parse(localUser) : null;

export const authAdminReducer = (state = localUser, action = {}) => {
  switch (action.type) {
    case LOAD_AUTH_ADMIN:
      return action.payload;
    default:
      return state;
  }
};
export const tokenReducer = (state = null, action = {}) => {
  switch (action.type) {
    case LOAD_ID_TOKEN:
      return action.payload;
    default:
      return state;
  }
};
export const allActionsReducer = (state = [], action = {}) => {
  switch (action.type) {
    case GET_ALL_ACTIONS:
      return action.payload;
    default:
      return state;
  }
};

export const allGoalsReducer = (state = [], action = {}) => {
  switch (action.type) {
    case GET_ALL_GOALS:
      return action.payload;
    default:
      return state;
  }
};
export const allTagsReducer = (state = [], action = {}) => {
  switch (action.type) {
    case GET_ALL_TAG_COLLECTIONS:
      return action.payload;
    default:
      return state;
  }
};
export const allTeamsReducer = (state = [], action = {}) => {
  switch (action.type) {
    case GET_ALL_TEAMS:
      return action.payload;

    default:
      return state;
  }
};
export const allEventsReducer = (state = [], action = {}) => {
  switch (action.type) {
    case GET_ALL_EVENTS:
      return action.payload;
    default:
      return state;
  }
};
export const allUsersReducer = (state = [], action = {}) => {
  switch (action.type) {
    case GET_ALL_USERS:
      return action.payload;
    default:
      return state;
  }
};
export const allTestimonialsReducer = (state = [], action = {}) => {
  switch (action.type) {
    case GET_ALL_TESTIMONIALS:
      return action.payload;
    default:
      return state;
  }
};
export const selectedCommunityReducer = (state = null, action = {}) => {
  switch (action.type) {
    case SELECTED_COMMUNITY:
      return action.payload;
    default:
      return state;
  }
};
export const fullSelectedCommunityReducer = (state = null, action = {}) => {
  switch (action.type) {
    case SELECTED_COMMUNITY_FULL:
      return action.payload;
    default:
      return state;
  }
};
export const allTaskFunctionsReducer = (state = [], action = {}) => {
  switch (action.type) {
    case LOAD_ALL_TASK_FUNCTIONS:
      return action.payload;
    default:
      return state;
  }
};
export const allTasksReducer = (state = [], action = {}) => {
  switch (action.type) {
    case LOAD_ALL_TASKS:
      return action.payload;
    default:
      return state;
  }
};
export const allMetaDataReducer = (state = {}, action = {}) => {
  switch (action.type) {
    case LOAD_ALL_META_DATA:
      return action.payload;
    default:
      return state;
  }
};

export const allReducers = {
  communities: communitiesReducer,
};
