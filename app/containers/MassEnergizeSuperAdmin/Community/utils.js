
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
  const dbArr = [dbNames.fb, dbNames.tw, dbNames.insta];
  //keep old social media fields if they exist and have not been changed
  dbArr.forEach((name) => {
    let newVal = more_info[name];
    if (!newVal) more_info[name] = oldInfo[name];
  });
  more_info = { ...oldInfo, ...more_info }; //still have to do this to retain other fields that are not related to social media
  more_info = JSON.stringify(more_info);
  delete formData[dbNames.fb];
  delete formData[dbNames.insta];
  delete formData[dbNames.tw];
  delete formData["wants_socials"];
  return { ...formData, more_info };
};


// All of these social media information are saved in the "more_info" field of the community table in django(stringified json)