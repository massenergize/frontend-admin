import React, { useEffect, useState } from "react";
import { PropTypes } from "prop-types";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Dashboard from "../Templates/Dashboard";
import {
  reduxCallCommunities,
  reduxCallLibraryModalImages,
  reduxFetchInitialContent,
  reduxLoadAuthAdmin,
  reduxToggleUniversalModal,
  trackFirebaseAuthenticationChanges,
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
  RegisterPage,
  SigninPage,
  Impact,
  ImportContacts,
  AddCarbonEquivalency,
  AllCarbonEquivalencies,
  EditCarbonEquivalency,
  GalleryPage,
  AddToGallery,
} from "../pageListAsync";
import EditVendor from "../MassEnergizeSuperAdmin/Vendors/EditVendor";
import AddRemoveAdmin from "../MassEnergizeSuperAdmin/Community/AddRemoveAdmin";
import AddRemoveSuperAdmin from "../MassEnergizeSuperAdmin/Community/AddRemoveSuperAdmin";
import EditCommunityByCommunityAdmin from "../MassEnergizeSuperAdmin/Community/EditCommunityByCommunityAdmin";
import EditTeam from "../MassEnergizeSuperAdmin/Teams/EditTeam";
//import EditCarbonEquivalency from '../MassEnergizeSuperAdmin/CarbonEquivalencies/EditCarbonEquivalency';
import EditCategory from "../MassEnergizeSuperAdmin/Categories/EditCategory";
import EditTestimonial from "../MassEnergizeSuperAdmin/Testimonials/EditTestimonial";
import AllSubscribers from "../MassEnergizeSuperAdmin/Subscribers/AllSubscribers";
import CommunityAdminMessages from "../MassEnergizeSuperAdmin/Messages/CommunityAdminMessages";
import MessageDetails from "../MassEnergizeSuperAdmin/Messages/MessageDetails";
import TeamAdminMessages from "../MassEnergizeSuperAdmin/Messages/TeamAdminMessages";
import TeamMembers from "../MassEnergizeSuperAdmin/Teams/TeamMembers";
import EventRSVPs from "../MassEnergizeSuperAdmin/Events/EventRSVPs";
import ThemeModal from "../../components/Widget/ThemeModal";
import { Typography } from "@material-ui/core";
import { apiCall } from "../../utils/messenger";

const TIME_BEFORE_NOTIFICATION = 10 * 60; // 10 minutes in seconds
class Application extends React.Component {
  componentWillMount() {
    this.props.reduxCallCommunities();
  }
  componentDidMount() {
    this.props.fetchInitialContent(this.props.auth);
    this.props.trackFirebaseAuthenticationChanges();
    this.trackSessionTimeAndNotify();
  }

  getCommunityList() {
    const { auth } = this.props;
    const list = (auth && auth.admin_at) || [];
    return list.map((com) => com.id);
  }

  async requestTokenRefresh(thread) {
    const { putAdminBackInRedux, fireAuth } = this.props;
    const err = "Sorry, we could not reset your session";
    try {
      const token = fireAuth && fireAuth.getIdToken(true);
      if (!token) return alert(err);
      const response = await apiCall("/auth.token.refresh", {
        idToken: fireAuth._lat,
      });

      if (!response || !response.success) {
        console.log("ERROR_REFRESHING_SESSION:", response);
        return alert(err);
      }

      clearTimeout(thread);
      putAdminBackInRedux(response.data);
      this.trackSessionTimeAndNotify(response.data);
    } catch (e) {
      console.log(e.toString());
    }
  }
  trackSessionTimeAndNotify(user) {
    const { auth, toggleUniversalModal } = this.props;
    user = user || auth;
    if (!user) return;
    const diff = user.cookie_expiration_in_seconds - TIME_BEFORE_NOTIFICATION;
    const remainingSessionTimeIsLessThanTenMinutes = diff <= 0;
    const sessionTime = remainingSessionTimeIsLessThanTenMinutes
      ? user.cookie_expiration_in_seconds * 1000
      : diff * 1000; //time in milliseconds

    if (!sessionTime) return;
    const counterThread = setTimeout(() => {
      toggleUniversalModal({
        show: true,
        component: (
          <SessionExpiredNotification
            timeRemaining={
              remainingSessionTimeIsLessThanTenMinutes && diff < 0 ? 0 : diff
            }
          />
        ),
        noCancel: true,
        okText: "Yes, keep my session active",
        closeAfterConfirmation: true,
        onConfirm: () => this.requestTokenRefresh(counterThread),
      });
    }, sessionTime);
  }

