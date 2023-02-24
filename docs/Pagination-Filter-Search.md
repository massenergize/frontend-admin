# PAGINATION, FILTER AND SEARCH WALK THROUGH
This document contains a walk through of how to configure pagination, search, and filter to the table data in the application.

### What is new
* The `API endpoints` to list items accepts additional parameters. Most of which are not required, but `limit` parameter is required. The `limit` parameter is used to limit the number of items returned from the API request and it is usually the maximum number of items per page for the items table.
```js
// Example list API call to get actions
apiCall(url, {
      limit: getLimit(PAGE_PROPERTIES.ALL_ACTIONS.key),
      page:2, // page number. incase you want to retrieve a specific pagination page
      params:JSON.stringify({
        filter_params:{},
        search_text: ""
      })
    });

```
* The API  response for paginated `list endpoints` will have a response looking like this
```js
{
    cursor:{
        count:10 // total number of items in db
        page:1 // next page to fetch
    },
    data:[
        {...},
        {...}
    ]
}

```
This change was introduced in order to stream the pagination information to the application. This change will not break any existing code in the application. The cursor property of the API response is loaded into the redux store in [AdminActions file](https://vscode.dev/github/massenergize/frontend-admin/app/redux/redux-actions/adminActions.js#L292-L307).



### How to configure pagination
To configure pagination, you need to add the following to the `options` object in your table definition.

 ```js
 options = {
    ... existing options items,
    onTableChange: (action, tableState) =>
        onTableStateChange({
          action, // taken from above args
          tableState,// taken from above args
          tableData: data, // table data returned from fashionData
          metaData, // table specific meta data. contains the pagination information of the table
          updateReduxFunction: putActionsInRedux, // redux function to update table items
          reduxItems: allActions, // items already in redux
          apiUrl: getAdminApiEndpoint(auth, "/actions"), // API endpoint to fetch items from
          pageProp: PAGE_PROPERTIES.ALL_ACTIONS, 
          updateMetaData: putMetaDataToRedux, // redux function to update meta data after fetching new items
          name: "actions", // this is the property name of the table in meta object in redux.
          meta: meta,// meta object in redux. has pagination info of all tables
        }),
 }
 ```
 after this setup, you are pretty much done with pagination

 ### How to configure Filter
 To configure filter, you need to add the following to the `options` object in your table definition.

 ```js
options = {
    ... existing options items,
    confirmFilters: true, // this prevents filter on the fly.
    customFilterDialogFooter: (currentFilterList, applyFilters) => {
        return (
          <ApplyFilterButton // Import this component
            url={getAdminApiEndpoint(auth, "/actions")}
            reduxItems={allActions}
            updateReduxFunction={putActionsInRedux}
            columns={columns}
            limit={getLimit(PAGE_PROPERTIES.ALL_ACTIONS.key)} // the maximum number of items to retrieve(usually the max items per page)
            applyFilters={applyFilters}
            updateMetaData={putMetaDataToRedux}
            name="actions"
            meta={meta}
          />
        );
      },

      
// the additional code below helps you reset filter data when a filter item is closed
      whenFilterChanges: (
        changedColumn,
        filterList,
        type,
        changedColumnIndex,
        displayData
      ) =>
        handleFilterChange({
          filterList,
          type,
          columns,
          page: PAGE_PROPERTIES.ALL_ACTIONS,
          updateReduxFunction: putActionsInRedux,
          reduxItems: allActions,
          url: getAdminApiEndpoint(auth, "/actions"),
          updateMetaData: putMetaDataToRedux,
          name: "actions",
          meta: meta,
        }),
}
 ```

### How to configure Search
 To configure search, you need to add the following to the `options` object in your table definition.  

 ```js
options = {
    ... existing options items,
    customSearchRender: (
        searchText,
        handleSearch,
        hideSearch,
        options
      ) => (
        <SearchBar
          url={getAdminApiEndpoint(auth, "/actions")}
          reduxItems={allActions}
          updateReduxFunction={putActionsInRedux}
          handleSearch={handleSearch}
          hideSearch={hideSearch}
          pageProp={PAGE_PROPERTIES.ALL_ACTIONS}
          updateMetaData={putMetaDataToRedux}
          name="actions"
          meta={meta}
        />
      ),
}

 ```


