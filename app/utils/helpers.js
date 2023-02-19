import { apiCall } from "./messenger";
const TABLE_PROPERTIES = "_TABLE_PROPERTIES";
const FILTERS = "_FILTERS";

export const getSearchText = (key) => {
  var tableProp = localStorage.getItem(key + TABLE_PROPERTIES);
  tableProp = JSON.parse(tableProp || null) || {};
  return tableProp && tableProp.search;
};
export const getLimit = (key) => {
  var tableProp = localStorage.getItem(key + TABLE_PROPERTIES);
  tableProp = JSON.parse(tableProp || null) || {};
  return (tableProp && tableProp.rowsPerPage) ||50;
};
export const getFilterParamsFromLocalStorage = (key) => {
  var tableProp = localStorage.getItem(key + FILTERS);
  tableProp = JSON.parse(tableProp || null) || {};
  let filters = {};
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

export const prepareFilterAndSearchParamsFromLocal = (key) => {
  let filterParams = getFilterParamsFromLocalStorage(key);
  let params = JSON.stringify({
    ...filterParams,
    search_text: getSearchText(key) || "",
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
  meta
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
  const isSuperAdmin = auth.is_super_admin;
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
  meta
) => {
  let filterParams = getFilterParamsFromLocalStorage(pageProp.key);
  makeAPICallForMoreData({
    apiUrl,
    existing: reduxItems,
    updateRedux: updateReduxFunction,
    args: {
      page,
      limit: getLimit(pageProp.key),
      params: JSON.stringify({
        ...filterParams,
        search_text: getSearchText(pageProp.key) || "",
        sort_params: sortBy,
      }),
    },
    name,
    updateMetaData,
    meta
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
  meta
}) => {

  console.log("== table state ===", tableState);

  switch (action) {
    case "changePage":
      if (
        tableState.rowsPerPage * tableState.page ===
        tableState.displayData.length
      ) {
        callMoreData(
          metaData.next,
          updateReduxFunction,
          reduxItems,
          apiUrl,
          pageProp,
          tableState && tableState.sort,
          name,
          updateMetaData,
          meta
        );
      }
      break;
    case "sort":
      callMoreData(
        1,
        updateReduxFunction,
        reduxItems,
        apiUrl,
        pageProp,
        tableState && tableState.sortOrder,
        name,
        updateMetaData,
        meta
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
  updateMetaData
}) => {

  if (type === "chip") {
    let arr = generateFilterParams(filterList, columns);
    apiCall(url, {
      params: JSON.stringify(arr),
      limit: getLimit(page.key),
    }).then((res) => {
      if (res && res.success) {
        let filterData = getFilterData(
          res,
          reduxItems,
          "id"
        );
        updateReduxFunction(filterData);
        updateMetaData({ ...meta, [name]: res.cursor });
      }
    });
  }
  return convertToLocalFormat(filterList, columns);
};



export const isTrue = (value)=>{
  if([true, "True", "Yes", "yes"].includes(value)) return true
}