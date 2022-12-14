import { apiCall } from "./messenger";

export const makeAPICallForMoreData = ({
  apiUrl,
  existing,
  updateRedux,
  args,
}) => {
  apiCall(apiUrl, args).then((res) => {
    if (res.success) {
      let items = [...existing];
      let newList = items.concat(res.data.items);
      updateRedux({
        items: newList,
        meta: res.data.meta,
      });
    }
  });
};

export const generateFilterParams = (items, columns) => {
  return items
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

export const getFilterData = (data, existing = [], field) => {
  let items = data.items || [];
  let all = [...existing, ...items];
  const unique = [...new Map(all.map((item) => [item[field], item])).values()];
  return { items: unique, meta: data.meta };
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
  filterList,
  columns,
  updateReduxFunction,
  reduxItems,
  apiUrl
) => {
  let arr = generateFilterParams(filterList, columns);
  makeAPICallForMoreData({
    apiUrl,
    existing: reduxItems && reduxItems.items,
    updateRedux: updateReduxFunction,
    args: { page, params: JSON.stringify(arr) },
  });
};

export const onTableStateChange = ({
  action,
  tableState,
  tableData,
  metaData,
  updateReduxFunction,
  reduxItems,
  apiUrl
}) => {
  if (action === "changePage") {
    if (tableState.rowsPerPage * tableState.page === tableData.length) {
      callMoreData(
        metaData.next,
        tableState.filterList,
        tableState.columns,
        updateReduxFunction,
        reduxItems,
        apiUrl
      );
    }
  }
};
