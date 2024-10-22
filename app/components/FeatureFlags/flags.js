export const USER_PORTAL_FLAGS = {
  USER_PORTAL_GUEST_AUTHENTICATION: "guest-authentication-feature-flag",
  USER_PORTAL_COMMUNICATION_PREFS: "communication-prefs-feature-flag",
  USER_PORTAL_USER_SUBMITTED_ACTIONS: "user-submitted-actions-feature-flag",
  USER_PORTAL_USER_SUBMITTED_EVENTS: "user-submitted-events-feature-flag",
  USER_PORTAL_USER_SUBMITTED_VENDORS: "user-submitted-vendors-feature-flag",
  USER_PORTAL_USER_SUBMITTED_TESTIMONIALS: "user-submitted-testimonials-feature-flag"
};

export const FLAGS = {
  EVENT_SPECIFIC_NOTIFICATION_SETTINGS:"event-specific-notification-settings-feature-flag",
  NEW_USER_ENGAGEMENT_VIEW: "new-user-engagement-view-feature-flag",
  BROADCAST_MESSAGING_FF: "scheduled-broadcast-messages-feature-flag",
  NUDGE_CONTROL_FEATURE: "nudge-control-feature-flag",
  PLATFORM_FEATURES_OPT_IN: "platform-feature-opt-in-feature-flag",
  EVENT_NUDGE_FEATURE_FLAG_KEY : "user-event-nudge-feature-flag",
  CUSTOMIZE_NAVIGATION_MENU: "customize-navigation-menu-feature-flag",
  CUSTOMIZE_AUTO_SHARE_SETTINGS: "shared-testimonials-nudge-feature-flag",
  ...USER_PORTAL_FLAGS
};
