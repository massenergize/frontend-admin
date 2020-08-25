/**
 * This file contains code used to transmit data
 */
import qs from 'qs';
import { API_HOST } from '../config/constants';
import { IS_PROD } from '../../config/constants';

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
    __is_prod: IS_PROD,
    ...dataToSend
  };

  const formData = new FormData();
  Object.keys(data).map(k => (formData.append(k, data[k])));

  const response = await fetch(`${API_HOST}/v3/${destinationUrl}`, {
    credentials: 'include',
    method: 'POST',
    body: formData
  });


  try {
    const json = await response.json();
    if (relocationPage && json && json.success) {
      window.location.href = relocationPage;
    } else if (!json.success) {
      if (json.error === 'session_expired') {
        window.location.href = window.location;
      } else {
        console.log(destinationUrl, json.error);
        window.alert(json.error);
      }
    }
    return json;
  } catch (error) {
    return { success: false, error };
  }
}


export async function apiCallFile(destinationUrl, dataToSend = {}, strictUrl = false) {
  const idToken = localStorage.getItem('idToken');
  const url = strictUrl ? `${API_HOST}${destinationUrl}` : `${API_HOST}/v3${destinationUrl}`;
  const response = await fetch(url, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${idToken}`
    },
    body: qs.stringify(dataToSend)
  });

  try {
    const contentType = response.headers.get('content-type');

    // endpoints that return non-JSON data will still send JSONs on errors
    if (contentType && contentType.indexOf('application/json') !== -1) {
      return response.json().then(json => {
        if (json.error === 'Signature has expired') {
          localStorage.removeItem('authUser');
          localStorage.removeItem('idToken');
          window.location.href = '/login';
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
