import { useCallback, useEffect, useMemo, useState } from "react";
import { apiCall } from "../messenger";

// export const useApiRequest = ({ url, method, body, headers }) => {
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState(null);
//   const [response, setResponse] = useState(null);
//   const [error, setError] = useState(null);

//   const handleResponse = (response) => {
//     setData(response?.data);
//     setResponse(response);
//   };
//   const apiRequest = useCallback(() => {
//     setLoading(true);
//     setError(null);
//     apiCall(url, body)
//       .then((response) => {
//         setLoading(false);
//         if (!response?.success) {
//           setError(response?.error);
//         }
//         handleResponse(response);
//       })
//       .catch((e) => {
//         console.log("useApiError: ", e);
//         setLoading(false);
//         setError(e?.toString());
//       });
//   }, [url, body]);

//   return { error, loading, apiRequest, data, response };
// };
/**
 *
 * @param {*} objArrays
 * @returns Array of objects(requestHandlers). Each of the handlers is an array containing the following:
 * 1. apiRequest: Function to make the API request
 * 2. data: The data returned from the API request
 * 3. error: The error returned from the API request
 * 4. loading: The loading state of the API request
 * 5. response: The response returned from the API request
 *
 */
export const useApiRequest = (objArrays) => {
  const [loading, setLoading] = useState({});
  const [data, setData] = useState({});
  const [response, setResponse] = useState({});
  const [error, setError] = useState({});

  const handleResponse = (key, response) => {
    setDataValue(key, response?.data);
    setResponseValue(key, response);
  };
  const setLoadingValue = (key, value) => {
    setLoading({ ...loading, [key]: value });
  };
  const setDataValue = (key, value) => {
    setData({ ...data, [key]: value });
  };
  const setErrorValue = (key, value) => {
    setError({ ...error, [key]: value });
  };
  const setResponseValue = (key, value) => {
    setResponse({ ...response, [key]: value });
  };

  const apiRequest = (body, cb, options) => {
    const { url, key } = options || {};
    setLoadingValue(key, true);
    setErrorValue(key, null);
    apiCall(url, body)
      .then((response) => {
        setLoadingValue(key, false);
        if (!response?.success) {
          setErrorValue(key, response?.error);
        }
        handleResponse(key, response);
        cb && cb(response?.data);
      })
      .catch((e) => {
        console.log(`useApiError: ${key} => `, e);
        setLoadingValue(key, false);
        setErrorValue(key, e?.toString());
        cb && cb(null, e?.toString());
      });
  };

  // return objArrays.map((obj) => {
  //   const key = obj?.key;
  //   return {
  //     error: error[key],
  //     loading: loading[key],
  //     apiRequest: (externalProps) => apiRequest({ ...obj, ...(externalProps || {}), key }),
  //     data: data[key],
  //     response: response[key]
  //   };
  // });

  return objArrays.map((obj) => {
    const key = obj?.key;
    return [
      (body, cb, options = {}) => apiRequest(body, cb, { ...obj, ...(options || {}), key }),
      data[key],
      error[key],
      loading[key],
      (error) => setErrorValue(key, error),
      response[key]
    ];
  });
};
