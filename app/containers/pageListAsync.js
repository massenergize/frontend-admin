import React from "react";
import Loading from "dan-components/Loading";
import loadable from "../utils/loadable";

export const FeatureFlags = loadable(
  () => import("./MassEnergizeSuperAdmin/Feature Flags/FeatureFlags"),
  {
    fallback: <Loading />,
  }
);
export const Settings = loadable(
  () => import("./MassEnergizeSuperAdmin/Settings/Settings"),
  {
    fallback: <Loading />,
  }
);
export const AddToGallery = loadable(
  () => import("./MassEnergizeSuperAdmin/Gallery/AddToGallery"),
  {
    fallback: <Loading />,
  }
);
export const GalleryPage = loadable(
  () => import("./MassEnergizeSuperAdmin/Gallery/Gallery"),
  {
    fallback: <Loading />,
  }
);
export const SuperHome = loadable(
  () => import("./MassEnergizeSuperAdmin/Pages/Home"),
  {
    fallback: <Loading />,
  }
);
export const Impact = loadable(
  () => import("./MassEnergizeSuperAdmin/Pages/Impact"),
  {
    fallback: <Loading />,
  }
);
export const ImpactPage = loadable(
  () => import("./MassEnergizeSuperAdmin/Pages/ImpactPage"),
  {
    fallback: <Loading />,
  }
);
export const SuperAllActions = loadable(
  () => import("./MassEnergizeSuperAdmin/Pages/Actions"),
  {
    fallback: <Loading />,
  }
);

export const SuperDonate = loadable(
  () => import("./MassEnergizeSuperAdmin/Pages/Donate"),
  {
    fallback: <Loading />,
  }
);
export const SuperContactUs = loadable(
  () => import("./MassEnergizeSuperAdmin/Pages/ContactUs"),
  {
    fallback: <Loading />,
  }
);
export const SuperAboutUs = loadable(
  () => import("./MassEnergizeSuperAdmin/Pages/AboutUs"),
  {
    fallback: <Loading />,
  }
);
// Events page settings
export const EventsPage = loadable(
  () => import("./MassEnergizeSuperAdmin/Pages/Events"),
  {
    fallback: <Loading />,
  }
);
// Vendors page settings
export const VendorsPage = loadable(
  () => import("./MassEnergizeSuperAdmin/Pages/Vendors"),
  {
    fallback: <Loading />,
  }
);
// Teams page settings
export const TeamsPage = loadable(
  () => import("./MassEnergizeSuperAdmin/Pages/Teams"),
  {
    fallback: <Loading />,
  }
);
// Testimonials page settings
export const TestimonialsPage = loadable(
  () => import("./MassEnergizeSuperAdmin/Pages/Testimonials"),
  {
    fallback: <Loading />,
  }
);
export const BlankPage = loadable(() => import("./Pages/BlankPage"), {
  fallback: <Loading />,
});
export const DashboardSummaryPage = loadable(
  () => import("./MassEnergizeSuperAdmin/Summary"),
  {
    fallback: <Loading />,
  }
);

export const DashboardAdminSummaryPage = loadable(
  () => import("./MassEnergizeSuperAdmin/Summary/NormalAdminHome"),
  {
    fallback: <Loading />,
  }
);
export const AllCommunities = loadable(
  () => import("./MassEnergizeSuperAdmin/Community/AllCommunities"),
  {
    fallback: <Loading />,
  }
);
export const OnboardCommunity = loadable(
  () => import("./MassEnergizeSuperAdmin/Community/OnboardCommunity"),
  {
    fallback: <Loading />,
  }
);
export const EditCommunityByCommunityAdmin = loadable(
  () =>
    import("./MassEnergizeSuperAdmin/Community/EditCommunityByCommunityAdmin"),
  {
    fallback: <Loading />,
  }
);

export const CommunityProfile = loadable(
  () => import("./MassEnergizeSuperAdmin/Community/CommunityProfile"),
  {
    fallback: <Loading />,
  }
);

export const AddRemoveCommunityAdmin = loadable(
  () => import("./MassEnergizeSuperAdmin/Community/AddRemoveAdmin"),
  {
    fallback: <Loading />,
  }
);

