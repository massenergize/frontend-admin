import moment from "moment/moment";
import { IS_CANARY, IS_LOCAL, IS_PROD } from "../../../config/constants";

export const getMoreInfo = (community) => {
  // const { community } = this.state;
  const more_info =
    community && community.more_info ? JSON.parse(community.more_info) : {};
  return more_info;
};

export const dbNames = {
  fb: "facebook_link",
  tw: "twitter_link",
  insta: "instagram_link",
};
export const setOptionToNoSocial = (formData, oldInfo) => {
  if (oldInfo) oldInfo.wants_socials = "false";
  formData.more_info = JSON.stringify(oldInfo);
  delete formData.wants_socials;
  return formData;
};
export const groupSocialMediaFields = (formData, oldInfo) => {
  if (!formData) return formData;
  // cadmin does not want socials, just normal contact info
  if (formData.wants_socials !== "true")
    return setOptionToNoSocial(formData, oldInfo);

  var more_info = {
    [dbNames.fb]: formData[dbNames.fb],
    [dbNames.insta]: formData[dbNames.insta],
    [dbNames.tw]: formData[dbNames.tw],
    wants_socials: formData.wants_socials,
  };
  // const dbArr = [dbNames.fb, dbNames.tw, dbNames.insta];
  //keep old social media fields if they exist and have not been changed
  // dbArr.forEach((name) => {
  //   let newVal = more_info[name];
  //   if (!newVal) more_info[name] = oldInfo[name];
  // });
  more_info = { ...oldInfo, ...more_info }; //still have to do this to retain other fields that are not related to social media
  more_info = JSON.stringify(more_info);
  delete formData[dbNames.fb];
  delete formData[dbNames.insta];
  delete formData[dbNames.tw];
  delete formData["wants_socials"];
  return { ...formData, more_info };
};

// All of these social media information are saved in the "more_info" field of the community table in django(stringified json)

export const isValueEmpty = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    value === [] ||
    value === "null" ||
    value === "undefined" ||
    value === {}
  )
    return true;
  return false;
};

//duplicate code - use PORTAL_HOST
//export const getHost = () => {
//  var host;
//  if (IS_LOCAL) host = "http://localhost:3000";
//  else if (IS_CANARY) host = "https://community-canary.massenergize.org";
//  else if (IS_PROD) host = "https://community.massenergize.org";
//  else host = "https://community.massenergize.dev";
//  return host;
//};
function sameYear(date1, date2) {
  return date1.getFullYear() === date2.getFullYear();
}
function sameMonth(date1, date2) {
  return (
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}
function sameDay(date1, date2) {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}
function hasTimeInterval(date1, date2) {
  return date1.getHours() !== 0 && date2.getHours() !== 0;
}
export function dateFormatString(startDate, endDate) {
  if (!startDate || !endDate) return "";
  const startDateMoment = moment(startDate);
  const endDateMoment = moment(endDate);

  let dateString;
  if (sameDay(startDate, endDate)) {
    // April 20, 2020
    dateString = startDateMoment.format("MMMM Do YYYY");
    if (hasTimeInterval(startDate, endDate)) {
      // append 9:30am-3:00pm
      const startTime = startDateMoment.format("h:mm a");
      const endTime = endDateMoment.format("h:mm a");
      dateString += `, ${startTime}-${endTime}`;
    }
  } else {
    const startDay = startDateMoment.format("Do");
    const endDay = endDateMoment.format("Do");
    const startMonth = startDateMoment.format("MMMM");
    const startYear = startDateMoment.format("YYYY");

    if (sameMonth(startDate, endDate)) {
      // April 15-20, 2020
      dateString = `${startMonth} ${startDay}-${endDay}, ${startYear}`;
    } else {
      const endMonth = endDateMoment.format("MMMM");
      if (sameYear(startDate, endDate)) {
        // March 31 - April 15, 2020
        dateString = `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startYear}`;
      } else {
        // March 31 2019 - April 15 2020
        const endYear = endDateMoment.format("YYYY");
        dateString = `${startMonth} ${startDay} ${startYear} - ${endMonth} ${endDay} ${endYear}`;
      }
    }
  }

  return dateString;
}


export const  arrInRange = (start, end) => {
  if(start === end) return [start];
  return [start, ...arrInRange(start + 1, end)];
}