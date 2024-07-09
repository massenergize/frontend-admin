import { IS_CANARY, IS_LOCAL, IS_PROD } from "../config/constants";
import { apiCall } from "./messenger";
import { DEFAULT_ITEMS_PER_PAGE } from './constants';
import { parseJSON } from "./common";
const TABLE_PROPERTIES = "_TABLE_PROPERTIES";
const FILTERS = "_FILTERS";

export const getSearchText = (key) => {
  var tableProp = localStorage.getItem(key + TABLE_PROPERTIES);
  tableProp = parseJSON(tableProp || null) || {};
  return tableProp && tableProp.search;
};
export const getLimit = (key) => {
  var tableProp = localStorage.getItem(key + TABLE_PROPERTIES);
  tableProp = parseJSON(tableProp || null) || {};
  return (tableProp && tableProp.rowsPerPage) || DEFAULT_ITEMS_PER_PAGE;
};
export const getFilterParamsFromLocalStorage = (key) => {
  var tableProp = localStorage.getItem("MAIN_FILTER_OBJECT");
  tableProp = parseJSON(tableProp || null) || {};
  key = key + FILTERS;
  let filters = {};
  tableProp = tableProp[key] || {};

  Object.values(tableProp).forEach((value) => {
    if (value.list.length) {
      filters[
        value &&
          value.name &&
          value.name.toLowerCase &&
          value.name.toLowerCase()
      ] = value.list;
    }
  });
  return filters;
};

export const getFilterData = (data, existing = [], field = "id") => {
  let items = data.data || [];
  let all = [...existing, ...items];
  const unique = [...new Map(all.map((item) => [item[field], item])).values()];
  return unique;
};


const getSavedSortParamsFromLocalStorage = (key) => {
  let tableProp = localStorage.getItem(key + TABLE_PROPERTIES);
  tableProp = parseJSON(tableProp || null) || {};
  return tableProp?.sortOrder?.actual;
};

export const prepareFilterAndSearchParamsFromLocal = (key) => {
  let filterParams = getFilterParamsFromLocalStorage(key);
  let params = JSON.stringify({
    ...filterParams,
    search_text: getSearchText(key) || "",
    sort_params: getSavedSortParamsFromLocalStorage(key) || {},
  });

  return params;
};

export const makeAPICallForMoreData = ({
  apiUrl,
  existing,
  updateRedux,
  args,
  name,
  updateMetaData,
  meta,
}) => {
  apiCall(apiUrl, args).then((res) => {
    if (res.success) {
      let data = getFilterData(res, existing);
      updateRedux(data);
      updateMetaData({ ...meta, [name]: res.cursor });
    }
  });
};

export const generateFilterParams = (items, columns) => {
  let filterItems = [...items];
  return filterItems
    .map((item, index) => {
      return {
        name: columns[index].name,
        val: item,
      };
    })
    .filter((item) => item.val.length > 0)
    .reduce(
      (acc, curr) => ((acc[curr["name"].toLowerCase()] = curr.val), acc),
      {}
    );
};

export const getAdminApiEndpoint = (auth, base) => {
  let url = base;
  const isSuperAdmin = auth && auth.is_super_admin;
  return isSuperAdmin
    ? `${url}.listForSuperAdmin`
    : `${url}.listForCommunityAdmin`;
};

const callMoreData = (
  page,
  updateReduxFunction,
  reduxItems,
  apiUrl,
  pageProp,
  sortBy,
  name,
  updateMetaData,
  meta,
  otherArgs,
  customLimit,
) => {
  let filterParams = getFilterParamsFromLocalStorage(pageProp.key);
  makeAPICallForMoreData({
    apiUrl,
    existing: reduxItems,
    updateRedux: updateReduxFunction,
    args: {
      page,
      limit: customLimit || getLimit(pageProp.key),
      params: JSON.stringify({
        ...filterParams,
        search_text: getSearchText(pageProp.key) || "",
        sort_params: sortBy,
      }),
      ...(otherArgs || {}),
    },
    name,
    updateMetaData,
    meta,
  });
};

export const onTableStateChange = ({
  action,
  pageProp,
  metaData,
  updateReduxFunction,
  reduxItems,
  apiUrl,
  tableState,
  name,
  updateMetaData,
  meta,
  otherArgs,
}) => {
  switch (action) {
    case "changePage":
      if (metaData?.next === tableState?.page + 1) {
        callMoreData(
          tableState?.page + 1,
          updateReduxFunction,
          reduxItems,
          apiUrl,
          pageProp,
          tableState?.sortOrder,
          name,
          updateMetaData,
          meta,
          otherArgs
        );
      }
      break;
    case "sort":
      tableState.page = 0;
      callMoreData(
        1,
        updateReduxFunction,
        [],
        apiUrl,
        pageProp,
        tableState?.sortOrder,
        name,
        updateMetaData,
        meta,
        otherArgs,
      );
      break;
    
    default:
  }
};

const convertToLocalFormat = (filterList, columns) => {
  let obj = {};
  let newColumns = [];

  columns.forEach((column, index) => {
    let newColumn = {
      ...column,
      options: { ...column.options, filterList: filterList[index] },
    };
    newColumns.push(newColumn);

    let filter = {
      name: column.name,
      type: column.options.filterType || "",
      list: filterList[index],
    };
    obj = { ...(obj || {}), [index]: filter };
  });

  return { obj, newColumns };
};

export const handleFilterChange = ({
  filterList,
  type,
  columns,
  page,
  url,
  reduxItems,
  updateReduxFunction,
  meta,
  name,
  updateMetaData,
  otherArgs,
}) => {
  if (type === "chip" || type === "custom") {
    let arr = generateFilterParams(filterList, columns);
    apiCall(url, {
      params: JSON.stringify(arr),
      limit: getLimit(page.key),
      ...(otherArgs || {}),
    }).then((res) => {
      if (res && res.success) {
        let filterData = getFilterData(res, reduxItems, "id");
        updateReduxFunction(filterData);
        updateMetaData({ ...meta, [name]: res.cursor });
      }
    });
  }
  return convertToLocalFormat(filterList, columns);
};

export const isTrue = (value) => {
  if ([true, "True", "Yes", "yes"].includes(value)) return true;
};

export const removeDuplicates = (first, second) => {
  const uniqueItems = [...new Set([...(first || []), ...(second || [])])];
  return uniqueItems;
};

export const getOrigin = ()=>{
  if(IS_PROD) return "https://api.massenergize.org"
  else if (IS_CANARY) return "https://api-canary.massenergize.org";
  else if(IS_LOCAL) return "http://127.0.0.1:8000";
  return "https://api.massenergize.dev";
}


export function sortByField(arr, field) {
  return arr.sort((a, b) => {
    const valueA = a[field].toUpperCase();
    const valueB = b[field].toUpperCase();

    if (valueA < valueB) {
      return -1;
    }
    if (valueA > valueB) {
      return 1;
    }
    return 0;
  });
}

export function removeDuplicateObjects(arr) {
  const uniqueObjects = {};
  const resultArray = [];

  for (const obj of arr) {
    const id = obj.Id;
    if (!uniqueObjects[id]) {
      uniqueObjects[id] = true;
      resultArray.push(obj);
    }
  }

  return resultArray;
}