export const CommunityAdminMessages = loadable(
  () => import("./MassEnergizeSuperAdmin/Messages/CommunityAdminMessages"),
  {
    fallback: <Loading />,
  }
);
export const TeamAdminMessages = loadable(
  () => import("./MassEnergizeSuperAdmin/Messages/TeamAdminMessages"),
  {
    fallback: <Loading />,
  }
);
export const MessageDetails = loadable(
  () => import("./MassEnergizeSuperAdmin/Messages/MessageDetails"),
  {
    fallback: <Loading />,
  }
);

export const AddRemoveSuperAdmin = loadable(
  () => import("./MassEnergizeSuperAdmin/Community/AddRemoveSuperAdmin"),
  {
    fallback: <Loading />,
  }
);

export const AddCategory = loadable(
  () => import("./MassEnergizeSuperAdmin/Categories/AddCategory"),
  {
    fallback: <Loading />,
  }
);



export const EditCategory = loadable(
  () => import("./MassEnergizeSuperAdmin/Categories/EditCategory"),
  {
    fallback: <Loading />,
  }
);
export const AllCategories = loadable(
  () => import("./MassEnergizeSuperAdmin/Categories/AllCategories"),
  {
    fallback: <Loading />,
  }
);

export const AddCarbonEquivalency = loadable(
  () =>
    import("./MassEnergizeSuperAdmin/CarbonEquivalencies/AddCarbonEquivalency"),
  {
    fallback: <Loading />,
  }
);

export const EditCarbonEquivalency = loadable(
  () =>
    import(
      "./MassEnergizeSuperAdmin/CarbonEquivalencies/EditCarbonEquivalency"
    ),
  {
    fallback: <Loading />,
  }
);
export const AllCarbonEquivalencies = loadable(
  () =>
    import(
      "./MassEnergizeSuperAdmin/CarbonEquivalencies/AllCarbonEquivalencies"
    ),
  {
    fallback: <Loading />,
  }
);

export const AllSubscribers = loadable(
  () => import("./MassEnergizeSuperAdmin/Subscribers/AllSubscribers"),
  {
    fallback: <Loading />,
  }
);

export const AllActions = loadable(
  () => import("./MassEnergizeSuperAdmin/Actions/AllActions"),
  {
    fallback: <Loading />,
  }
);
export const AddAction = loadable(
  () => import("./MassEnergizeSuperAdmin/Actions/CreateNewAction"),
  {
    fallback: <Loading />,
  }
);

export const EditAction = loadable(
  () => import("./MassEnergizeSuperAdmin/Actions/EditActionForm"),
  {
    fallback: <Loading />,
  }
);

export const AllEvents = loadable(
  () => import("./MassEnergizeSuperAdmin/Events/AllEvents"),
  {
    fallback: <Loading />,
  }
);
export const AddEvent = loadable(
  () => import("./MassEnergizeSuperAdmin/Events/NewEventPage"),
  {
    fallback: <Loading />,
  }
);
export const EditEvent = loadable(
  () => import("./MassEnergizeSuperAdmin/Events/NewEventPage"),
  {
    fallback: <Loading />,
  }
);

export const AllTeams = loadable(
  () => import("./MassEnergizeSuperAdmin/Teams/AllTeams"),
  {
    fallback: <Loading />,
  }
);
export const AddTeam = loadable(
  () => import("./MassEnergizeSuperAdmin/Teams/CreateNewTeam"),
  {
    fallback: <Loading />,
  }
);
export const EditTeam = loadable(
  () => import("./MassEnergizeSuperAdmin/Teams/EditTeam"),
  {
    fallback: <Loading />,
  }
);
export const TeamMembers = loadable(
  () => import("./MassEnergizeSuperAdmin/Teams/TeamMembers"),
  {
    fallback: <Loading />,
  }
);

export const AllGoals = loadable(
  () => import("./MassEnergizeSuperAdmin/Goals/AllGoals"),
  {
    fallback: <Loading />,
  }
);

export const EditGoal = loadable(
  () => import("./MassEnergizeSuperAdmin/Goals/GoalPage"),
  {
    fallback: <Loading />,
  }
);

