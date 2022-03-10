/** *
 * All utility Functions
 */
import moment from "moment";
import qs from "qs";

export const getHumanFriendlyDate = (dateString, includeTime = false) => {
  if (!dateString) return null;
  return moment(dateString).format(
    `MMMM Do, YYYY ${includeTime ? "hh:mm a" : ""}`
  );
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
    if (val === value) found = item;
    else rest.push(item);
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

export function isEmpty(val) {
  return !val || ["null", "undefined", ""].indexOf(`${val}`.toLowerCase()) > -1;
}

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
  )
    return "No Address Provided";
  return `${notNull(d.address) ? d.address + ", " : ""}${
    notNull(d.unit) ? d.unit + ", " : ""
  }${notNull(d.city) ? d.city + ", " : ""}${
    notNull(d.state) ? d.state + ", " : ""
  }${notNull(d.zipcode) ? d.zipcode + ", " : ""}${
    notNull(d.country) ? d.country : ""
  }`;
}

export function convertBoolean(b) {
  return `${b === true || b === "true" ? "Yes" : "No"}`;
}

export function goHere(link, history) {
  if(history) return history.push(link)
  window.location = link;
}

export function downloadFile(file) {
  if (!file) return;

  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(file, file.name);
  } else {
    const elem = window.document.createElement("a");
    const URL = window.URL.createObjectURL(file);
    elem.href = URL;
    elem.download = file.name;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
    window.URL.revokeObjectURL(URL);
  }
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
    ignoreQueryPrefix: true,
  });
  return filterInputs;
};
