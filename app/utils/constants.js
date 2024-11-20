export const RESTART_ON_REMOUNT = "@@saga-injector/restart-on-remount";
export const DAEMON = "@@saga-injector/daemon";
export const ONCE_TILL_UNMOUNT = "@@saga-injector/once-till-unmount";

export const LAST_VISITED = "LAST_VISITED_URL"; // Changed from LAST_VISITED just to give this a new start when deployed
export const LOADING = "LOADING";
export const TWENTY_FOUR_HOURS = 1000 * 60 * 60 * 24;
export const TIME_UNTIL_EXPIRATION = "TIME_UNTIL_EXPIRATION";
export const THREE_MINUTES = 1000 * 60 * 3;
export const CONNECTION_ESTABLISHED = "connection_established";
export const USER_SESSION_ALMOST_EXPIRED = "user_session_almost_expired";
export const USER_SESSION_EXPIRED = "user_session_expired";
export const USER_SESSION_RENEWED = "user_session_renewed";
export const FROM = {
  MAIN_EVENTS: "main",
  OTHER_EVENTS: "others"
};

export const DEFAULT_ITEMS_PER_PAGE = 25;
export const DEFAULT_ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];
export const NO_TITLES_FOR_THESE_PAGES = [
  "/admin/settings/platform-features",
  "/admin/settings/notification-control",
  "/admin/community/configure/navigation",
  "/admin/settings/auto-share"
];

export const AUDIENCES_CONFIG = {
  SUPER_ADMINS: {
    params: {
      membership: ["Super Admin"]
    },
    endpoint: "/users.listForCommunityAdmin"
  },
  COMMUNITY_CONTACTS: {
    params: {},
    endpoint: "/communities.listForCommunityAdmin"
  },
  COMMUNITY_ADMINS: {
    params: {
      membership: ["Community Admin"]
    },
    endpoint: "/users.listForCommunityAdmin"
  },
  USERS: {
    params: {
      membership: ["Member"]
    },
    endpoint: "/users.listForCommunityAdmin"
  },
  ACTIONS: {
    params: {
      live: ["Yes"]
    },
    endpoint: "/actions.listForCommunityAdmin"
  }
};

export const ALL = "all";

export const SUPER_ADMIN = "SUPER_ADMINS";
export const COMMUNITY_CONTACTS = "COMMUNITY_CONTACTS";
export const COMMUNITY_ADMIN = "COMMUNITY_ADMINS";
export const USERS = "USERS";
export const ACTIONS = "ACTIONS";
export const FROM_COMMUNITY = "FROM_COMMUNITY";
const SPECIFIC = "SPECIFIC";
const DONE = "DONE";
const TODO = "TODO";
const BOTH = "BOTH";

export const SUPER_ADMIN_AUDIENCE = [
  { id: SUPER_ADMIN, value: "Super Admins", subType: null },
  { id: COMMUNITY_CONTACTS, value: "Community Contacts", subType: null },
  {
    id: COMMUNITY_ADMIN,
    value: "Community Admins",
    audienceLabelText: "Select Community Admins",
    subType: [
      { id: FROM_COMMUNITY, value: "From Community", default: true },
      { id: SPECIFIC, value: "Specific Community Admin", default: false }
    ]
  },
  {
    id: USERS,
    value: "Users",
    audienceLabelText: "Select Users",
    subType: [
      { id: FROM_COMMUNITY, value: "From Community", default: true },
      { id: SPECIFIC, value: "Specific Users", default: false }
    ]
  },
  {
    id: ACTIONS,
    value: "Actions",
    audienceLabelText: "Select Action(s)",
    subType: [
      { id: DONE, value: "Marked As Completed", default: true },
      { id: TODO, value: "Marked As Todo", default: false },
      { id: BOTH, value: "Both Done & Todo", default: false }
    ]
  }
];

export const COMMUNITY_ADMIN_AUDIENCE = [
  {
    id: COMMUNITY_ADMIN,
    value: "Community Admins",
    audienceLabelText: "Select Community Admins",
    subType: [
      { id: FROM_COMMUNITY, value: "From Community", default: true },
      { id: SPECIFIC, value: "Specific Community Admin", default: false }
    ]
  },
  {
    id: USERS,
    value: "Users",
    audienceLabelText: "Select Users",
    subType: [
      { id: FROM_COMMUNITY, value: "From Community", default: true },
      { id: SPECIFIC, value: "Specific Users", default: false }
    ]
  },
  {
    id: ACTIONS,
    value: "Actions",
    audienceLabelText: "Select Action(s)",
    subType: [
      { id: DONE, value: "Marked As Completed", default: true },
      { id: TODO, value: "Marked As Todo", default: false },
      { id: BOTH, value: "Both Done & Todo", default: false }
    ]
  }
];

export const APP_LINKS = {
  PAGE_BUILDER_CREATE_OR_EDIT: "/admin/community/community/manage/custom-page",
  PAGE_BUILDER_VIEW_PAGES: "/admin/community/list/custom/pages"
};
