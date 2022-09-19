import { apiCall } from "./messenger";

export const makeAPICallForMoreData = ({ url, existing, updateRedux, page }) => {
  apiCall(url, {
    page: page,
  }).then((res) => {
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