export const EditPolicy = loadable(
  () => import("./MassEnergizeSuperAdmin/Policies/CreatePolicy"),
  {
    fallback: <Loading />,
  }
);
export const AddGoal = loadable(
  () => import("./MassEnergizeSuperAdmin/Goals/GoalPage"),
  {
    fallback: <Loading />,
  }
);

export const AllPolicies = loadable(
  () => import("./MassEnergizeSuperAdmin/Policies/AllPolicies"),
  {
    fallback: <Loading />,
  }
);
export const AddPolicy = loadable(
  () => import("./MassEnergizeSuperAdmin/Policies/CreatePolicy"),
  {
    fallback: <Loading />,
  }
);

export const AllTestimonials = loadable(
  () => import("./MassEnergizeSuperAdmin/Testimonials/AllTestimonials"),
  {
    fallback: <Loading />,
  }
);
export const AddTestimonial = loadable(
  () => import("./MassEnergizeSuperAdmin/Testimonials/CreateNewTestimonial"),
  {
    fallback: <Loading />,
  }
);
export const EditTestimonial = loadable(
  () => import("./MassEnergizeSuperAdmin/Testimonials/EditTestimonial"),
  {
    fallback: <Loading />,
  }
);

export const AddVendor = loadable(
  () => import("./MassEnergizeSuperAdmin/Vendors/AddVendor"),
  {
    fallback: <Loading />,
  }
);

export const EditVendor = loadable(
  () => import("./MassEnergizeSuperAdmin/Vendors/EditVendor"),
  {
    fallback: <Loading />,
  }
);
export const AllVendors = loadable(
  () => import("./MassEnergizeSuperAdmin/Vendors/AllVendors"),
  {
    fallback: <Loading />,
  }
);

export const Export = loadable(
  () => import("./MassEnergizeSuperAdmin/Export"),
  {
    fallback: <Loading />,
  }
);

export const CustomizePages = loadable(
  () => import("./MassEnergizeSuperAdmin/CustomizePages"),
  {
    fallback: <Loading />,
  }
);

export const Form = loadable(() => import("./Pages/Forms/ReduxForm"), {
  fallback: <Loading />,
});
export const Table = loadable(() => import("./Pages/Table/BasicTable"), {
  fallback: <Loading />,
});
export const Login = loadable(
  () => import("./MassEnergizeSuperAdmin/LoginAndRegistration/Login"),
  {
    fallback: <Loading />,
  }
);
export const LoginDedicated = loadable(
  () => import("./Pages/Standalone/LoginDedicated"),
  {
    fallback: <Loading />,
  }
);
export const Register = loadable(
  () => import("./MassEnergizeSuperAdmin/LoginAndRegistration/Register"),
  {
    fallback: <Loading />,
  }
);
export const ResetPassword = loadable(
  () => import("./MassEnergizeSuperAdmin/LoginAndRegistration/ResetPassword"),
  {
    fallback: <Loading />,
  }
);
export const NotFound = loadable(() => import("./NotFound/NotFound"), {
  fallback: <Loading />,
});
export const NotFoundDedicated = loadable(
  () => import("./Pages/Standalone/NotFoundDedicated"),
  {
    fallback: <Loading />,
  }
);
export const Error = loadable(() => import("./Pages/Error"), {
  fallback: <Loading />,
});
export const Maintenance = loadable(() => import("./Pages/Maintenance"), {
  fallback: <Loading />,
});
export const ComingSoon = loadable(() => import("./Pages/ComingSoon"), {
  fallback: <Loading />,
});
export const Parent = loadable(() => import("./Parent"), {
  fallback: <Loading />,
});
export const UsersList = loadable(
  () => import("./MassEnergizeSuperAdmin/Users/AllUsers"),
  {
    fallback: <Loading />,
  }
);
export const ImportContacts = loadable(
  () => import("./MassEnergizeSuperAdmin/Summary/ImportContacts"),
  {
    fallback: <Loading />,
  }
);

export const AddTask = loadable(
  () => import("./MassEnergizeSuperAdmin/Tasks/CreateTask"),
  {
    fallback: <Loading />,
  }
);

export const ListTasks = loadable(
  () => import("./MassEnergizeSuperAdmin/Tasks/AllTasks"),
  {
    fallback: <Loading />,
  }
);