import MUIDataTable from "mui-datatables";
import React, { useEffect, useRef, useState } from "react";

const FILTERS = "_FILTERS";
const TABLE_PROPERTIES = "_TABLE_PROPERTIES";
const DIRECTIONS = { descending: "desc", ascending: "asc" };
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

  const {
    classes,
    tableProps,
    page,
    ignoreSavedFilters,
    customFilterObject,
    saveFilters = true,
  } = props;

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
    var filterObj = localStorage.getItem(page.key + FILTERS);
    filterObj = JSON.parse(filterObj || null) || {};
    return inflateWithFilters(columns, filterObj);
  };

  const inflateWithFilters = (columns, filterObj) => {
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

  const retrieveSortOptionsAndSort = (columns) => {
    const properties = getProperties();
    if (!properties.sortDirections) return columns;
    const [columnIndex, sortDirection] = Object.entries(
      properties.sortDirections
    )[0];
    let columnThatNeedsToBeSorted = columns.splice(columnIndex, 1)[0];
    if (!columnThatNeedsToBeSorted) return columns;

    const theOptionsOnThatColumn = columnThatNeedsToBeSorted.options || {};
    // update the target column with the retrieved colum sort direction
    columnThatNeedsToBeSorted = {
      ...columnThatNeedsToBeSorted,
      options: { ...theOptionsOnThatColumn, ...sortDirection },
    };
    columns.splice(columnIndex, 0, columnThatNeedsToBeSorted); // put the column back in the list,and in the same position
    return columns;
  };

  useEffect(() => {
    let { columns } = tableProps || {};
    var modified;
    if (ignoreSavedFilters) {
      modified = inflateWithFilters(columns, customFilterObject || {});
      return setTableColumns(modified);
    }
    const properties = getProperties();
    pageTableProperties.current = properties;
    columns = retrieveSortOptionsAndSort(columns);
    modified = retrieveFiltersFromLastVisit(columns);
    setTableColumns(modified);
  }, [ignoreSavedFilters, customFilterObject]);

  /**
  
   * @param {*} filter 
   */
  const saveSelectedFilters = (filter) => {
    localStorage.setItem(page.key + FILTERS, JSON.stringify(filter));
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
    if(options.onFilterChange){
      let { obj, newColumns } = options.onFilterChange(
        column,
        filterList,
        type,
        changedColumnIndex,
        displayData
      );

      filterObject.current = obj
      saveSelectedFilters(newObj);
      setTableColumns(newColumns);
      return 
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
    if(ignoreSavedFilters) return {}
    const val = localStorage.getItem(page.key + TABLE_PROPERTIES);
    return JSON.parse(val || null) || {};
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
    const obj = pageTableProperties.current.sortDirections || {}; // look for an existing list of already sorted colums
    if (columnIndex === -1) return;
    const newObj = {
      [columnIndex]: { sortDirection: DIRECTIONS[direction] }, // make new sorting object (cos the table can only be sorted one column at a time)
    };
    pageTableProperties.current.sortDirections = newObj; // update the page properties object with the new set of sortDirections
    savePageProperties(pageTableProperties.current); // then save these new changes to localStorage
  };

  var { search, rowsPerPage } = getProperties();
  const options = {
    onFilterChange,
    ...(tableProps.options || {}),
    onSearchChange,
    searchText: search || "",
    searchOpen: search,
    onChangeRowsPerPage: whenRowsPerPageChanges,
    rowsPerPage: rowsPerPage || tableProps.options.rowsPerPage,
    onColumnSortChange: whenAdminSortsAColumn,
  };

  return (
    <div className={(classes && classes.table) || ""}>
      <MUIDataTable {...tableProps} options={options} columns={tableColumns} />
    </div>
  );
}
export default METable;
