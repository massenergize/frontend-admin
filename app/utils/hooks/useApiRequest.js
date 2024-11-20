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

  const apiRequest = ({ url, body, key }) => {
    setLoadingValue(key, true);
    setErrorValue(key, null);
    apiCall(url, body)
      .then((response) => {
        setLoadingValue(key, false);
        if (!response?.success) {
          setErrorValue(key, response?.error);
        }
        handleResponse(key, response);
      })
      .catch((e) => {
        console.log(`useApiError: ${key} => `, e);
        setLoadingValue(key, false);
        setErrorValue(key, e?.toString());
      });
  };

  return objArrays.map((obj) => {
    const key = obj?.key;
    return {
      error: error[key],
      loading: loading[key],
      apiRequest: (externalProps) => apiRequest({ ...obj, ...(externalProps || {}), key }),
      data: data[key],
      response: response[key]
    };
  });
};
