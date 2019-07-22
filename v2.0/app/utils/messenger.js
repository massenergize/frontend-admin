/**
 * This file contains code used to transmit data
 */

const API_HOST = 'http://localhost:8000';

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
        window.location.href = relocationPage;
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
