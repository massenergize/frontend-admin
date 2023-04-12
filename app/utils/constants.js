export const RESTART_ON_REMOUNT = "@@saga-injector/restart-on-remount";
export const DAEMON = "@@saga-injector/daemon";
export const ONCE_TILL_UNMOUNT = "@@saga-injector/once-till-unmount";

export const LAST_VISITED = "LAST_VISITED_URL"; // Changed from LAST_VISITED just to give this a new start when deployed
export const LOADING = "LOADING";
export const TWENTY_FOUR_HOURS = 1000 * 60 * 60 * 24;
export const TIME_UNTIL_EXPIRATION = "TIME_UNTIL_EXPIRATION";
export const THREE_MINUTES = 1000 * 60 * 3;

export const FROM = {
  MAIN_EVENTS: "main",
  OTHER_EVENTS: "others",
};
