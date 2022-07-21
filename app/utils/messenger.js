/**
 * This file contains code used to transmit data
 */
import qs from 'qs';
import { API_HOST, IS_CANARY, IS_PROD, IS_LOCAL, CC_HOST } from '../config/constants';
export const PERMISSION_DENIED = "permission_denied"; 
export const SESSION_EXPIRED = "session_expired";
import * as Sentry from "@sentry/react";
/**
 * Handles making a POST request to the backend as a form submission
 * It also adds meta data for the BE to get context on the request coming in.
 *
 * @param { String } destinationUrl
 * @param { String } dataToSend
 * @param { String } relocationPage
 */
export async function apiCall(
  destinationUrl,
  dataToSend = {},
  relocationPage = null
) {
  // add some meta data for context in backend
  const data = {
    __is_prod: IS_PROD || IS_CANARY,
    __is_admin_site: true,
    ...dataToSend
  };

  const formData = new FormData();
  Object.keys(data).map(k => (formData.append(k, data[k])));

  if (!destinationUrl || destinationUrl.length < 2) {
    return { success: false, error: 'Invalid URL passed to apiCall' };
  }

  // make leading '/' optional
  if (destinationUrl.charAt(0) === '/') {
    destinationUrl = destinationUrl.substring(1);
  }

  // special case for carbon_calculator api
  let host = API_HOST;
  if (destinationUrl.substring(0, 1) === 'cc') {
    host = CC_HOST;
    if (!IS_LOCAL) {
      destinationUrl = destinationUrl.substring(3);
    }
  }
  else if (IS_LOCAL) {
    // not for cc api
    destinationUrl = "api/" + destinationUrl;
  }  
  destinationUrl = `${host}/${destinationUrl}`

  const response = await fetch(destinationUrl, {
    credentials: 'include',
    method: 'POST',
    body: formData
  });

  try {
    const json = await response.json();
    if (relocationPage && json && json.success) {
      window.location.href = relocationPage;
    } else if (!json.success) {
      if (json.error === SESSION_EXPIRED || 
          json.error === PERMISSION_DENIED) {
        window.location.href = '/login';
      } else if (json !== 'undefined') {
        console.log(destinationUrl, json);
      }
    }
    return json;
  } catch (error) {
    const errorText = error.toString();
    if (errorText.search("JSON")>-1) {
      const errorMessage = "Invalid response to "+destinationUrl+" Data: "+JSON.stringify(formData);
      // this will send message to Sentry Slack channel
      Sentry.captureMessage(errorMessage);
      return { success: false, error: errorMessage };
    }
    else {
      Sentry.captureException(error);
      return { success: false, error: error.toString() };
    }
  }
}


export async function apiCallFile(destinationUrl, dataToSend = {}) {
  const idToken = localStorage.getItem('idToken');

  // don't need this strictUrl optional arg?  Won't work with IS_LOCAL
  const strictUrl = false;

  // make leading '/' optional
  if (destinationUrl.charAt(0) === '/') {
    destinationUrl = destinationUrl.substring(1);
  }
  
  if (IS_LOCAL) {
    destinationUrl = "api/" + destinationUrl;
  }

  const url = strictUrl ? `${API_HOST}${destinationUrl}` : `${API_HOST}/${destinationUrl}`;
  // add some meta data for context in backend
  const data = {
    __is_prod: IS_PROD,
    __is_admin_site: true,
    ...dataToSend
  };

  
  const response = await fetch(url, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${idToken}`
    },
    body: qs.stringify(data)
  });

  try {
    const contentType = response.headers.get('content-type');

    // endpoints that return non-JSON data will still send JSONs on errors
    if (contentType && contentType.indexOf('application/json') !== -1) {
      return response.json().then(json => {
        if (json.error === SESSION_EXPIRED) {
          localStorage.removeItem('authUser');
        }
        return json;
      });
    }

    // if no JSON response, it was a success
    const contentDisposition = response.headers.get('content-disposition');
    const filename = contentDisposition
      ? contentDisposition.match(/filename="(.+)"/)[1]
      : 'download.' + contentType.split('/')[1];
    return response.blob().then(blob => ({
      success: true,
      file: new File([blob], filename, { type: contentType })
    }));
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}
