import React from "react";
import { PropTypes } from "prop-types";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Dashboard from "../Templates/Dashboard";
import {
  reduxCallCommunities,
  reduxCallLibraryModalImages,
  reduxCheckUser,
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

class Application extends React.Component {
  componentWillMount() {
    this.props.reduxCallCommunities();
  }

  getCommunityList() {
    const { auth } = this.props;
    const list = (auth && auth.admin_at) || [];
    return list.map((com) => com.id);
  }

  render() {
    const { auth, signOut } = this.props;

    const { changeMode, history } = this.props;
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

    return (
      <Dashboard history={history} changeMode={changeMode}>
        <Switch>
          {user.is_community_admin && communityAdminSpecialRoutes}
          {user.is_super_admin && superAdminSpecialRoutes}

          <Route exact path="/blank" component={BlankPage} />
          <Route path="/admin/read/users" component={UsersList} />
          <Route
            path="/admin/read/community_admin_messages"
            exact
            component={CommunityAdminMessages}
          />
          <Route
            path="/admin/read/team_admin_messages"
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
          <Route path="/admin/edit/:id/event_rsvps" component={EventRSVPs} />
          <Route path="/admin/read/teams" exact component={AllTeams} />
          <Route path="/admin/add/team" component={AddTeam} />
          <Route path="/admin/edit/:id/team" component={EditTeam} />
          <Route path="/admin/edit/:id/team_members" component={TeamMembers} />
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
          <Route path="/admin/edit/:id/testimonials" component={TestimonialsPage} />
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
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      reduxCallCommunities,
      checkUser: reduxCheckUser,
      loadModalImages: reduxCallLibraryModalImages,
    },
    dispatch
  );
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Application);
