/** *
 * All utility Functions
 */
import { Typography } from "@mui/material";
import moment from "moment";
import qs from "qs";
import React from "react";
import { ME_FORM_PROGRESS } from "../containers/MassEnergizeSuperAdmin/ME  Tools/MEConstants";
import { apiCall } from "./messenger";

export function isValidURL(url) {
  const urlPattern = /^https?:\/\/((([a-zA-Z0-9\-_]+)\.)+[a-zA-Z]{2,}|localhost)(:\d{1,5})?(\/[^\s]*)?$/;
  return urlPattern.test(url);
}
export const getHumanFriendlyDateRange = (startDate, endDate) => {
  const start = moment(startDate);
  const end = moment(endDate);

  // Check if start and end dates are on the same day
  const sameDay = start.isSame(end, "day");

  if (sameDay) {
    // Format start and end times
    const formattedStart = start.format("h:mm A");
    const formattedEnd = end.format("h:mm A");

    const formattedRange = `${start.format("Do MMMM YYYY")} from ${formattedStart} to ${formattedEnd}`;
    return formattedRange;
  } else {
    const formattedStart = start.format("Do MMMM YYYY");
    const formattedEnd = end.format("Do MMMM YYYY");

    const formattedRange = `${formattedStart} to ${formattedEnd}`;
    return formattedRange;
  }
};

export const getUniqueDates = (dates) => {
  if (!dates) return [];
  const uniqueDates = new Set();

  // Iterate over the dates and extract the date part
  dates.forEach((date) => {
    const dateStr = new Date(date).toISOString().slice(0, 10); // Get the date part of the ISO string
    uniqueDates.add(dateStr);
  });

  // Return the unique dates as an array of strings
  return Array.from(uniqueDates);
};
export const isPastDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  return date < now;
};

export const separate = (ids, dataSet = [], options = {}) => {
  const { valueExtractor } = options || {};
  const found = [];
  var notFound = [];
  const remainder = [];
  const itemObjects = [];
  for (var d of dataSet || []) {
    const value = valueExtractor ? valueExtractor(d) : d.id;
    if (ids.includes(value)) {
      found.push(value);
      itemObjects.push(d);
    } else {
      remainder.push(d);
    }
  }
  notFound = ids.filter((id) => !found.includes(id));
  return {
    found, // Found locally
    notFound, // Not found locally
    remainder, // Just the general remaining items from the datasource
    itemObjects // Full objects of items that were found
  };
};

export function makeDeleteUI({ idsToDelete, templates }) {
  const len = (idsToDelete && idsToDelete.length) || 0;
  var text = `Are you sure you want to delete (
    ${(idsToDelete && idsToDelete.length) || ""})
    ${len === 1 ? " event? " : " events? "}`;

  if (templates && templates.length) {
    text = `Sorry, (${templates.length}) template${
      templates.length === 1 ? "" : "s"
    } selected. You can't delete templates. `;
  }
  return <Typography>{text}</Typography>;
}

export const objArrayToString = (data, func) => {
  var s = "";
  (data || []).forEach((d, index) => {
    if (!s) {
      s += func(d);
    } else {
      s += ", " + func(d);
    }
  });
  return s;
};
export const makeLimitsFromImageArray = (images) => {
  if (images.length === 1) {
    return {
      lower_limit: images[0].id,
      upper_limit: images[0].id,
      images
    };
  }
  images = images.sort((a, b) => (a.id > b.id ? 1 : -1));
  return {
    lower_limit: images[0].id || 0,
    upper_limit: images[images.length - 1].id || 0,
    images: images || []
  };
};
export const getHumanFriendlyDate = (dateString, includeTime = false, forSorting = true) => {
  if (!dateString) return null;
  var format = "";
  if (forSorting) {
    format = `YYYY-MM-DD ${includeTime ? "hh:mm a" : ""}`;
  } else {
    format = `MMMM Do, YYYY ${includeTime ? "hh:mm a" : ""}`;
  }
  return moment(dateString).format(
    // make it a bit less human friendly, so it sorts properly
    format
  );
};
export const makeTimeAgo = (dateString) => {
  if (!dateString) return "";

  return moment(dateString).fromNow();
};
export const smartString = (string, charLimit = 60) => {
  if (!string) return "";
  if (!charLimit) return string;
  if (string.length > charLimit) return string.substr(0, charLimit) + "...";
  return string;
};
/**
 * The function retrieves a particular value from an array , and returns it with the remaining items of the array
 * @param {*} arr
 * @param {*} value
 * @param {*} finder  A function that should be used to extract the content to be compared to the "value" parameter  (In case an array of object is passed instead of strings)
 * @returns
 */
