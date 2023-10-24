/**
 * Combine all reducers in this file and export the combined reducers.
 */
import { reducer as form } from "redux-form/immutable";
import { combineReducers } from "redux-immutable";
import { connectRouter } from "connected-react-router/immutable";
import history from "utils/history";

import languageProviderReducer from "containers/LanguageProvider/reducer";
import login from "./modules/login";
import uiReducer from "./modules/ui";
import contact from "./modules/contact";
import initval from "./modules/initForm";
import app, {
  communitiesReducer,
  summaryDataReducer,
  graphDataReducer,
  tokenReducer,
  selectedCommunityReducer,
  fullSelectedCommunityReducer,
  authAdminReducer,
  allActionsReducer,
  allEventsReducer,
  allTestimonialsReducer,
  allUsersReducer,
  allTagsReducer,
  allTeamsReducer,
  allGoalsReducer,
  vendorsReducer,
  policiesReducer,
  galleryImagesReducer,
  searchedImagesReducer,
  imageInfosReducer,
  modalLibraryReducer,
  adminMessagesReducer,
  teamMessagesReducer,
  subscribersReducer,
  reducerForHeap,
  reducerForCCAction,
  reducerForUniversalModal,
  testReduxReducer,
  allTaskFunctionsReducer,
  allTasksReducer,
  reducerForSettings,
  reducerForFeatureFlags,
  reducerForAdminActivities,
  reducerForFlagInfo,
  reducerForGalleryFilters,
  reducerForLoadingAdmins,
  reducerForLoadingSuperAdmins,
  reducerForAllOtherCommunities,
  reducerForLoadingOtherEvents,
  reducerForSavingOtherEventState,
  reducerForKeepingFormContent,
  reducerForNextStepsSummary,
  reducerForEngagementOptions,
  reducerForUserEngagements,
  reducerForUniversalToast,
  allMetaDataReducer,
  reducerForActionEngagements,
  reducerForTableFilters,
  reducerForVisitLogs,
  reducerForUserActiveStatus,
  setImageForEditReducer,
  reducerForLoadingOtherAdmins,
  mlibFiltersReducer,
  setGalleryMetadataReducer,
  reducerForAddingBlobString,
} from "./modules/appReducer";

/**
 * Creates the main reducer with the dynamically injected ones
 */
export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    userIsActive: reducerForUserActiveStatus,
    userVisitLogs: reducerForVisitLogs,
    tableFilters: reducerForTableFilters,
    tempForm: reducerForKeepingFormContent,
    actionEngagements: reducerForActionEngagements,
    userEngagements: reducerForUserEngagements,
    engagementOptions: reducerForEngagementOptions,
    nextStepsSummary: reducerForNextStepsSummary,
    activities: reducerForAdminActivities,
    otherCommunities: reducerForAllOtherCommunities,
    otherEventsState: reducerForSavingOtherEventState,
    otherEvents: reducerForLoadingOtherEvents,
    flagInfos: reducerForFlagInfo,
    galleryFilters: reducerForGalleryFilters,
    sadmins: reducerForLoadingSuperAdmins,
    admins: reducerForLoadingAdmins,
    featureFlags: reducerForFeatureFlags,
    settings: reducerForSettings,
    testRedux: testReduxReducer,
    modalOptions: reducerForUniversalModal,
    toastOptions: reducerForUniversalToast,
    ccActions: reducerForCCAction,
    heap: reducerForHeap, // an object that is used to temporarily hold all kinds of random data.
    subscribers: subscribersReducer,
    teamMessages: teamMessagesReducer,
    messages: adminMessagesReducer,
    galleryImages: galleryImagesReducer, // This is what the modal in the form generator uses
    searchedImages: searchedImagesReducer, // This is what the "all images" gallery page uses
    imageInfos: imageInfosReducer, // When the sidepane of the modal loads in the fullJson object of an image from the B.E, this is where its kept
    modalLibraryImages: modalLibraryReducer, // TODO: Look into this. It might not be in use anymore
    app,
    form,
    login,
    contact,
    ui: uiReducer,
    auth: authAdminReducer,
    communities: communitiesReducer,
    summary_data: summaryDataReducer,
    graph_data: graphDataReducer,
    allActions: allActionsReducer,
    allTestimonials: allTestimonialsReducer,
    allTags: allTagsReducer,
    allUsers: allUsersReducer,
    allEvents: allEventsReducer,
    allTeams: allTeamsReducer,
    allGoals: allGoalsReducer,
    allVendors: vendorsReducer,
    allPolicies: policiesReducer,
    token: tokenReducer,
    selected_community: selectedCommunityReducer,
    full_selected_community: fullSelectedCommunityReducer,
    initval,
    language: languageProviderReducer,
    router: connectRouter(history),
    ...injectedReducers,
    taskFunctions: allTaskFunctionsReducer,
    tasks: allTasksReducer,
    galleryMeta: setGalleryMetadataReducer,
    mlibFilters: mlibFiltersReducer,
    paginationMetaData: allMetaDataReducer, // stores pagination data for all tables
    imageBeingEdited: setImageForEditReducer, // This is what holds  the image whose details are being edited in the mlibrary modal
    otherAdmins: reducerForLoadingOtherAdmins, // If a user is admin of multiple communities, other admins in each of their communities will be grouped here (Used in the Media Library Modal)
    blobTray: reducerForAddingBlobString, // When base64 image data is retrieved from the B.E with media Id, its kept here. To avoid re-running requests that have already happened before
  });

  // Wrap the root reducer and return a new root reducer with router state
  const mergeWithRouterState = connectRouter(history);
  return mergeWithRouterState(rootReducer);
}