  render() {
    const { auth, signOut } = this.props;

    const {
      changeMode,
      history,
      modalOptions,
      toggleUniversalModal,
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
    const {
      component,
      show,
      onConfirm,
      onCancel,
      closeAfterConfirmation,
    } = modalOptions;

    return (
      <Dashboard history={history} changeMode={changeMode}>
        <ThemeModal
          {...modalOptions || {}}
          open={show}
          onConfirm={onConfirm}
          onCancel={() => {
            if (onCancel) onCancel();
          }}
          close={() => toggleUniversalModal({ show: false })}
          closeAfterConfirmation={closeAfterConfirmation}
        >
          {component}
        </ThemeModal>

        <Switch>
          {user.is_community_admin && communityAdminSpecialRoutes}
          {user.is_super_admin && superAdminSpecialRoutes}

          <Route exact path="/blank" component={BlankPage} />
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
          <Route path="/admin/read/communities" component={AllCommunities} />
          <Route path="/admin/add/community" component={OnboardCommunity} />
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
          <Route path="/admin/add/action" component={AddAction} />
          <Route path="/admin/edit/:id/action" component={EditAction} exact />
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
          <Route path="/admin/read/categories" component={AllCategories} />
          <Route path="/admin/add/category" component={AddCategory} />
          <Route path="/admin/read/tag-collections" component={AllCategories} />
          <Route path="/admin/add/tag-collection" component={AddCategory} />
          <Route
            path="/admin/edit/:id/tag-collection"
            component={EditCategory}
          />
          <Route path="/admin/read/events" component={AllEvents} />
          <Route path="/admin/add/event" component={AddEvent} />
          <Route path="/admin/edit/:id/event" component={EditEvent} />
          <Route path="/admin/edit/:id/event-rsvps" component={EventRSVPs} />
          <Route path="/admin/read/teams" exact component={AllTeams} />
          <Route path="/admin/add/team" component={AddTeam} />
          <Route path="/admin/edit/:id/team" component={EditTeam} />
          <Route path="/admin/edit/:id/team-members" component={TeamMembers} />
          <Route path="/admin/read/subscribers" component={AllSubscribers} />
          <Route path="/admin/read/policies" component={AllPolicies} />
          <Route path="/admin/add/policy" component={AddPolicy} />
          <Route path="/admin/edit/:id/policy" component={EditPolicy} />
          <Route path="/admin/read/goals" component={AllGoals} />
          <Route path="/admin/add/goal" component={AddGoal} />
          <Route path="/admin/edit/:id/goal" component={EditGoal} />
          <Route path="/admin/read/testimonials" component={AllTestimonials} />
          <Route path="/admin/add/testimonial" component={AddTestimonial} />
          <Route
            path="/admin/edit/:id/testimonial"
            component={EditTestimonial}
          />
          <Route path="/admin/read/vendors" component={AllVendors} />
          <Route path="/admin/add/vendor" component={AddVendor} />
          <Route path="/admin/edit/:id/vendor" component={EditVendor} />
          <Route path="/admin/export" component={Export} />
          <Route path="/admin/customize" component={CustomizePages} />
          <Route path="/admin/read/categories" component={AllCategories} />
          <Route path="/admin/add/category" component={AddCategory} />
          <Route path="/admin/form" component={Form} />
          <Route path="/admin/table" component={Table} />
          <Route path="/admin/page-list" component={Parent} />
          <Route path="/admin/pages/not-found" component={NotFound} />
          <Route path="/admin/pages/error" component={Error} />
          <Route path="/admin/edit/:id/home" component={SuperHome} />
          <Route path="/admin/edit/:id/impacts" component={Impact} />
          <Route path="/admin/edit/:id/impact" component={ImpactPage} />
          <Route path="/admin/edit/:id/actions" component={SuperAllActions} />
          <Route
            path="/admin/edit/:id/all-actions"
            component={SuperAllActions}
          />
          <Route path="/admin/edit/:id/events" component={EventsPage} />
          <Route path="/admin/edit/:id/teams" component={TeamsPage} />
          <Route path="/admin/edit/:id/vendors" component={VendorsPage} />
          <Route path="/admin/edit/:id/signin" component={SigninPage} />
          <Route path="/admin/edit/:id/registration" component={RegisterPage} />
          <Route
            path="/admin/edit/:id/testimonials"
            component={TestimonialsPage}
          />
          <Route path="/admin/edit/:id/contact_us" component={SuperContactUs} />
          <Route path="/admin/edit/:id/donate" component={SuperDonate} />
          <Route path="/admin/edit/:id/about" component={SuperAboutUs} />
          <Route path="/admin/edit/:id/about_us" component={SuperAboutUs} />
          <Route path="/admin/read/about-us" component={SuperAboutUs} />
          <Route path="/admin/add/donate" component={SuperDonate} />
          <Route path="/admin/read/contact-us" component={SuperContactUs} />
          <Route path="/admin/read/all-actions" component={SuperAllActions} />
          <Route exact path="/admin/gallery/" component={GalleryPage} />
          <Route exact path="/admin/gallery/add" component={AddToGallery} />
          <Route component={NotFound} />
        </Switch>
      </Dashboard>
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
    fireAuth: state.getIn(["fireAuth"]),
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      reduxCallCommunities,
      loadModalImages: reduxCallLibraryModalImages,
      fetchInitialContent: reduxFetchInitialContent,
      toggleUniversalModal: reduxToggleUniversalModal,
      putAdminBackInRedux: reduxLoadAuthAdmin,
      trackFirebaseAuthenticationChanges,
    },
    dispatch
  );
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Application);

const SessionExpiredNotification = ({ timeRemaining }) => {
  const [time, setTime] = useState(null);
  setInterval(() => {
    const diff = time - 1;
    if (diff === 0) window.location = "/login"; // Redirect to login at the end of the alloted time
    setTime(diff);
  }, 60000);

  useEffect(() => {
    setTime(timeRemaining || 9);
  }, []);

  return (
    <div>
      <Typography>
        Your session is almost about to expire. You have{" "}
        <b>
          {time} minute{time === 1 ? "" : "s"}
        </b>{" "}
        left, would you like to keep this session active?
      </Typography>
    </div>
  );
};