export const pop = (arr = [], value, finder) => {
  if (!arr) return [];
  const rest = [];
  var found = null;
  arr.forEach((item) => {
    const val = finder ? finder(item) : item;
    if (val?.toString() === value?.toString()) {
      found = item;
    } else {
      rest.push(item);
    }
  });

  return [found, rest];
};

export const findMatchesAndRest = (arr = [], finder) => {
  if (!arr) return [];
  const rest = [];
  const found = [];
  arr.forEach((item) => {
    if (finder(item)) {
      found.push(item);
    } else {
      rest.push(item);
    }
  });

  return [found, rest];
};

export function notNull(d) {
  try {
    return d && d !== "null" && d.trim() !== "";
  } catch (ex) {
    return false;
  }
}

export const isEmpty = (value) => {
  return value === undefined
    || value === null
    || value === ""
    || value?.length === 0
    || value === "null"
    || value === "undefined";

};

export const sanitizeValue = (val) => {
  if (isEmpty(val)) {
    return null;
  }

  return val;
};


export const parseJSON = (val) => {
  if (typeof val === "object") return val;
  const sanitizedValue = sanitizeValue("" + val);
  if (!sanitizedValue) return null;
  try {
    return JSON.parse(sanitizedValue);
  } catch (error) {
    console.log(`JSON: Error parsing ${val} to JSON`);
    return {};
  }
};

export function isNotEmpty(val) {
  return !isEmpty(val);
}

export function getAddress(d) {
  if (
    !d ||
    (notNull(d.address) &&
      notNull(d.unit) &&
      notNull(d.city) &&
      notNull(d.state) &&
      notNull(d.zipcode) &&
      notNull(d.country))
  ) {
    return "No Address Provided";
  }
  return `${notNull(d.address) ? d.address + ", " : ""}${notNull(d.unit) ? d.unit + ", " : ""}${
    notNull(d.city) ? d.city + ", " : ""
  }${notNull(d.state) ? d.state + ", " : ""}${notNull(d.zipcode) ? d.zipcode + ", " : ""}${
    notNull(d.country) ? d.country : ""
  }`;
}

export function convertBoolean(b) {
  return `${b === true || b === "true" ? "Yes" : "No"}`;
}

export function goHere(link, history) {
  if (history) return history.push(link);
  window.location = link;
}

// TODO: be aware of filter choices
export const updateFilterChoices = () => {
  return null;
};

export const getUrlParamsForFilterInputs = (filterChoices) => {
  if (!filterChoices) return "";
  return "";
};

export const getFilterInputsFromURL = (location) => {
  if (!location || !location.search) return "";
  const { filterInputs } = qs.parse(location.search, {
    ignoreQueryPrefix: true
  });
  return filterInputs;
};

export const ourCustomSort = ({ a, b, colIndex, order, compare }) => {
  const directionConstant = order === "desc" ? 1 : -1;
  a = a.data[colIndex];
  b = b.data[colIndex];
  if (compare) {
    return (
      compare({
        a,
        b
      }) * directionConstant
    );
  }
  if (typeof a === "string" && typeof b === "string") {
    // Forcing comparison to be done in lowercase when dealing with strings otherwise results will be off
    return (a.toLowerCase() < b.toLowerCase() ? -1 : 1) * directionConstant;
  }
  return (a < b ? -1 : 1) * directionConstant;
};

export const getTimeStamp = () => {
  const today = new Date();
  let newDate = today;
  let options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  };

  return Intl.DateTimeFormat("en-US", options).format(newDate);
};
/**
 *
 * @param {*} location : Props Location
 * @param {*} paramName
 * @returns
 */
