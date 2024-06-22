import React from "react";
import { PropTypes } from "prop-types";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Dashboard from "../Templates/Dashboard";
import {
  checkFirebaseAuthentication,
  reduxCallCommunities,
  reduxCheckUser,
  reduxFetchInitialContent,
  reduxToggleUniversalModal,
  restoreFormProgress,
  reduxToggleUniversalToast,
  reduxLoadTableFilters,
  reduxLoadUserActiveStatus,
} from "../../redux/redux-actions/adminActions";
import {
  Parent,
  DashboardSummaryPage,
  AllCommunities,
  OnboardCommunity,
  CommunityProfile,
  VendorsPage,
  AllVendors,
  AddVendor,
  AllCategories,
  AddCategory,
  BlankPage,
  Form,
  Table,
  Error,
  NotFound,
  SuperAllActions,
  AllActions,
  AddAction,
  EditAction,
  EventsPage,
  AllEvents,
  AddEvent,
  EditEvent,
  TeamsPage,
  AddTeam,
  AllTeams,
  AllGoals,
  AddGoal,
  EditGoal,
  AddPolicy,
  AllPolicies,
  DashboardAdminSummaryPage,
  TestimonialsPage,
  AddTestimonial,
  AllTestimonials,
  Export,
  CustomizePages,
  SuperContactUs,
  SuperHome,
  SuperAboutUs,
  SuperDonate,
  EditPolicy,
  UsersList,
  ImpactPage,
  Impact,
  ImportContacts,
  AddCarbonEquivalency,
  AllCarbonEquivalencies,
  EditCarbonEquivalency,
  AddTask,
  ListTasks,
  Preferences,
  FeatureFlags,
  EventFullView,
  EventsFromOthers,
  ActionEngagementList,
  TermsOfServicePage,
  ActionUsers,
  SendMessage,
  ScheduledMessages,
  PlatformFeaturesPage,
  NudgeControlPage,
  CustomNavigationConfiguration,
} from "../pageListAsync";
import EditVendor from "../MassEnergizeSuperAdmin/Vendors/EditVendor";
import AddRemoveAdmin from "../MassEnergizeSuperAdmin/Community/AddRemoveAdmin";
import AddRemoveSuperAdmin from "../MassEnergizeSuperAdmin/Community/AddRemoveSuperAdmin";
import EditCommunityByCommunityAdmin from "../MassEnergizeSuperAdmin/Community/EditCommunityByCommunityAdmin";
import EditTeam from "../MassEnergizeSuperAdmin/Teams/EditTeam";
import EditCategory from "../MassEnergizeSuperAdmin/Categories/EditCategory";
import EditTestimonial from "../MassEnergizeSuperAdmin/Testimonials/EditTestimonial";
import AllSubscribers from "../MassEnergizeSuperAdmin/Subscribers/AllSubscribers";
import CommunityAdminMessages from "../MassEnergizeSuperAdmin/Messages/CommunityAdminMessages";
import MessageDetails from "../MassEnergizeSuperAdmin/Messages/MessageDetails";
import TeamAdminMessages from "../MassEnergizeSuperAdmin/Messages/TeamAdminMessages";
import TeamMembers from "../MassEnergizeSuperAdmin/Teams/TeamMembers";
import EventRSVPs from "../MassEnergizeSuperAdmin/Events/EventRSVPs";
import ThemeModal from "../../components/Widget/ThemeModal";
import ThemeToast from "../../components/Widget/ThemeToast";
import { FILTER_OBJ_KEY } from "../MassEnergizeSuperAdmin/ME  Tools/table /METable";
import { IS_LOCAL } from "../../config/constants";
import UserActivityMonitor from "../../components/Widget/UserActivityMonitor";

// This function checks whether a user needs to sign an MOU and redirects them to the MOU page if necessary
const checkIfUserNeedsMOUAttention = (auth, history) => {
  // A list of routes that are allowed if a user has not signed their MOU
  const allowedRoutes = [
    "/admin/view/policy/terms-of-service",
    "/admin/view/policy/privacy-policy",
    "/admin/view/policy/mou",
  ];
  // Get current url path
  const currentUrl = window.location.pathname;
  let routeIsAllowed = false;

  // Iterate through all the allowed routes listed.
  allowedRoutes.forEach((route) => {
    if (currentUrl.includes(route)) routeIsAllowed = true;
  });

  // Set the MOU URL
  const MOU_URL = "/admin/view/policy/mou?ct=true"; // this will need to change if we ever change the "key" from "mou" when sadmin is creating the MOU policy. Same for PP and TOS routes.

  // If the user still needs to accept the MOU agreement and is accessing a route that is currently not allowed, redirect them to the MOU route with ct=true in the query string.
  if (auth?.needs_to_accept_mou && !routeIsAllowed) return history.push(MOU_URL);
};

