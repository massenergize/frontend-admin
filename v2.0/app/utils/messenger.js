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
    })
      .then(response => {
        console.log(response);
        return response.json();
      }
      ).then(data => {
        console.log(data);
        if (data && data.success) {
          console.log(data);
          window.location.href = relocationPage;
        }
        return data;
      });
  }).catch(error => {
    console.log(error.message);
    window.location.href = relocationPage;
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

export function formForJokes(dataTrain){
  var formData  = new FormData();
  Object.keys(dataTrain).map(key => formData.append(key, dataTrain[key]));
  return fetch("https://postman-echo.com/post", {
    method: 'POST',
    credentials: 'include',
    mode:"no-cors",
    body:formData
  }).then(response => response.json())
    .then(jsonResponse => {
      console.log("I have been returned from postman",jsonResponse);
    })
    .catch(error => {
      console.log(error.message);
      return null;
    });
}
