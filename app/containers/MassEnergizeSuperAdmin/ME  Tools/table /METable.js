import MUIDataTable from "mui-datatables";
import React, { useEffect, useRef, useState } from "react";

const FILTERS = "_FILTERS";
/**
 * This is a wrapper around MUIDatatables, which will allow us to easily implement
 * features that are general to tables on all of our pages
 * Using MUI Datatable, we are  allowed to pass default filter values for
 * each of the columns. These filters need to be set on the column object.
 * Under options, and into the "filterList" property ( which is an array)
 * @returns
 */
function METable(props) {
  // filter object contains all selected filters for each column, and saved to a key(number) that represents
  // the index of the column in the columns array.
  const filterObject = useRef({});
  const [tableColumns, setTableColumns] = useState([]);
  const { classes, tableProps, page } = props;

   /**
   * This function is called when the component is first rendered.
   * We check local storage and retrieve any saved column filters if available 
   * with the key page.key + FILTERS
   * When the saved filter object is retrieved, we now go over the list of the available 
   * columns and use the indexes of the colums to retrieve the respective filter object for each column 
   * if available. If available, we just pass the filters into the options object as filterList 
   * just like MUI datatable expects. 
   */
  const retrieveFilterFromLastVisit = (columns) => {
    var filterObj = localStorage.getItem(page.key + FILTERS);
    filterObj = JSON.parse(filterObj || null) || {};
    Object.keys(filterObj).forEach((indexOfColumn) => {
      const filter = filterObj[indexOfColumn] || [];
      columns[indexOfColumn].options.filterList = filter.list;
    });
    return columns;
  };

 
  useEffect(() => {
    const { columns } = tableProps || {};
    const modified = retrieveFilterFromLastVisit(columns);
    setTableColumns(modified);
  }, []);

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
  const onFilterChange = (column, filterList, type) => {
    const { columns } = tableProps || {};
    const columnIndex = columns.findIndex((c) => c.name === column);
    const obj = filterObject.current;
    if (columnIndex === -1) return;
    var filter = obj[columnIndex] || {};
    filter = { name: column, type, list: filterList[columnIndex] };
    const newObj = { ...(obj || {}), [columnIndex]: filter };
    saveSelectedFilters(newObj);
  };

  const options = { onFilterChange, ...(tableProps.options || {}) };

  return (
    <div className={(classes && classes.table) || ""}>
      <MUIDataTable {...tableProps} options={options} columns={tableColumns} />
    </div>
  );
}

export default METable;
