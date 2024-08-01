import MUIDataTable from "mui-datatables";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { reduxLoadTableFilters } from "../../../../redux/redux-actions/adminActions";
import { parseJSON } from "../../../../utils/common";

export const FILTER_OBJ_KEY = "MAIN_FILTER_OBJECT";
export const FILTERS = "_FILTERS";
const TABLE_PROPERTIES = "_TABLE_PROPERTIES";
const DIRECTIONS = { descending: "desc", ascending: "asc" };
const RESET = "reset";
/**
 * This is a wrapper around MUIDatatables, which will allow us to easily implement
 * features that are general to tables on all of our pages
 * Using MUI Datatable, we are  allowed to pass default filter values for
 * each of the columns. These filters need to be set on the column object.
 * Under options, and into the "filterList" property ( which is an array)
 * Link to mui-datatables-documentation: https://github.com/gregnb/mui-datatables
 * @returns
 */
function METable(props) {
  // filter object contains all selected filters for each column, and saved to a key(number) that represents
  // the index of the column in the columns array.
  const filterObject = useRef({});
  const pageTableProperties = useRef({});
  const [tableColumns, setTableColumns] = useState([]);
  const [sortOrder, setSortOrder] = useState();

  const {
    classes,
    tableProps,
    page,
    ignoreSavedFilters,
    saveFilters = true,
    filtersFromRedux,
    sendFilterUpdatesToRedux,
  } = props;

  const CURRENT_TABLE_KEY = page.key + FILTERS;

  /**
   * This function is called when the component is first rendered.
   * We check local storage and retrieve any saved column filters if available
   * with the key page.key + FILTERS(string constant)
   * When the saved filter object is retrieved, we now go over the list of the available
   * columns and use the indexes of the colums to retrieve the respective filter object for each column
   * if available. If available, we just pass the filters into the options object as filterList
   * just like MUI datatable expects.
   */
  const retrieveFiltersFromLastVisit = (columns) => {
    let filterObj;
    if (ignoreSavedFilters) filterObj = RESET;
    else filterObj = (filtersFromRedux || {})[CURRENT_TABLE_KEY] || {};
    return inflateWithFilters(columns, filterObj);
  };

  const resetFilterList = (columns) => {
    return columns.map((col) => {
      const options = col.options || {};
      return { ...col, options: { ...options, filterList: [] } };
    });
  };
  const inflateWithFilters = (columns, filterObj) => {
    if (filterObj === RESET) return resetFilterList(columns);
    const arr = Object.keys(filterObj);
    if (!arr || !arr.length) return columns;

    arr.forEach((indexOfColumn) => {
      const filter = filterObj[indexOfColumn] || [];
      const col = columns[indexOfColumn];
      if (col) {
        col.options.filterList = filter.list; // if custom passed filter selections are available
      } // set the filter list of each column if available
    });
    filterObject.current = filterObj;
    return columns;
  };

  const retrieveSortOptionsAndSort = (obj = null) => {
    let { columns } = tableProps || {};
    const properties = getProperties();
    if (!properties.sortOrder) return;
    if (obj) {
      setSortOrder(obj);
      return;
    }
    const [columnIndex, sortDirection] = Object.entries(
      properties.sortOrder
    )[0];
    let columnThatNeedsToBeSorted = columns[columnIndex];
    if (!columnThatNeedsToBeSorted) return columns;
    let order = {
      name: columnThatNeedsToBeSorted?.name,
      direction: sortDirection?.sortOrder,
    };
    setSortOrder(order);
  };

  useEffect(() => {
    let { columns } = tableProps || {};
    retrieveSortOptionsAndSort();

    // reset sort on third click
    columns = columns?.map((column) => {
      column.options.sortThirdClickReset = true;
      return column;
    });

    setTableColumns(columns);
  }, []);

  useEffect(() => {
    let { columns } = tableProps || {};
    var modified;
    const properties = getProperties();
    pageTableProperties.current = properties;
    modified = retrieveFiltersFromLastVisit(columns);
    retrieveSortOptionsAndSort();
    setTableColumns(modified);
  }, [filtersFromRedux, ignoreSavedFilters]);

  /**
  
   * @param {*} filter 
   */
  const saveSelectedFilters = (filter) => {
    // From 03.06.23  -> Redux is the sole source of truth for table filters
    // From 03.06.23 Onwards, filter items per page are all now saved in one object and set to redux instead of each table filter having it's own space in local storage/redux
    const obj = filtersFromRedux || {};
    localStorage.setItem(
      FILTER_OBJ_KEY,
      JSON.stringify({ ...obj, [CURRENT_TABLE_KEY]: filter }) // This will get loaded into redux onLoad inside <Application />
    );
  };

  const putFiltersInRedux = (filter) => {
    const obj = filtersFromRedux || {};
    sendFilterUpdatesToRedux({ ...obj, [CURRENT_TABLE_KEY]: filter });
  };

  /**
   * How does saving the filter happen?
   * The table gives us the ability to provide a callback function when the filter is changed (i.e onFilterChange)
   * So, we provide a custom callback function that collects the name of the colum that has been selected as filter,
   * and the array of the actual selected filters.
   * Example: A user uses the filter option on the column "name" and selects "Akwesi" and "Frimpong"
   * We create an object that looks like this: { name:"name", list:["Akwesi", "Frimpong"] }
   * Then on, we create another object that stores the selected filters for each column.
   * Like this: { <columnIndexHere>: {thenTheObjectWeJustCreatedWithTheFilters} }
   * NB: When users add more filters from different columns, we repeat the same procedure and just spread the old object
   * to keep the old data.
   * When filters from a column that already has filters is changed, the new object overrides the old one in the same index.
   * Finally, this full object of colums:filter  is stringified and saved to localStorage with the key: page.key + FILTERS.
   * Another copy of this final object is also saved to the filterObject.current object (Ref).
   */
  /**
   * @param {*} column
   * @param {*} filterList
   * @param {*} type
   * @returns
   */

  const onFilterChange = (
    column,
    filterList,
    type,
    changedColumnIndex,
    displayData
  ) => {
    const { columns, options } = tableProps || {};
    //  this changes have been made to allow us apply custom filtering to the table.
    if (options.whenFilterChanges) {
      let { obj, newColumns } = options.whenFilterChanges(
        column,
        filterList,
        type,
        changedColumnIndex,
        displayData
      );

      filterObject.current = obj;
      setTableColumns(newColumns);
      putFiltersInRedux(obj);
      if (saveFilters) saveSelectedFilters(obj);
      return;
    }

    const columnIndex = columns.findIndex((c) => c.name === column);
    const obj = filterObject.current;
    if (columnIndex === -1) return;
    var filter = obj[columnIndex] || {};
    filter = { name: column, type, list: filterList[columnIndex] };
    const newObj = { ...(obj || {}), [columnIndex]: filter };
    filterObject.current = newObj;
    if (saveFilters) saveSelectedFilters(newObj);
  };

  const getProperties = () => {
    if (ignoreSavedFilters) return {};
    const val = localStorage.getItem(page.key + TABLE_PROPERTIES);
    return parseJSON(val || null) || {};
  };

  const savePageProperties = (obj) => {
    if (!obj) return;
    localStorage.setItem(page.key + TABLE_PROPERTIES, JSON.stringify(obj));
  };

  const onSearchChange = (text) => {
    const obj = pageTableProperties.current;
    const newObj = { ...obj, search: text };
    const { options } = tableProps || {};
    pageTableProperties.current = newObj;
    savePageProperties(newObj);
    if (options && options.onSearchChange) options.onSearchChange(text);
  };

  const whenRowsPerPageChanges = (number) => {
    const { options } = tableProps || {};
    const newObj = { ...pageTableProperties, rowsPerPage: number };
    pageTableProperties.current = newObj;
    savePageProperties(newObj);
    if (options && options.onChangeRowsPerPage)
      options.onChangeRowsPerPage(number); // just in case a custom onChangeRowsPerPage function is passed as props, it should still run and not be overwritten
  };

  const whenAdminSortsAColumn = (columnName, direction) => {
    const columnIndex = tableColumns.findIndex((c) => c.name === columnName); // get the index of the column thats been sorted
    const obj = pageTableProperties.current.sortOrder || {}; // look for an existing list of already sorted colums
    if (columnIndex === -1) return;
    retrieveSortOptionsAndSort({
      name: columnName,
      direction,
    });
    const newObj = {
      [columnIndex]: { sortOrder: direction }, // make new sorting object (cos the table can only be sorted one column at a time)
    };
    pageTableProperties.current.sortOrder = newObj; // update the page properties object with the new set of sortDirections
    savePageProperties(pageTableProperties.current); // then save these new changes to localStorage
  };

  var { search, rowsPerPage } = getProperties();
  const options = {
    onFilterChange,
    sortOrder,
    ...(tableProps.options || {}),
    onSearchChange,
    searchText: search || "",
    searchOpen: search ? true : false,
    onChangeRowsPerPage: whenRowsPerPageChanges,
    rowsPerPage: rowsPerPage || tableProps.options?.rowsPerPage,
    onColumnSortChange: whenAdminSortsAColumn,
  };

  return (
    <div className={(classes && classes.table) || ""}>
      <MUIDataTable {...tableProps} options={options} columns={tableColumns} />
    </div>
  );
}
const mapStateToProps = (state) => {
  return { filtersFromRedux: state.getIn(["tableFilters"]) };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      sendFilterUpdatesToRedux: reduxLoadTableFilters,
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(METable);
