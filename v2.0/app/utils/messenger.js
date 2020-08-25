/**
 * This file contains code used to transmit data
 */
import qs from 'qs';
import { API_HOST } from '../config/constants';

export async function apiCall(destinationUrl, dataToSend = {}, relocationPage = null, strictUrl = false) {
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
    const json = await response.json();
    if (relocationPage && json && json.success) {
      window.location.href = relocationPage;
    }
    if (json && !json.success && json.error === 'Signature has expired') {
      localStorage.removeItem('authUser');
      localStorage.removeItem('idToken');
      window.location.href = '/login';
    }
    return json;
  } catch (error) {
    return { success: false, error: error.toString() };
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

export async function rawCall(destinationUrl, dataToSend = {}, relocationPage = null) {
  const idToken = localStorage.getItem('idToken');
  let params = {};
  if (idToken) {
    params = {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${idToken}`
      },
      body: qs.stringify(dataToSend)
    };
  } else {
    params = {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify(dataToSend)
    };
  }

  const response = await fetch(`${API_HOST}/${destinationUrl}`, params);

  try {
    const json = await response.json();
    if (relocationPage && json && json.success) {
      window.location.href = relocationPage;
    }
    if (json && !json.success && json.error === 'Signature has expired') {
      localStorage.removeItem('authUser');
      localStorage.removeItem('idToken');
      window.location.href = '/login';
    }
    return json;
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 *
 * @param {object} destinationUrl
 * @param {object} dataToSend
 * @param {string} relocationPage
 * This function handles sending data which has media like file attachments
 * to the backend.  It takes advantage of being a SimpleRequest hence no
 * preflight checks will be done saving some band-with and being faster in
 * general while avoiding CORS issues.
 */
export async function apiCallWithMedia(destinationUrl, dataToSend = {}, relocationPage = null) {
  // checkAuthUser();
  const formData = new FormData();
  Object.keys(dataToSend).map(k => (formData.append(k, dataToSend[k])));

  const response = await fetch(`${API_HOST}/v3${destinationUrl}`, {
    credentials: 'include',
    method: 'POST',
    // mode: 'no-cors',
    body: formData
  });

  try {
    const json = await response.json();
    if (relocationPage && json && json.success) {
      window.location.href = relocationPage;
    }
    return json;
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}


// DO NOT USE THE METHODS BELOW - NOT EFFICIENT

export function sendJson(dataToSend, destinationUrl, relocationPage = '/admin') {
  fetch(`${API_HOST}/auth/csrf`, {
    method: 'GET',
    credentials: 'include',
  }).then(response => response.json()).then(jsonResponse => {
    const { csrfToken } = jsonResponse.data;
    return fetch(`${API_HOST}${destinationUrl}`, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify({ ...dataToSend })
    })
      .then(response => response.json()).then(data => {
        console.log(data);
        if (data && data.success) {
          window.location.href = relocationPage;
        }
        return data;
      });
  }).catch(error => {
    console.log(error.message);
    return null;
  });
}


export async function fetchData(sourceUrl) {
  // checkAuthUser();
  const idToken = localStorage.getItem('idToken');

  return fetch(`${API_HOST}/${sourceUrl}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${idToken}`
    }
  }).then(response => response.json())
    .then(jsonResponse => jsonResponse)
    .catch(error => {
      console.log(error.message);
      return null;
    });
}


export async function deleteItem(sourceUrl) {
  return fetch(`${API_HOST}/${sourceUrl}`, {
    method: 'DELETE',
    credentials: 'include',
  }).then(response => response.json())
    .then(jsonResponse => jsonResponse)
    .catch(error => {
      console.log(error.message);
      return null;
    });
}

export function formForJokes(dataTrain) {
  const formData = new FormData();
  Object.keys(dataTrain).map(key => formData.append(key, dataTrain[key]));
  return fetch('https://postman-echo.com/post', {
    method: 'POST',
    credentials: 'include',
    mode: 'no-cors',
    body: formData
  }).then(response => response.json())
    .then(jsonResponse => {
      console.log('I have been returned from postman', jsonResponse);
    })
    .catch(error => {
      console.log(error.message);
      return null;
    });
}
