/**
 * This file contains code used to transmit data
 */
import qs from 'qs';
import { API_HOST } from '../config/constants';

/**
 *
 * @param {object} destinationUrl
 * @param {object} dataToSend
 * @param {string} relocationPage
 * This function handles sending data to the backend.  It takes advantage of
 * being a SimpleRequest hence no preflight checks will be done saving some
 * band-with and being faster in general while avoiding CORS issues.
 */

function checkAuthUser() {
  const user = localStorage.getItem('authUser');
  const token = localStorage.getItem('idToken');
  if (user && token) {
    rawCall('auth/whoami').then(res => {
      if (!res.data) {
        window.location = '/login';
        localStorage.removeItem('authUser');
        localStorage.removeItem('idToken');
      }
    });
  }
}
export async function apiCall(destinationUrl, dataToSend = {}, relocationPage = null) {
  // checkAuthUser();
  const idToken = localStorage.getItem('idToken');
  const response = await fetch(`${API_HOST}/v3${destinationUrl}`, {
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
    return json;
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
  checkAuthUser();
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


export function sendFormWithMedia(incomingData, destinationUrl, relocationPage) {
  fetch(`${API_HOST}/auth/csrf`, {
    method: 'GET',
    credentials: 'include',
  }).then(response => response.json()).then(jsonResponse => {
    const { csrfToken } = jsonResponse.data;
    const formData = new FormData();
    Object.keys(incomingData).map(k => (formData.append(k, incomingData[k])));

    return fetch(`${API_HOST}${destinationUrl}`, {
      credentials: 'include',
      mode: 'no-cors',
      method: 'POST',
      headers: {
        'X-CSRFToken': csrfToken,
      },
      body: formData
    }).then(response => response.json())
      .then(data => data)
      .catch(error => {
        console.log(error.message);
        return null;
      });
  }).catch(error => {
    console.log(error.message);
    window.location.href = relocationPage;
    return null;
  });
}

export async function asyncSendFormWithMedia(incomingData, destinationUrl, relocationPage) {
  const formData = new FormData();
  Object.keys(incomingData).map(k => (formData.append(k, incomingData[k])));

  const response = await fetch(`${API_HOST}${destinationUrl}`, {
    credentials: 'include',
    mode: 'no-cors',
    method: 'POST',
    body: formData
  });
  if (response) {
    window.location.href = '/admin/read/actions';
  }
  return response;
}


export function cleanFormData(formValues) {
  const result = {};
  [...formValues].forEach(([k, v]) => {
    result[k] = v;
  });
  return result;
}

export async function fetchData(sourceUrl) {
  checkAuthUser();
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
