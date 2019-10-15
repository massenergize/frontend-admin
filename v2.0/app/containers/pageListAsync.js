import React from 'react';
import Loading from 'dan-components/Loading';
import loadable from '../utils/loadable';

export const SuperHome = loadable(() => import('./Pages/CustomPages/AdminEditHome'), {
  fallback: <Loading />,
});
export const SuperAllActions = loadable(() => import('./MassEnergizeSuperAdmin/Pages/AllActions'), {
  fallback: <Loading />,
});

export const SuperDonate = loadable(() => import('./MassEnergizeSuperAdmin/Pages/Donate'), {
  fallback: <Loading />,
});
export const SuperContactUs = loadable(() => import('./MassEnergizeSuperAdmin/Pages/ContactUs'), {
  fallback: <Loading />,
});
export const SuperAboutUs = loadable(() => import('./MassEnergizeSuperAdmin/Pages/AboutUs'), {
  fallback: <Loading />,
});
export const BlankPage = loadable(() => import('./Pages/BlankPage'), {
  fallback: <Loading />,
});
export const DashboardSummaryPage = loadable(() => import('./MassEnergizeSuperAdmin/Summary'), {
  fallback: <Loading />,
}); 
export const AllCommunities = loadable(() => import('./MassEnergizeSuperAdmin/Community/AllCommunities'), {
  fallback: <Loading />,
});
export const OnboardCommunity = loadable(() => import('./MassEnergizeSuperAdmin/Community/OnboardCommunity'), {
  fallback: <Loading />,
});

export const CommunityProfile = loadable(() => import('./MassEnergizeSuperAdmin/Community/CommunityProfile'), {
  fallback: <Loading />,
});


export const AddCategory = loadable(() => import('./MassEnergizeSuperAdmin/Categories/AddCategory'), {
  fallback: <Loading />,
});
export const AllCategories = loadable(() => import('./MassEnergizeSuperAdmin/Categories/AllCategories'), {
  fallback: <Loading />,
});

export const AllActions = loadable(() => import('./MassEnergizeSuperAdmin/Actions/AllActions'), {
  fallback: <Loading />,
});
export const AddAction = loadable(() => import('./MassEnergizeSuperAdmin/Actions/CreateNewAction'), {
  fallback: <Loading />,
});

export const EditAction = loadable(() => import('./MassEnergizeSuperAdmin/Actions/EditActionForm'), {
  fallback: <Loading />,
});

export const AllEvents = loadable(() => import('./MassEnergizeSuperAdmin/Events/AllEvents'), {
  fallback: <Loading />,
});
export const AddEvent = loadable(() => import('./MassEnergizeSuperAdmin/Events/NewEventPage'), {
  fallback: <Loading />,
});

export const AllTeams = loadable(() => import('./MassEnergizeSuperAdmin/Teams/AllTeams'), {
  fallback: <Loading />,
});
export const AddTeam = loadable(() => import('./MassEnergizeSuperAdmin/Teams/CreateNewTeam'), {
  fallback: <Loading />,
});

export const AllGoals = loadable(() => import('./MassEnergizeSuperAdmin/Goals/AllGoals'), {
  fallback: <Loading />,
});

export const EditGoal = loadable(() => import('./MassEnergizeSuperAdmin/Goals/GoalPage'), {
  fallback: <Loading />,
});

export const EditPolicy = loadable(() => import('./MassEnergizeSuperAdmin/Policies/CreatePolicy'), {
  fallback: <Loading />,
});
export const AddGoal = loadable(() => import('./MassEnergizeSuperAdmin/Goals/GoalPage'), {
  fallback: <Loading />,
});

export const AllPolicies = loadable(() => import('./MassEnergizeSuperAdmin/Policies/AllPolicies'), {
  fallback: <Loading />,
});
export const AddPolicy = loadable(() => import('./MassEnergizeSuperAdmin/Policies/CreatePolicy'), {
  fallback: <Loading />,
});

export const AllTestimonials = loadable(() => import('./MassEnergizeSuperAdmin/Testimonials/AllTestimonials'), {
  fallback: <Loading />,
});
export const AddTestimonial = loadable(() => import('./MassEnergizeSuperAdmin/Testimonials/CreateNewTestimonial'), {
  fallback: <Loading />,
});

export const AddVendor = loadable(() => import('./MassEnergizeSuperAdmin/Vendors/AddVendor'), {
  fallback: <Loading />,
});
export const AllVendors = loadable(() => import('./MassEnergizeSuperAdmin/Vendors/AllVendors'), {
  fallback: <Loading />,
});

export const Export = loadable(() => import('./MassEnergizeSuperAdmin/Export'), {
  fallback: <Loading />,
});

export const CustomizePages = loadable(() => import('./MassEnergizeSuperAdmin/CustomizePages'), {
  fallback: <Loading />,
});


export const Form = loadable(() => import('./Pages/Forms/ReduxForm'), {
  fallback: <Loading />,
});
export const Table = loadable(() => import('./Pages/Table/BasicTable'), {
  fallback: <Loading />,
});
export const Login = loadable(() => import('./Pages/Users/Login'), {
  fallback: <Loading />,
});
export const LoginDedicated = loadable(() => import('./Pages/Standalone/LoginDedicated'), {
  fallback: <Loading />,
});
export const Register = loadable(() => import('./Pages/Users/Register'), {
  fallback: <Loading />,
});
export const ResetPassword = loadable(() => import('./Pages/Users/ResetPassword'), {
  fallback: <Loading />,
});
export const NotFound = loadable(() => import('./NotFound/NotFound'), {
  fallback: <Loading />,
});
export const NotFoundDedicated = loadable(() => import('./Pages/Standalone/NotFoundDedicated'), {
  fallback: <Loading />,
});
export const Error = loadable(() => import('./Pages/Error'), {
  fallback: <Loading />,
});
export const Maintenance = loadable(() => import('./Pages/Maintenance'), {
  fallback: <Loading />,
});
export const ComingSoon = loadable(() => import('./Pages/ComingSoon'), {
  fallback: <Loading />,
});
export const Parent = loadable(() => import('./Parent'), {
  fallback: <Loading />,
});
