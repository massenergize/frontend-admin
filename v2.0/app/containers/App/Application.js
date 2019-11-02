import React from 'react';
import { PropTypes } from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dashboard from '../Templates/Dashboard';
import { reduxCallCommunities, reduxCheckUser } from "../../redux/redux-actions/adminActions";
import {
  Parent,
  DashboardSummaryPage,
  AllCommunities,
  OnboardCommunity,
  CommunityProfile,
  AllVendors, AddVendor,
  AllCategories,
  AddCategory,
  BlankPage,
  Form,
  Table,
  Error,
  NotFound,
  AddAction, AllActions,
  AllEvents, AddEvent,
  AddTeam, AllTeams,
  AllGoals, AddGoal,
  AddPolicy, AllPolicies,
  DashboardAdminSummaryPage,
  AddTestimonial, AllTestimonials, Export, CustomizePages, EditAction,
  SuperAllActions, SuperContactUs, SuperHome, SuperAboutUs, SuperDonate, EditGoal, EditPolicy, EditEvent
} from '../pageListAsync';
import EditVendor from '../MassEnergizeSuperAdmin/Vendors/EditVendor';
import AddRemoveAdmin from '../MassEnergizeSuperAdmin/Community/AddRemoveAdmin';
import AddRemoveSuperAdmin from '../MassEnergizeSuperAdmin/Community/AddRemoveSuperAdmin';
import EditCommunityByCommunityAdmin from '../MassEnergizeSuperAdmin/Community/EditCommunityByCommunityAdmin';


class Application extends React.Component {
  componentWillMount() {
    this.props.reduxCallCommunities();
  }

  render() {
    const { changeMode, history } = this.props;
    const user = this.props.auth;

    return (
      <Dashboard history={history} changeMode={changeMode}>
        <Switch>
          { (user.is_community_admin) 
            && (
              <Route exact path="/" render={(props) => <DashboardAdminSummaryPage {...props} signOut= {this.props.signOut} />} />
            )
          }
          { (user.is_super_admin) 
            && (
              <Route exact path="/" render={(props) => <DashboardSummaryPage {...props} signOut= {this.props.signOut} />} />
            )
          }
          { user.is_community_admin 
            && (
              <Route exact path="/admin" render={(props) => <DashboardAdminSummaryPage {...props} signOut ={this.props.signOut} />} />
            )
          }
          { user.is_super_admin && (
            <Route exact path="/admin" render={(props) => <DashboardSummaryPage {...props} signOut= {this.props.signOut} />} />
          )
          }
          {/* <Route exact path="/" render={(props) =><DashboardSummaryPage {...props} signOut = {this.props.signOut} />} />
          <Route exact path="/admin" render={(props) =><DashboardSummaryPage {...props} signOut = {this.props.signOut} />} /> */}
          <Route exact path="/blank" component={BlankPage} />
          <Route path="/admin/dashboard" component={DashboardSummaryPage} />

          <Route path="/admin/read/communities" component={AllCommunities} />
          <Route path="/admin/add/community" component={OnboardCommunity} />
          <Route path="/admin/community/:id" component={CommunityProfile} exact />
          <Route path="/admin/community/:id/preview" component={CommunityProfile} exact />
          <Route path="/admin/community/:id/profile" component={CommunityProfile} exact />
          <Route path="/admin/community/:id/edit" component={OnboardCommunity} exact />
          <Route path="/admin/edit/:id/community/community-admin" component={EditCommunityByCommunityAdmin} exact />
          <Route path="/admin/edit/:id/community" component={OnboardCommunity} exact />
          <Route path="/admin/add/:id/community-admins" component={AddRemoveAdmin} exact />
          <Route path="/admin/edit/:id/community-admins" component={AddRemoveAdmin} exact />
          <Route path="/admin/add-super-admin" component={AddRemoveSuperAdmin} exact />

          <Route path="/admin/read/actions" component={AllActions} />
          <Route path="/admin/add/action" component={AddAction} />
          <Route path="/admin/edit/:id/action" component={EditAction} exact />
          <Route path="/admin/add/action/:id" component={EditAction} />

          <Route path="/admin/read/categories" component={AllCategories} />
          <Route path="/admin/add/category" component={AddCategory} />
          <Route path="/admin/read/tag-collections" component={AllCategories} />
          <Route path="/admin/add/tag-collection" component={AddCategory} />

          <Route path="/admin/read/events" component={AllEvents} />
          <Route path="/admin/add/event" component={AddEvent} />
          <Route path="/admin/edit/:id/event" component={EditEvent} />

          <Route path="/admin/read/teams" component={AllTeams} />
          <Route path="/admin/add/team" component={AddTeam} />

          <Route path="/admin/read/policies" component={AllPolicies} />
          <Route path="/admin/add/policy" component={AddPolicy} />
          <Route path="/admin/edit/:id/policy" component={EditPolicy} />

          <Route path="/admin/read/goals" component={AllGoals} />
          <Route path="/admin/add/goal" component={AddGoal} />
          <Route path="/admin/edit/:id/goal" component={EditGoal} />

          <Route path="/admin/read/testimonials" component={AllTestimonials} />
          <Route path="/admin/add/testimonial" component={AddTestimonial} />

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
          <Route path="/admin/edit/:id/actions" component={SuperAllActions} />
          <Route path="/admin/edit/:id/all-actions" component={SuperAllActions} />
          <Route path="/admin/edit/:id/contact_us" component={SuperContactUs} />
          <Route path="/admin/edit/:id/donate" component={SuperDonate} />
          <Route path="/admin/edit/:id/about" component={SuperAboutUs} />
          <Route path="/admin/edit/:id/about_us" component={SuperAboutUs} />
          <Route path="/admin/read/about-us" component={SuperAboutUs} />
          <Route path="/admin/add/donate" component={SuperDonate} />
          <Route path="/admin/read/contact-us" component={SuperContactUs} />
          <Route path="/admin/read/all-actions" component={SuperAllActions} />
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
    auth: state.getIn(['auth'])
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    reduxCallCommunities,
    checkUser: reduxCheckUser
  }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Application);
