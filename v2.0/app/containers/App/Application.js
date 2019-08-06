import React from 'react';
import { PropTypes } from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import Dashboard from '../Templates/Dashboard';
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
  AddTestimonial, AllTestimonials, Export, CustomizePages
} from '../pageListAsync';
import EditCommunityForm from '../MassEnergizeSuperAdmin/Community/EditCommunityForm';

class Application extends React.Component {
  render() {
    const { changeMode, history } = this.props;
    return (
      <Dashboard history={history} changeMode={changeMode}>
        <Switch>
          <Route exact path="/" component={DashboardSummaryPage} />
          <Route exact path="/admin" component={DashboardSummaryPage} />
          <Route exact path="/blank" component={BlankPage} />
          <Route path="/admin/dashboard" component={DashboardSummaryPage} />

          <Route path="/admin/read/communities" component={AllCommunities} />
          <Route path="/admin/add/community" component={OnboardCommunity} />
          <Route path="/admin/community/:id" component={CommunityProfile} exact />
          <Route path="/admin/community/:id/preview" component={CommunityProfile} exact />
          <Route path="/admin/community/:id/profile" component={CommunityProfile} exact />
          <Route path="/admin/community/:id/edit" component={OnboardCommunity} exact />

          <Route path="/admin/read/actions" component={AllActions} />
          <Route path="/admin/add/action" component={AddAction} />

          <Route path="/admin/read/categories" component={AllCategories} />
          <Route path="/admin/add/category" component={AddCategory} />
          <Route path="/admin/read/tag-collections" component={AllCategories} />
          <Route path="/admin/add/tag-collection" component={AddCategory} />

          <Route path="/admin/read/events" component={AllEvents} />
          <Route path="/admin/add/event" component={AddEvent} />

          <Route path="/admin/read/teams" component={AllTeams} />
          <Route path="/admin/add/team" component={AddTeam} />

          <Route path="/admin/read/policies" component={AllPolicies} />
          <Route path="/admin/add/policy" component={AddPolicy} />

          <Route path="/admin/read/goals" component={AllGoals} />
          <Route path="/admin/add/goal" component={AddGoal} />

          <Route path="/admin/read/testimonials" component={AllTestimonials} />
          <Route path="/admin/add/testimonial" component={AddTestimonial} />

          <Route path="/admin/read/vendors" component={AllVendors} />
          <Route path="/admin/add/vendor" component={AddVendor} />

          <Route path="/admin/export" component={Export} />

          <Route path="/admin/customize" component={CustomizePages} />

          <Route path="/admin/read/categories" component={AllCategories} />
          <Route path="/admin/add/category" component={AddCategory} />
          <Route path="/admin/form" component={Form} />
          <Route path="/admin/table" component={Table} />
          <Route path="/admin/page-list" component={Parent} />
          <Route path="/admin/pages/not-found" component={NotFound} />
          <Route path="/admin/pages/error" component={Error} />
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

export default Application;