export const fetchParamsFromURL = (location, paramName, names) => {
  if (!location || !location.search) return "";
  const obj = qs.parse(location.search, { ignoreQueryPrefix: true });
  var value = obj[paramName];
  value = value && value.toString();
  delete obj[paramName];
  const params = {};
  if (names && names.length) {
    names.forEach((n) => {
      params[n] = obj[n];
      delete obj[n];
    });
  }
  return (
    {
      params,
      [paramName]: value,
      rest: {
        object: obj,
        qs: qs.stringify(obj) || ""
      }
    } || {}
  );
};

export const removePageProgressFromStorage = (key) => {
  var progress = localStorage.getItem(ME_FORM_PROGRESS) || "{}";
  progress = parseJSON(progress);
  progress[key] = {};
  localStorage.setItem(ME_FORM_PROGRESS, JSON.stringify(progress));
};
/**
 *
 * This function takes a list of ids of items(msgs, actions, testimonials etc.) that need attending to and matches it against the data source,
 * to find out which of the items are available locally, and which ones need to be fetched.
 * If all items are available locally, nothing happens.
 * If not, it fetches all the items not found and appends it to the main data source.
 *
 * This fxn helps arrange data properly so that when admins click from their dashboard to see
 * "15" unanswered messages, all and only the unanswered messages will show up in the table, to make things easier.

 */
export const reArrangeForAdmin = ({ dataSource, props, apiURL, fieldKey, reduxFxn, separationOptions, args, cb }) => {
  const _sort = (a, b) => (b.id < a.id ? -1 : 1);
  const { location } = props;
  const { state } = location || {};
  const ids = (state && state.ids) || [];
  const result = separate(ids, dataSource, separationOptions);
  const { notFound, itemObjects, remainder } = result;
  var data = [...itemObjects, ...remainder];
  data.sort(_sort);
  reduxFxn(data);
  if (!notFound.length) return cb && cb(); // If all items are found locally, dont go to the B.E
  apiCall(apiURL, {
    [fieldKey]: notFound,
    ...(args || {})
  }).then((response) => {
    if (response.success) data = [...response.data, ...data];
    //-- Items that were not found, have now been loaded from the B.E!
    cb && cb(response.data);
    data.sort(_sort);
    reduxFxn(data);
  });
};

export const convertToScheduledFor = (dateTimeString) => {
  if (!dateTimeString) return "---";
  const inputDate = new Date(dateTimeString);
  const currentDate = new Date();
  let options = {
    // year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  };

  if (inputDate.toDateString() === currentDate.toDateString()) {
    options = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    };
  }

  return inputDate.toLocaleString("en-US", options);
};

export function findItemAtIndexAndRemainder(arr, comparator) {
  const remainder = [];
  let foundItem;
  let index = -1;
  for (let i = 0; i < arr.length; i++) {
    const found = arr[i];
    if (comparator && comparator(found)) {
      foundItem = found;
      index = i;
    } else {
      remainder.push(found);
    }
  }

  return {
    index,
    foundItem,
    remainder
  };
}

export const log = (key = "Admin Log: ", ...args) => {
  console.log(key, ...args);
};

export const arrangeInSequence = (arr, idsInSequence) => {
  if (!arr?.length || !idsInSequence?.length) return arr || [];
  const result = [];
  arr?.forEach((item) => {
    const index = idsInSequence?.indexOf(item?.id);
    if (index > -1) {
      result[index] = item;
    }
  });
  return result;
};

export function mergeUnique(arr1, arr2, comparator) {
  const mergedArray = [...(arr1 || []), ...(arr2 || [])];
  return mergedArray.filter((item, index, self) => index === self.findIndex((t) => comparator(t, item)));
}

export const formatWithDelimiter = (dateString, delimiter = "-") => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are 0 based index in JavaScript
  const day = ("0" + date.getDate()).slice(-2);
  return `${year}${delimiter}${month}${delimiter}${day}`;
};

export function formatWithMoment(momentObject, format = "YYYY-MM-DD") {
  if (!momentObject) {
    momentObject = moment();
  }
  return momentObject.format(format);
}

