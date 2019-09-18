/**
 * This file contains code used to transmit data
 */

import { API_HOST } from '../config/constants';

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

export function sendFormWithMedia(formData, destinationUrl) {
  fetch(`${API_HOST}/auth/csrf`, {
    method: 'GET',
    credentials: 'include',
  }).then(response => response.json()).then(jsonResponse => {
    const { csrfToken } = jsonResponse.data;
    return fetch(destinationUrl, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-CSRFToken': csrfToken,
      },
      body: formData
    })
      .then(response => response.json()).then(data => {
        console.log(data);
        return data;
      });
  }).catch(error => {
    console.log(error.message);
    return null;
  });
}


export function cleanFormData(formValues) {
  const result = {};
  [...formValues].forEach(([k, v]) => {
    result[k] = v;
  });
  return result;
}
 
export async function fetchData(sourceUrl) {
  return fetch(`${API_HOST}/${sourceUrl}`, {
    method: 'GET',
    credentials: 'include',
  }).then(response => response.json())
    .then(jsonResponse => jsonResponse)
    .catch(error => {
      console.log(error.message);
      return null;
    });
}
