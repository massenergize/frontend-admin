import React from 'react';
import { PropTypes } from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import Dashboard from '../Templates/Dashboard';
import {
  Parent,
  DashboardSummaryPage,
  AllCommunities,
  OnboardCommunity,
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
import AllVendors from '../MassEnergizeSuperAdmin/Vendors/AllVendors';
import AddVendor from '../MassEnergizeSuperAdmin/Vendors/AddVendor';

class Application extends React.Component {
  render() {
    const { changeMode, history } = this.props;
    return (
      <Dashboard history={history} changeMode={changeMode}>
        <Switch>
          <Route exact path="/app" component={BlankPage} />
          <Route exact path="/communities" component={BlankPage} />
          <Route path="/app/dashboard" component={DashboardSummaryPage} />

          <Route path="/app/read/communities" component={AllCommunities} />
          <Route path="/app/add/community" component={OnboardCommunity} />

          <Route path="/app/read/actions" component={AllActions} />
          <Route path="/app/add/action" component={AddAction} />

          <Route path="/app/read/categories" component={AllCategories} />
          <Route path="/app/add/category" component={AddCategory} />

          <Route path="/app/read/events" component={AllEvents} />
          <Route path="/app/add/event" component={AddEvent} />

          <Route path="/app/read/teams" component={AllTeams} />
          <Route path="/app/add/team" component={AddTeam} />

          <Route path="/app/read/policies" component={AllPolicies} />
          <Route path="/app/add/policy" component={AddPolicy} />

          <Route path="/app/read/goals" component={AllGoals} />
          <Route path="/app/add/goal" component={AddGoal} />

          <Route path="/app/read/testimonials" component={AllTestimonials} />
          <Route path="/app/add/testimonial" component={AddTestimonial} />

          <Route path="/app/read/vendors" component={AllVendors} />
          <Route path="/app/add/vendor" component={AddVendor} />

          <Route path="/app/export" component={Export} />

          <Route path="/app/customize" component={CustomizePages} />

          <Route path="/app/read/categories" component={AllCategories} />
          <Route path="/app/add/category" component={AddCategory} />
          <Route path="/app/form" component={Form} />
          <Route path="/app/table" component={Table} />
          <Route path="/app/page-list" component={Parent} />
          <Route path="/app/pages/not-found" component={NotFound} />
          <Route path="/app/pages/error" component={Error} />
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
