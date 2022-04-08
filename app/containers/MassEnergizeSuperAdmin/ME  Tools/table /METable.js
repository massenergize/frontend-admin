
import MUIDataTable from "mui-datatables";
import React, { useEffect, useRef, useState } from "react";

const FILTERS = "_FILTERS";
/**
 * This is a wrapper around MUIDatatables, which will allow us to easily implement
 * features that are general to tables on all of our pages
 * @returns
 */
function METable(props) {
  // filter object contains all selected filters for each column, and saved to a key(number) that represents
  // the index of the column in the columns array.
  const filterObject = useRef({});
  const [tableColumns, setTableColumns] = useState([]);
  const { classes, tableProps, page } = props;

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

  const saveSelectedFilters = (filter) => {
    localStorage.setItem(page.key + FILTERS, JSON.stringify(filter));
  };

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