class Application extends React.Component {
  componentDidMount() {
    this.props.reduxCallCommunities();
    this.props.checkFirebaseAuthentication();
    this.props.fetchInitialContent(this.props.auth);

    // ---- UNCOMMENT THIS WHEN WE WANT TO CONTINUE WITH PERSISTING FORM PROGRESS TO LOCAL STORAGE
    // Collect form progress from local storage after page refresh
    // var progress = localStorage.getItem(ME_FORM_PROGRESS) || "{}";
    // progress = JSON.parse(progress);
    // this.props.restoreFormProgress(progress);

    // ---- PICK UP SAVED FILTERS FROM LOCAL STORAGE ON FIRST LOAD ------
    this.findSavedFiltersAndInflate();
  }


  findSavedFiltersAndInflate() {
    const { putFiltersInRedux } = this.props;
    const filters = localStorage.getItem(FILTER_OBJ_KEY);
    putFiltersInRedux(JSON.parse(filters));
  }

  getCommunityList() {
    const { auth } = this.props;
    const list = (auth && auth.admin_at) || [];
    return list.map((com) => com.id);
  }

   renderModalComponent =(modalOptions) =>{
    const { component, renderComponent } = modalOptions;
    if(renderComponent) return renderComponent();
    return component;
  }

  render() {
    const { auth, signOut } = this.props;
    const {
      changeMode,
      history,
      modalOptions,
      toggleUniversalModal,
      toastOptions,
      toggleUniversalToast,
      updateUserActiveStatus,
    } = this.props;
    const user = auth || {};

    const communityAdminSpecialRoutes = [
      <Route path="/admin/importcontacts" component={ImportContacts} />,
      <Route
        exact
        path="/"
        render={(props) => (
          <DashboardAdminSummaryPage {...props} signOut={signOut} />
        )}
      />,
      <Route
        path="/admin/community/:id/edit"
        component={EditCommunityByCommunityAdmin}
        exact
      />,
      <Route
        exact
        path="/admin"
        render={(props) => (
          <DashboardAdminSummaryPage {...props} signOut={signOut} />
        )}
      />,
      <Route
        path="/admin/dashboard"
        render={(props) => (
          <DashboardAdminSummaryPage {...props} signOut={signOut} />
        )}
      />,
    ];

    const superAdminSpecialRoutes = [
      <Route path="/admin/importcontacts" component={ImportContacts} />,
      <Route
        exact
        path="/"
        render={(props) => (
          <DashboardSummaryPage {...props} signOut={signOut} />
        )}
      />,
      <Route
        path="/admin/community/:id/edit"
        component={OnboardCommunity}
        exact
      />,
      <Route
        exact
        path="/admin"
        render={(props) => (
          <DashboardSummaryPage {...props} signOut={signOut} />
        )}
      />,
      <Route
        path="/admin/dashboard"
        render={(props) => (
          <DashboardSummaryPage {...props} signOut={signOut} />
        )}
      />,
    ];


    if (!IS_LOCAL) checkIfUserNeedsMOUAttention(auth, history); // This check will not run in local mode
    const { show, onConfirm, closeAfterConfirmation } = modalOptions;
    return (
      <UserActivityMonitor
        minutes={10}
        // minutes = {0.2} // --- FOR TESTING
        onStateChange={(status) => updateUserActiveStatus(status)}
      >
        <Dashboard
          history={history}
          changeMode={changeMode}
          lock={!IS_LOCAL && auth?.needs_to_accept_mou}
        >
          <ThemeModal
            {...modalOptions || {}}
            open={show}
            onConfirm={onConfirm}
            close={() => {
              toggleUniversalModal({ show: false, component: null });
              return false;
            }}
            closeAfterConfirmation={closeAfterConfirmation}
          >
            {this.renderModalComponent(modalOptions)}
          </ThemeModal>
          <ThemeToast
            {...toastOptions || {}}
            open={toastOptions?.open}
            onClose={() => {
              toggleUniversalToast({ open: false, component: null });
              return false;
            }}
            message={toastOptions?.message}
          />

          <Switch>
            {user.is_community_admin && communityAdminSpecialRoutes}
            {user.is_super_admin && superAdminSpecialRoutes}

            <Route exact path="/blank" component={BlankPage} />
            <Route
              path="/admin/configure/navigation"
              component={CustomNavigationConfiguration}
            />
            <Route
              path="/admin/settings/notification-control"
              component={NudgeControlPage}
            />
            <Route
              path="/admin/settings/platform-features"
              component={PlatformFeaturesPage}
            />
            <Route
              path="/admin/view/policy/:policyKey"
              component={TermsOfServicePage}
            />
            <Route
              exact
              path="/admin/profile/preferences"
              component={Preferences}
            />
            <Route
              exact
              path="/admin/settings/feature-flags"
              component={FeatureFlags}
            />
            <Route path="/admin/read/users" component={UsersList} />
            <Route
              path="/admin/read/community-admin-messages"
              exact
              component={CommunityAdminMessages}
            />
            <Route
              path="/admin/read/team-admin-messages"
              exact
              component={TeamAdminMessages}
            />
            <Route
              path="/admin/edit/:id/message"
              exact
              component={MessageDetails}
            />
            <Route
              path="/admin/send/message"
              exact
              component={SendMessage}
            />
            <Route
              path="/admin/edit/:id/scheduled-message"
              exact
              component={SendMessage}
            />
            <Route
              path="/admin/scheduled/messages"
              exact
              component={ScheduledMessages}
            />
            <Route
              path="/admin/read/communities"
              component={AllCommunities}
            />
            <Route
              path="/admin/add/community"
              component={OnboardCommunity}
            />
            <Route
              path="/admin/community/:id"
              component={CommunityProfile}
              exact
            />
            <Route
              path="/admin/community/:id/preview"
              component={CommunityProfile}
              exact
            />
            <Route
              path="/admin/community/:id/profile"
              component={CommunityProfile}
              exact
            />
            <Route
              path="/admin/edit/:id/community/community-admin"
              component={EditCommunityByCommunityAdmin}
              exact
            />
            <Route
              path="/admin/edit/:id/community"
              component={OnboardCommunity}
              exact
            />
            <Route
              path="/admin/add/:id/community-admins"
              component={AddRemoveAdmin}
              exact
            />
            <Route
              path="/admin/edit/:id/community-admins"
              component={AddRemoveAdmin}
              exact
            />
            <Route
              path="/admin/add-super-admin"
              component={AddRemoveSuperAdmin}
              exact
            />
            <Route path="/admin/read/actions" component={AllActions} />
            <Route
              path="/admin/read/:id/action-users"
              component={ActionUsers}
            />
            <Route path="/admin/add/action" component={AddAction} />
            <Route
              path="/admin/edit/:id/action"
              component={EditAction}
              exact
            />
            <Route path="/admin/add/action/:id" component={EditAction} />
            <Route
              path="/admin/read/carbon-equivalencies"
              component={AllCarbonEquivalencies}
            />
            <Route
              path="/admin/add/carbon-equivalency"
              component={AddCarbonEquivalency}
            />
            <Route
              path="/admin/edit/:id/carbon-equivalency"
              component={EditCarbonEquivalency}
              exact
            />
            <Route
              path="/admin/read/categories"
              component={AllCategories}
            />
            <Route path="/admin/add/category" component={AddCategory} />
            <Route
              path="/admin/read/tag-collections"
              component={AllCategories}
            />
            <Route
              path="/admin/add/tag-collection"
              component={AddCategory}
            />
            <Route
              path="/admin/edit/:id/tag-collection"
              component={EditCategory}
            />
            <Route
              path="/admin/read/event/:id/event-view"
              component={EventFullView}
            />
            <Route path="/admin/read/events" exact component={AllEvents} />
            <Route
              path="/admin/read/events/event-sharing"
              exact
              component={EventsFromOthers}
            />
            <Route path="/admin/add/event" component={AddEvent} />
            <Route path="/admin/edit/:id/event" component={EditEvent} />
            <Route
              path="/admin/edit/:id/event-rsvps"
              component={EventRSVPs}
            />
            <Route path="/admin/read/teams" exact component={AllTeams} />
            <Route path="/admin/add/team" component={AddTeam} />
            <Route path="/admin/edit/:id/team" component={EditTeam} />
            <Route
              path="/admin/edit/:id/team-members"
              component={TeamMembers}
            />
            <Route
              path="/admin/read/subscribers"
              component={AllSubscribers}
            />
            <Route path="/admin/read/policies" component={AllPolicies} />
            <Route path="/admin/add/policy" component={AddPolicy} />

            <Route path="/admin/edit/:id/policy" component={EditPolicy} />
            <Route path="/admin/read/goals" component={AllGoals} />
            <Route path="/admin/add/goal" component={AddGoal} />
            <Route path="/admin/edit/:id/goal" component={EditGoal} />
            <Route
              path="/admin/read/testimonials"
              component={AllTestimonials}
            />
            <Route
              path="/admin/add/testimonial"
              component={AddTestimonial}
            />
            <Route
              path="/admin/edit/:id/testimonial"
              component={EditTestimonial}
            />
            <Route path="/admin/read/vendors" component={AllVendors} />
            <Route path="/admin/add/vendor" component={AddVendor} />
            <Route path="/admin/edit/:id/vendor" component={EditVendor} />
            <Route path="/admin/export" component={Export} />
            <Route path="/admin/customize" component={CustomizePages} />
            <Route
              path="/admin/read/categories"
              component={AllCategories}
            />
            <Route path="/admin/add/category" component={AddCategory} />
            <Route path="/admin/form" component={Form} />
            <Route path="/admin/table" component={Table} />
            <Route path="/admin/page-list" component={Parent} />
            <Route path="/admin/pages/not-found" component={NotFound} />
            <Route path="/admin/pages/error" component={Error} />
            <Route path="/admin/edit/:id/home" component={SuperHome} />
            <Route path="/admin/edit/:id/impacts" component={Impact} />
            <Route path="/admin/edit/:id/impact" component={ImpactPage} />
            <Route
              path="/admin/edit/:id/actions"
              component={SuperAllActions}
            />
            <Route
              path="/admin/edit/:id/all-actions"
              component={SuperAllActions}
            />
            <Route path="/admin/edit/:id/events" component={EventsPage} />
            <Route path="/admin/edit/:id/teams" component={TeamsPage} />
            <Route path="/admin/edit/:id/vendors" component={VendorsPage} />
            <Route
              path="/admin/edit/:id/testimonials"
              component={TestimonialsPage}
            />
            <Route
              path="/admin/edit/:id/contact_us"
              component={SuperContactUs}
            />
            <Route path="/admin/edit/:id/donate" component={SuperDonate} />
            <Route path="/admin/edit/:id/about" component={SuperAboutUs} />
            <Route
              path="/admin/edit/:id/about_us"
              component={SuperAboutUs}
            />
            <Route path="/admin/read/about-us" component={SuperAboutUs} />
            <Route path="/admin/add/donate" component={SuperDonate} />
            <Route
              path="/admin/read/contact-us"
              component={SuperContactUs}
            />
            <Route
              path="/admin/read/action-engagements"
              component={ActionEngagementList}
            />
            <Route
              path="/admin/read/all-actions"
              component={SuperAllActions}
            />
            <Route exact path="/admin/tasks/add" component={AddTask} />
            <Route exact path="/admin/edit/:id/task" component={AddTask} />
            <Route exact path="/admin/read/tasks" component={ListTasks} />
            <Route component={NotFound} />
          </Switch>
        </Dashboard>
      </UserActivityMonitor>
    );
  }
}

Application.propTypes = {
  changeMode: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    auth: state.getIn(["auth"]),
    modalLibraryImages: state.getIn(["modalLibraryImages"]),
    modalOptions: state.getIn(["modalOptions"]),
    toastOptions: state.getIn(["toastOptions"]),
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      reduxCallCommunities,
      checkUser: reduxCheckUser,
      fetchInitialContent: reduxFetchInitialContent,
      toggleUniversalModal: reduxToggleUniversalModal,
      checkFirebaseAuthentication,
      restoreFormProgress,
      toggleUniversalToast: reduxToggleUniversalToast,
      putFiltersInRedux: reduxLoadTableFilters,
      updateUserActiveStatus: reduxLoadUserActiveStatus,
    },
    dispatch
  );
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Application);
